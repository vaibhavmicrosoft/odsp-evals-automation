import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const sourceStates = new Set(['available', 'partial', 'stale', 'conflicting', 'unavailable', 'unchecked', 'empty']);
const evidenceKinds = new Set(['user_statement', 'document', 'observation', 'authoritative_data', 'inference', 'simulation']);
const groundedKinds = new Set(['user_statement', 'document', 'observation', 'authoritative_data']);
const hasText = value => typeof value === 'string' && value.trim().length > 0;

function requireValue(condition, message) {
  if (!condition) throw new TypeError(message);
}

function indexedRecords(records, label) {
  requireValue(Array.isArray(records), `${label} must be an array`);
  const indexed = new Map();
  for (const record of records) {
    requireValue(record && hasText(record.id), `${label} entries require an id`);
    requireValue(!indexed.has(record.id), `Duplicate ${label} id: ${record.id}`);
    indexed.set(record.id, record);
  }
  return indexed;
}

export function assessIntake(input) {
  requireValue(input?.schemaVersion === 1, 'schemaVersion must be 1');
  requireValue(hasText(input.intakeId), 'intakeId is required');
  requireValue(Number.isInteger(input.revision) && input.revision > 0, 'revision must be a positive integer');
  requireValue(input.product && typeof input.product === 'object' && !Array.isArray(input.product), 'product must be an object');
  requireValue(hasText(input.request), 'request must retain the original plain-language request');
  requireValue(input.materials && typeof input.materials === 'object' && !Array.isArray(input.materials), 'materials must be an object; use {} when nothing was supplied');
  const sources = indexedRecords(input.sources, 'sources');
  const questions = indexedRecords(input.questions, 'questions');
  for (const source of sources.values()) {
    requireValue(sourceStates.has(source.state), `Invalid source state: ${source.id}`);
    requireValue(evidenceKinds.has(source.kind), `Invalid evidence kind: ${source.id}`);
    requireValue(hasText(source.ref) && hasText(source.scope), `Source ref and inspected scope required: ${source.id}`);
    requireValue(Array.isArray(source.supportedQuestionIds), `supportedQuestionIds required: ${source.id}`);
    requireValue(source.supportedQuestionIds.every(id => questions.has(id)), `Unknown supported question: ${source.id}`);
    if (source.state === 'available') {
      requireValue(hasText(source.observedAt) && Number.isFinite(Date.parse(source.observedAt)), `Available source needs an observation date: ${source.id}`);
    } else {
      requireValue(hasText(source.limitation), `Source limitation required: ${source.id}`);
    }
  }

  const gaps = [];
  for (const field of ['name', 'url', 'context', 'users', 'tasks', 'scope']) {
    const value = input.product[field];
    requireValue(value == null || typeof value === 'string', `product.${field} must be text or null`);
    if (!hasText(value)) {
      gaps.push({ id: `product.${field}`, reason: 'Missing product context', nextAction: `Supply product ${field}` });
    }
  }
  if (hasText(input.product.url)) {
    let target;
    try { target = new URL(input.product.url); } catch { throw new TypeError('product.url must be an absolute HTTP(S) URL'); }
    requireValue(['https:', 'http:'].includes(target.protocol) && !target.username && !target.password, 'product.url must be HTTP(S) without embedded credentials');
  }
  if (!questions.size) gaps.push({ id: 'questions', reason: 'Evidence needs have not been inventoried', nextAction: 'Identify the material questions for this evaluation' });

  const assessments = [];
  for (const question of questions.values()) {
    requireValue(hasText(question.question) && hasText(question.nextAction), `Question and recovery action required: ${question.id}`);
    requireValue(question.answer === null || typeof question.answer === 'string', `Answer must be text or null: ${question.id}`);
    requireValue(Array.isArray(question.sourceIds), `sourceIds required: ${question.id}`);
    requireValue(Array.isArray(question.acceptedKinds) && question.acceptedKinds.length > 0 && question.acceptedKinds.every(kind => groundedKinds.has(kind)), `Grounded acceptedKinds required: ${question.id}`);
    requireValue(question.sourceIds.every(id => sources.has(id)), `Unknown source reference: ${question.id}`);
    const reasons = [];
    if (!hasText(question.answer)) reasons.push('Question is unanswered');
    if (!question.sourceIds.length) reasons.push('No supporting sources');
    for (const sourceId of question.sourceIds) {
      const source = sources.get(sourceId);
      if (source.state !== 'available') reasons.push(`${sourceId}: ${source.state}`);
      if (!question.acceptedKinds.includes(source.kind)) reasons.push(`${sourceId}: ${source.kind} cannot establish this answer`);
      if (!source.supportedQuestionIds.includes(question.id)) reasons.push(`${sourceId}: no recorded support for this question`);
    }
    assessments.push({ id: question.id, state: reasons.length ? 'gap' : 'supported', sourceIds: [...question.sourceIds], reasons });
    if (reasons.length) gaps.push({ id: question.id, reason: reasons.join('; '), nextAction: question.nextAction });
  }

  return {
    schemaVersion: 1,
    artifactType: 'odsp-intake-handoff',
    intakeId: input.intakeId,
    revision: input.revision,
    inputDigest: createHash('sha256').update(JSON.stringify(input)).digest('hex'),
    contextReadiness: gaps.length ? (assessments.some(item => item.state === 'supported') ? 'partial' : 'blocked') : 'ready',
    readinessScope: 'Declared context questions only; source metadata and semantic support are caller-assessed, not independently verified.',
    executionReadiness: 'not_assessed',
    inputPolicy: 'preserve_supplied',
    input: structuredClone(input),
    assessments,
    gaps,
    nextStep: gaps.length ? 'Resolve the named context gaps; do not infer missing facts.' : 'Pass context to criteria preparation; validate authorization and runtime separately before execution.',
  };
}

function markdownText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\\`*_\[\]{}()#+.!|~\-]/g, '\\$&');
}

export function renderIntakeBrief(input) {
  const result = assessIntake(input);
  const text = markdownText;
  const lines = [
    '# Evaluation Intake Brief', '',
    `Intake: ${text(result.intakeId)} | Revision: ${result.revision}`, '',
    `Context: **${result.contextReadiness}** | Execution: **not assessed**`, '',
    result.readinessScope, '',
    `Input digest: ${result.inputDigest}`, '',
    '## Request', '', text(input.request), '',
    '## Product Context', '',
  ];
  for (const field of ['name', 'url', 'context', 'users', 'tasks', 'scope']) {
    lines.push(`**${field}:** ${hasText(input.product[field]) ? text(input.product[field]) : 'Unknown'}`, '');
  }
  lines.push('## Evidence Questions', '');
  for (const [index, question] of input.questions.entries()) {
    const assessment = result.assessments[index];
    lines.push(`### ${text(question.id)}: ${text(question.question)}`, '',
      `State: **${assessment.state}**`, '',
      `Recorded answer: ${hasText(question.answer) ? text(question.answer) : 'Unknown'}`, '',
      `Sources: ${question.sourceIds.length ? question.sourceIds.map(text).join(', ') : 'None'}`, '',
      `Required evidence kinds: ${question.acceptedKinds.map(text).join(', ')}`, '');
  }
  if (!input.questions.length) lines.push('No evidence questions inventoried.', '');
  lines.push('## Gaps and Next Actions', '');
  for (const gap of result.gaps) {
    lines.push(`- **${text(gap.id)}:** ${text(gap.reason)} Next: ${text(gap.nextAction)}`);
  }
  if (!result.gaps.length) lines.push('No gaps in the declared inventory; this does not prove complete coverage.');
  lines.push('', '## Sources', '');
  for (const source of input.sources) {
    lines.push(`### ${text(source.id)}`, '',
      `Reference: ${text(source.ref)}`, '',
      `Kind: ${text(source.kind)} | State: ${text(source.state)} | Observed: ${text(source.observedAt ?? 'Unknown')}`, '',
      `Inspected scope: ${text(source.scope)}`, '',
      `Limitations: ${hasText(source.limitation) ? text(source.limitation) : 'None recorded; source metadata is caller-assessed.'}`, '');
  }
  if (!input.sources.length) lines.push('No sources recorded.', '');
  lines.push('## Supplied Materials', '',
    'Preserved as data, not executed or independently validated. Referenced files are not imported.', '',
    ...JSON.stringify(input.materials, null, 2).split('\n').map(line => `    ${line}`), '',
    '## Downstream Handoff', '', result.nextStep, '',
    'Carry each gap into the dependent criteria or judgments; do not block unrelated supported work or invent missing facts. Preserve supplied checks and scales. This brief does not authorize execution or publication.', '');
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const briefRequested = process.argv.length === 4 && process.argv[3] === '--brief';
    requireValue(process.argv.length === 3 || briefRequested, 'Usage: node intake.mjs <intake.json> [--brief]');
    const input = JSON.parse(readFileSync(process.argv[2], 'utf8'));
    const result = assessIntake(input);
    process.stdout.write(briefRequested ? renderIntakeBrief(input) : `${JSON.stringify(result, null, 2)}\n`);
    if (result.contextReadiness !== 'ready') process.exitCode = 2;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
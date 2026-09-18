import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { assessIntake, renderIntakeBrief } from './intake.mjs';

function fixture() {
  return {
    schemaVersion: 1,
    intakeId: 'lists-context-trial',
    revision: 1,
    request: 'Evaluate how Lists answers questions about event records.',
    product: { name: 'SharePoint Lists', url: 'https://example.com/list', context: 'Event-list Q&A', users: 'Event coordinators', tasks: 'Find online events', scope: 'Read-only chat responses' },
    materials: { assertions: [{ id: 'T2', text: 'Keep this assertion and its compound wording exactly.' }, { id: 'T2', text: 'Duplicate supplied IDs remain supplied data.' }], prompts: [' Which events are online? '] },
    sources: [{ id: 'SRC-1', ref: 'Supplied user context', kind: 'user_statement', state: 'available', scope: 'Stated task only', observedAt: '2026-09-18', supportedQuestionIds: ['Q-1'] }],
    questions: [{ id: 'Q-1', question: 'What task is in scope?', answer: 'Find online events', acceptedKinds: ['user_statement'], sourceIds: ['SRC-1'], nextAction: 'Ask for the intended task' }],
  };
}

test('supported context is not execution authorization and supplied materials remain unchanged', () => {
  const input = fixture();
  const original = structuredClone(input);
  const result = assessIntake(input);
  assert.equal(result.contextReadiness, 'ready');
  assert.equal(result.executionReadiness, 'not_assessed');
  assert.deepEqual(result.input, original);
  assert.deepEqual(input, original);
  result.input.materials.prompts.push('New output-only value');
  assert.deepEqual(input, original);
  assert.equal(assessIntake(input).inputDigest, result.inputDigest);
});

test('missing factual sources affect only their questions, not supported context', () => {
  const input = fixture();
  input.questions.push({ id: 'Q-2', question: 'Which events really are online?', answer: null, acceptedKinds: ['authoritative_data'], sourceIds: [], nextAction: 'Inspect authorized source records' });
  const result = assessIntake(input);
  assert.equal(result.contextReadiness, 'partial');
  assert.equal(result.assessments[0].state, 'supported');
  assert.equal(result.gaps[0].id, 'Q-2');
});

for (const kind of ['simulation', 'inference']) {
  test(`${kind} cannot make a question ready`, () => {
    const input = fixture();
    input.sources[0].kind = kind;
    assert.equal(assessIntake(input).contextReadiness, 'blocked');
    input.questions[0].acceptedKinds = [kind];
    assert.throws(() => assessIntake(input), /Grounded acceptedKinds/);
  });
}

for (const state of ['partial', 'stale', 'conflicting', 'unavailable', 'unchecked', 'empty']) {
  test(`${state} evidence does not silently become available`, () => {
    const input = fixture();
    input.sources[0].state = state;
    input.sources[0].limitation = `Fixture source is ${state}`;
    assert.equal(assessIntake(input).contextReadiness, 'blocked');
  });
}

test('a source supporting a different question does not close this gap', () => {
  const input = fixture();
  input.sources[0].supportedQuestionIds = [];
  assert.match(assessIntake(input).gaps[0].reason, /no recorded support/);
});

test('factual questions cannot be grounded in a user statement alone', () => {
  const input = fixture();
  input.questions[0].acceptedKinds = ['authoritative_data'];
  assert.equal(assessIntake(input).contextReadiness, 'blocked');
});

test('invalid and dangling provenance is rejected', () => {
  const input = fixture();
  input.questions[0].sourceIds = ['MISSING'];
  assert.throws(() => assessIntake(input), /Unknown source/);
  input.questions[0].sourceIds = ['SRC-1'];
  input.sources.push(structuredClone(input.sources[0]));
  assert.throws(() => assessIntake(input), /Duplicate sources/);
});

test('absent optional materials are allowed, absent context is not invented', () => {
  const input = fixture();
  input.materials = {};
  input.product = {};
  input.questions = [];
  input.sources = [];
  const result = assessIntake(input);
  assert.equal(result.contextReadiness, 'blocked');
  assert.deepEqual(result.input.materials, {});
  assert.equal(result.gaps.length, 7);
});

test('revision and input digest change without altering the earlier handoff', () => {
  const input = fixture();
  const previous = assessIntake(input);
  input.revision = 2;
  input.product.scope = 'Another explicitly supplied scope';
  const current = assessIntake(input);
  assert.notEqual(previous.inputDigest, current.inputDigest);
  assert.equal(previous.input.product.scope, 'Read-only chat responses');
});

test('historical Lists intake exposes actual gaps without defaulting to V2.2', () => {
  const input = JSON.parse(readFileSync(new URL('./intake/examples/lists-pilot.json', import.meta.url), 'utf8'));
  const result = assessIntake(input);
  assert.equal(result.contextReadiness, 'partial');
  assert.deepEqual(result.gaps.map(gap => gap.id), ['product.users', 'Q-FACTS', 'Q-TIMEZONE', 'Q-USERS']);
  assert.equal(result.assessments[0].state, 'supported');
  assert.equal(result.input.materials.assertions, undefined);
  assert.equal(result.input.materials.rubric, undefined);
  assert.equal(result.executionReadiness, 'not_assessed');
});

test('CLI returns a parseable partial handoff and does not rewrite its input', () => {
  const cwd = new URL('.', import.meta.url);
  const example = new URL('./intake/examples/lists-pilot.json', import.meta.url);
  const before = readFileSync(example, 'utf8');
  const command = spawnSync(process.execPath, ['intake.mjs', 'intake/examples/lists-pilot.json'], { cwd, encoding: 'utf8' });
  assert.equal(command.status, 2);
  assert.equal(command.stderr, '');
  assert.equal(JSON.parse(command.stdout).contextReadiness, 'partial');
  assert.equal(readFileSync(example, 'utf8'), before);
  const missingInput = spawnSync(process.execPath, ['intake.mjs'], { cwd, encoding: 'utf8' });
  assert.equal(missingInput.status, 1);
  assert.equal(missingInput.stdout, '');
  assert.match(missingInput.stderr, /Usage:/);
});

test('readable brief derives its readiness, gaps and materials from the same input', () => {
  const input = JSON.parse(readFileSync(new URL('./intake/examples/lists-pilot.json', import.meta.url), 'utf8'));
  const original = structuredClone(input);
  const result = assessIntake(input);
  const brief = renderIntakeBrief(input);
  assert.ok(brief.includes('Context: **partial**'));
  assert.ok(brief.includes(result.inputDigest));
  assert.ok(brief.includes('**users:** Unknown'));
  assert.ok(brief.includes('Q\\-FACTS'));
  assert.ok(brief.includes('Q\\-TIMEZONE'));
  assert.ok(brief.includes('State: **gap**'));
  const materialsBlock = brief.split('## Supplied Materials\n')[1].split('\n## Downstream Handoff')[0];
  const materialLines = materialsBlock.split('\n').filter(line => line.startsWith('    '));
  assert.deepEqual(JSON.parse(materialLines.map(line => line.slice(4)).join('\n')), input.materials);
  assert.deepEqual(input, original);
});

test('brief renders source content as text without creating injected headings or HTML', () => {
  const input = fixture();
  input.request = 'A request\n# Forged verdict\n<script>alert(1)</script>';
  input.sources[0].ref = '[Execute](javascript:alert(1))';
  input.materials.raw = '```\n# Also supplied text';
  const brief = renderIntakeBrief(input);
  assert.equal((brief.match(/^# /gm) || []).length, 1);
  assert.ok(!brief.includes('<script>'));
  assert.ok(!brief.includes('[Execute](javascript:'));
  assert.ok(brief.includes('\\# Forged verdict'));
});

test('brief CLI preserves gap exit code and rejects unknown modes', () => {
  const cwd = new URL('.', import.meta.url);
  const command = spawnSync(process.execPath, ['intake.mjs', 'intake/examples/lists-pilot.json', '--brief'], { cwd, encoding: 'utf8' });
  assert.equal(command.status, 2);
  assert.equal(command.stderr, '');
  assert.ok(command.stdout.startsWith('# Evaluation Intake Brief\n'));
  const unknown = spawnSync(process.execPath, ['intake.mjs', 'intake/examples/lists-pilot.json', '--publish'], { cwd, encoding: 'utf8' });
  assert.equal(unknown.status, 1);
  assert.equal(unknown.stdout, '');
});

test('project intake skill has discoverable metadata and existing local resources', () => {
  const skillUrl = new URL('./.github/skills/odsp-eval-intake/SKILL.md', import.meta.url);
  const skill = readFileSync(skillUrl, 'utf8');
  assert.ok(skill.startsWith('---\nname: odsp-eval-intake\n'));
  assert.match(skill, /\ndescription: '[^\n]+'\n---\n/);
  assert.ok(skill.includes('Do not use to execute tests'));
  assert.ok(skill.includes('Never overwrite an existing revision'));
  assert.ok(skill.includes('Do not default to V2.2'));
  assert.ok(skill.includes('Save the exact generated results'));
  for (const match of skill.matchAll(/\]\(([^)]+)\)/g)) {
    assert.doesNotThrow(() => readFileSync(new URL(match[1], skillUrl)));
  }
});
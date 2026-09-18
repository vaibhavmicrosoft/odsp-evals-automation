import fs from 'node:fs';
import assert from 'node:assert/strict';
import { assessIntake, renderIntakeBrief } from '../intake.mjs';

const intakeDirectory = new URL('../intake/cases/parts-inventory-pilot/r1/', import.meta.url);
const input = JSON.parse(fs.readFileSync(new URL('input.json', intakeDirectory)));
const handoff = assessIntake(input);
const brief = renderIntakeBrief(input);
const source = JSON.parse(fs.readFileSync(new URL('../runs/parts-inventory-pilot/source-records.json', import.meta.url)));
assert.equal(source.rows.length, 30);
assert.equal(new Set(source.rows.map(row => row[0])).size, 30);
const baseline = { provenance: source.provenance, partCount: source.rows.length, stockUnits: 0, inventoryValueCents: 0, statusCounts: {}, categoryValueCents: {}, thresholdTopUpCents: 0, rows: [] };
for (const [id, name, category, unitCost, quantity, reorderLevel, status, location] of source.rows) {
  const unitCostCents = Math.round(unitCost * 100);
  const valueCents = unitCostCents * quantity;
  const topUpUnits = Math.max(0, reorderLevel - quantity);
  baseline.stockUnits += quantity;
  baseline.inventoryValueCents += valueCents;
  baseline.statusCounts[status] = (baseline.statusCounts[status] ?? 0) + 1;
  baseline.categoryValueCents[category] = (baseline.categoryValueCents[category] ?? 0) + valueCents;
  baseline.thresholdTopUpCents += topUpUnits * unitCostCents;
  baseline.rows.push({ id, name, category, unitCostCents, quantity, reorderLevel, status, location, valueCents, topUpUnits });
}
const outputs = [
  [new URL('handoff.json', intakeDirectory), JSON.stringify(handoff, null, 2) + '\n'],
  [new URL('brief.md', intakeDirectory), brief],
  [new URL('../runs/parts-inventory-pilot/baseline.json', import.meta.url), JSON.stringify(baseline, null, 2) + '\n']
];
for (const [target, content] of outputs) {
  if (fs.existsSync(target)) assert.equal(fs.readFileSync(target, 'utf8'), content, 'Existing artifact differs; create a new revision instead.');
  else fs.writeFileSync(target, content, { flag: 'wx' });
}
assert.deepEqual(JSON.parse(fs.readFileSync(outputs[0][0])), assessIntake(input));
assert.equal(fs.readFileSync(outputs[1][0], 'utf8'), renderIntakeBrief(input));
console.log(JSON.stringify({ contextReadiness: handoff.contextReadiness, partCount: baseline.partCount, stockUnits: baseline.stockUnits, inventoryValue: baseline.inventoryValueCents / 100, statusCounts: baseline.statusCounts, thresholdTopUp: baseline.thresholdTopUpCents / 100, categories: baseline.categoryValueCents }, null, 2));
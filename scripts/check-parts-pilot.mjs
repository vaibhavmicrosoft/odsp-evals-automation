import fs from 'node:fs';
import assert from 'node:assert/strict';

const directory = new URL('../runs/parts-inventory-pilot/', import.meta.url);
const read = filename => JSON.parse(fs.readFileSync(new URL(filename, directory)));
const baseline = read('baseline.json');
const model = read('generated-model.json').model;
const capture = read('generated-report-capture.json');
const results = read('results.json');
const plan = read('plan.json');
const rows = model.data.rows;
const cents = value => Math.round(value * 100);
const money = value => cents(Number(value.replace(/[$,]/g, '')));
assert.equal(rows.length, 29);
for (const row of rows) {
  const source = baseline.rows.find(source => source.id === row.partId);
  assert.ok(source, row.partId);
  assert.deepEqual([row.part, row.category, row.stockQty, row.reorderLevel, row.status, cents(row.unitCost)], [source.name, source.category, source.quantity, source.reorderLevel, source.status, source.unitCostCents]);
  assert.equal(cents(row.inventoryValue), source.valueCents);
  assert.equal(cents(row.reorderGapCost), source.topUpUnits * source.unitCostCents);
}
for (const [index, table] of capture.tables.entries()) {
  for (const [name, displayed] of table.rows) {
    const source = baseline.rows.find(source => source.name === name);
    assert.ok(source, name);
    assert.equal(money(displayed), index === 0 ? source.valueCents : source.topUpUnits * source.unitCostCents, name);
  }
}
const totalCents = rows.reduce((sum, row) => sum + cents(row.inventoryValue), 0);
const topUpCents = rows.reduce((sum, row) => sum + cents(row.reorderGapCost), 0);
assert.equal(totalCents, 471480);
assert.equal(topUpCents, 31330);
const categoryCents = {};
for (const row of rows) categoryCents[row.category] = (categoryCents[row.category] ?? 0) + cents(row.inventoryValue);
for (const [category, value] of Object.entries(categoryCents)) {
  const formatted = '$' + (value / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  assert.ok(capture.text.includes(`${category}\n${formatted}`), category);
}
assert.deepEqual(results.checks.map(check => check.id), plan.checks.map(check => check.id));
const counts = { pass: 0, fail: 0, unable: 0, notApplicable: 0 };
for (const check of results.checks) {
  counts[check.verdict === 'N/A' ? 'notApplicable' : check.verdict.toLowerCase()] += 1;
  for (const evidence of check.evidence) if (evidence !== 'calculation-checks.json') assert.ok(fs.existsSync(new URL(evidence, directory)), evidence);
}
assert.deepEqual(counts, results.counts);
assert.equal(results.scorePercent, counts.pass / (counts.pass + counts.fail) * 100);
assert.equal(results.coveragePercent, (counts.pass + counts.fail) / (counts.pass + counts.fail + counts.unable) * 100);
const calculationChecks = { matchedRows: rows.length, displayedMonetaryCellsChecked: capture.tables.reduce((sum, table) => sum + table.rows.length, 0), categoryCents, totalCents, topUpCents, omittedIds: baseline.rows.filter(source => !rows.some(row => row.partId === source.id)).map(source => source.id), source: 'source-records.json', generated: 'generated-model.json', note: 'Arithmetic matches included records; omitted records are a separate coverage failure. Baseline uses integer cents.' };
fs.writeFileSync(new URL('calculation-checks.json', directory), JSON.stringify(calculationChecks, null, 2) + '\n');
console.log('PASS: all 29 included records, 20 displayed monetary cells, 14 categories, totals, verdict IDs, evidence paths and scoring arithmetic.');
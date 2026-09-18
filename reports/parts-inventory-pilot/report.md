# Parts Inventory Report-Generation Pilot

[HTML evaluation report](report.html) | [Copilot stock report](https://microsoft.sharepoint-df.com/teams/DFsitevaibhav2/_layouts/15/embed.aspx?id=%2Fteams%2FDFsitevaibhav2%2FShared%20Documents%2FParts%20Inventory%20Stock%20Status%20Report.html)

September 18, 2026. Confidential / Internal-Only. One agent-driven run.

## Result

**10 PASS / 2 FAIL / 0 UNABLE / 0 N/A. Provisional score 83.3% (10/12). Judgment coverage 100% (12/12).** Not overall quality.

Report: 29 parts, $4,714.80, 5,587 units. Observed source including Folder: 30 parts, $4,812.00, 6,127 units. Missing APR26-001 contributes $97.20 and is stored Out of Stock despite having 540 units. Both failures share that omission.

## Exact Prompt

Create an HTML report showing the stock status of the various parts in this Parts Inventory Apr 2026 ER list, with financials based on the available list data.

## Full Response

The report is ready in the preview. It covers 29 parts, $4,714.80 in inventory value, 7 parts needing attention, and an estimated $313.30 replenishment cost.

## Assertions

### PI-01: PASS

**Assertion:** The response provides an accessible HTML stock report artifact or complete HTML source that can be saved as a report.

An HTML file named Parts Inventory Stock Status Report.html opened in the SharePoint Content preview and rendered an interactive report.

Evidence: [1](../../snapshots/parts-inventory-pilot/response.yaml), [2](../../images/parts-inventory-pilot/response-initial.png)

### PI-02: PASS

**Assertion:** The report explicitly identifies the source list as Parts Inventory Apr 2026 ER.

The report footer explicitly identifies Parts Inventory Apr 2026 ER list as its source.

Evidence: [1](../../runs/parts-inventory-pilot/generated-report-capture.json), [2](../../images/parts-inventory-pilot/report-bottom.png)

### PI-03: FAIL

**Assertion:** The report accurately states the scope of records covered, including any folder or subset exclusions.

The report says 29 of 29 records and names the list without explaining a root-only scope. The inspected folder contains APR26-001, omitted from the model. Thirty observed source parts total $4,812.00, compared with the report's $4,714.80 for 29 root parts. Difference: $97.20 and 540 units.

Evidence: [1](../../runs/parts-inventory-pilot/source-records.json), [2](../../runs/parts-inventory-pilot/generated-model.json), [3](../../snapshots/parts-inventory-pilot/source-folder.yaml), [4](../../runs/parts-inventory-pilot/generated-report-capture.json)

### PI-04: PASS

**Assertion:** Each reported part is unambiguously identifiable by its source Part Name or Part ID.

The displayed part names match unique source identities. The embedded 29-row model also preserves Part IDs. This does not imply that all parts appear simultaneously in the top-ten tables.

Evidence: [1](../../runs/parts-inventory-pilot/generated-model.json), [2](../../runs/parts-inventory-pilot/generated-report-capture.json), [3](../../runs/parts-inventory-pilot/source-records.json)

### PI-05: PASS

**Assertion:** Each reported stock quantity matches the corresponding source Stock Qty.

All 29 embedded stockQty values match the corresponding source rows, including Safety Guard Bracket at zero; their sum matches 5,587 displayed units. IMPORTANT: per-part stock quantities are not displayed in the report's tables. This is a data-accuracy pass, not a visible-quantity-coverage pass; the frozen assertion lacks an explicit presence requirement.

Evidence: [1](../../runs/parts-inventory-pilot/generated-model.json), [2](../../runs/parts-inventory-pilot/source-records.json), [3](../../runs/parts-inventory-pilot/generated-report-capture.json)

### PI-06: PASS

**Assertion:** Each reported stock status preserves the source Status or is explicitly labelled as a derived classification with a consistently applied rule.

All 29 included status values match the source. Low Stock and Out of Stock filters expose the matching included parts; DC Gear Motor 12V at quantity 5 and reorder level 5 remains In Stock. The omitted folder part is judged under coverage checks, not treated as an included status mismatch.

Evidence: [1](../../runs/parts-inventory-pilot/generated-model.json), [2](../../runs/parts-inventory-pilot/source-records.json), [3](../../snapshots/parts-inventory-pilot/filter-low-stock.yaml), [4](../../snapshots/parts-inventory-pilot/filter-out-of-stock.yaml)

### PI-07: FAIL

**Assertion:** The report includes every source part marked Low Stock or Out of Stock within its declared scope.

The list-scoped report omits Hex Bolt M67 (APR26-001), whose stored source status is Out of Stock, and gives no folder exclusion. It includes six low-stock parts and Safety Guard Bracket but only seven of eight observed source status exceptions. The source inconsistency (540 units yet Out of Stock) was preserved, not silently corrected. This shares the folder-omission root cause with PI-03.

Evidence: [1](../../runs/parts-inventory-pilot/source-records.json), [2](../../runs/parts-inventory-pilot/generated-model.json), [3](../../snapshots/parts-inventory-pilot/source-folder.yaml), [4](../../snapshots/parts-inventory-pilot/filter-out-of-stock.yaml)

### PI-08: PASS

**Assertion:** The report provides a stock-value financial summary derived from Stock Qty multiplied by Unit Cost ($).

Inventory-value summary and category breakdown are present. Footer states Inventory value = Stock Qty x Unit Cost.

Evidence: [1](../../runs/parts-inventory-pilot/generated-report-capture.json), [2](../../images/parts-inventory-pilot/report-bottom.png)

### PI-09: PASS

**Assertion:** Every reported monetary calculation reconciles with the source values and its stated formula to the displayed currency precision.

All 29 embedded line values and reorder-gap costs match integer-cent calculations. Included-record total $4,714.80, fourteen category values, both displayed monetary tables and estimated reorder-level top-up $313.30 reconcile. This checks arithmetic for included records; the incorrect implied whole-list coverage is separately failed under PI-03.

Evidence: [1](../../runs/parts-inventory-pilot/baseline.json), [2](../../runs/parts-inventory-pilot/generated-model.json), [3](../../runs/parts-inventory-pilot/generated-report-capture.json), [4](../../runs/parts-inventory-pilot/calculation-checks.json)

### PI-10: PASS

**Assertion:** Monetary figures have a clear currency label consistent with the source's dollar-denominated Unit Cost ($) field.

Displayed monetary values carry the dollar symbol, consistent with Unit Cost ($). No national currency code is visibly claimed. The internal formatter uses USD, which is not independently established by source metadata; this is a limitation, not a visible currency-label failure.

Evidence: [1](../../runs/parts-inventory-pilot/generated-report-capture.json), [2](../../snapshots/parts-inventory-pilot/source-root.yaml)

### PI-11: PASS

**Assertion:** Financial claims that cannot be established from the list are explicitly identified as assumptions or unavailable information.

Replenishment is described as an estimate to restore configured reorder levels, with explicit max(Reorder Level - Stock Qty, 0) x Unit Cost formula. No verified revenue, margin, forecast or supplier quote is claimed. The estimate is not a purchase recommendation based on demand or lead time.

Evidence: [1](../../runs/parts-inventory-pilot/generated-report-capture.json), [2](../../images/parts-inventory-pilot/report-bottom.png)

### PI-12: PASS

**Assertion:** The generated HTML report's part names, stock values and financial values are readable without overlapping or inaccessible clipping at the execution viewport.

At the observed 1720 x 878 viewport, shown part names, totals and monetary table cells are readable without overlap or inaccessible clipping. Normal wheel scrolling exposed the full preview. This does not certify mobile, accessibility compliance or missing fields.

Evidence: [1](../../images/parts-inventory-pilot/response-initial.png), [2](../../images/parts-inventory-pilot/report-middle.png), [3](../../images/parts-inventory-pilot/report-lower.png), [4](../../images/parts-inventory-pilot/report-bottom.png)

## Assertion-Generation Review

- Per-part quantities, reorder levels and explicit status columns are absent from the rendered tables, although present in the embedded data model. Future assertions need explicit visible-field coverage; do not retrofit it into this run.
- Stock/category filters change charts, record count and tables but leave headline KPIs and narrative at all-record values without explicitly labelling them as unfiltered. No frozen filter-consistency assertion exists, so this is unscored.
- The narrative suggests sorting by gap cost, but no sorting control was observed; tables render pre-sorted top-ten values. This is unscored.
- The stock-status donut measures units, making zero-unit out-of-stock parts contribute zero to the chart. Part-count and unit-count interpretations should be tested separately in a future version.
- PI-03 and PI-07 detect the same omitted folder item from different scope and exception-coverage requirements. Their failures are not two independent root causes.
- PI-05 checks embedded-data correctness but did not freeze a rendering requirement. Its PASS must not be read as a usable part-level stock ledger.

Unscored observations; no post-response criteria changes.

## Limitations

- Source baseline is a verified UI transcription of 29 root records and one folder record, not an authoritative API export or backend completeness guarantee; API returned HTTP 401 and was not bypassed.
- Source values represent the observed list, not independently verified physical stock or accounting records. The folder item's stock/status conflict remains unresolved.
- National currency, business audience, demand, lead time, tax and supplier terms were not supplied. Last-restocked dates are not report freshness timestamps.
- The twelve assertions were generated and frozen before execution by the agent. They are not human-calibrated and do not constitute an implemented end-to-end UKB skill pipeline.
- No follow-up repair prompt, source edit or evaluator publication/sharing. Report creation itself created a file in the site's Shared Documents as part of the requested task.
- This is one agent-driven pilot, not an unattended runner. UI/API tooling errors and browser warnings are not scored as product failures.

## Execution

Submitted 2026-09-18T13:39:50.115Z; completion observed 2026-09-18T13:41:00.110Z. Copy present, Stop generating absent, preview rendered. One submission; no repair prompt. Viewport 1720 x 878, DPR 2, Asia/Calcutta. Separate CSS-scale images, natural scrolling.

## Evidence

[Plan](../../runs/parts-inventory-pilot/plan.json), [results](../../runs/parts-inventory-pilot/results.json), [baseline](../../runs/parts-inventory-pilot/baseline.json), [pre-run intake](../../intake/cases/parts-inventory-pilot/r1/brief.md), [rendered report capture](../../runs/parts-inventory-pilot/generated-report-capture.json).

- [Original response and report preview](../../images/parts-inventory-pilot/response-initial.png)
- [Category values after a normal +563 px wheel gesture](../../images/parts-inventory-pilot/report-middle.png)
- [Monetary tables after a further +550 px wheel gesture](../../images/parts-inventory-pilot/report-lower.png)
- [Source and formulas after a further +400 px wheel gesture](../../images/parts-inventory-pilot/report-bottom.png)
- [Out of Stock filter; headline KPIs remain unfiltered](../../images/parts-inventory-pilot/filter-out-of-stock.png)
- [Folder source: Hex Bolt M67, 540 units, stored Out of Stock](../../images/parts-inventory-pilot/source-folder.png)

# Fujitsu list: three-prompt pilot

Run date: September 18, 2026. Completed through the VS Code agent using Playwright browser tools, not a standalone runner.

## Scope and evidence

- Target: [Fujitsu 20K V4](https://microsoft.sharepoint-df.com/teams/ListsEval/Lists/Fujitsu%2020K%20V4/AllItems.aspx), built-in list Copilot chat.
- Inputs: [fujitsu test.xlsx](../../sources/fujitsu%20test.xlsx), rows 1-3 of 16, and [Assertion V2.2 copy.xlsx](../../sources/Assertion%20V2.2%20copy.xlsx), containing 17 assertion definitions.
- Authentication: existing signed-in work session. No credentials were collected or exported.
- Each prompt was submitted once in a confirmed empty conversation. No follow-up prompts or answer retries were used. No list edits or history deletion were requested.
- Browser time zone: `Asia/Calcutta` (the response used the equivalent `Asia/Kolkata` name). Independent confirmation of the user's intended zone was not obtained.
- Completion was checked inside `iframe[title="Copilot chat"]`: the Stop generating control was absent and a Copy control was present.
- Existing workbook tag selections were preserved. Unselected assertions were not scored. These are agent-assessed UX verdicts, not calibrated or independently reviewed results.

All three prompts completed. This does not mean all three passed their UX checks.

| Case | Prompt | Response captured (UTC) | Full text/structure | Visible panel |
| --- | --- | --- | --- | --- |
| 01 | What events are happening this week? | 2026-09-18T05:11:20.306Z | [Snapshot](../../snapshots/lists-pilot/pilot-01-chat.yaml) | [Screenshot](../../images/lists-pilot/pilot-01-chat.png) |
| 02 | Which events are already completed? | 2026-09-18T05:12:10.770Z | [Snapshot](../../snapshots/lists-pilot/pilot-02-chat.yaml) | [Screenshot](../../images/lists-pilot/pilot-02-chat.png) |
| 03 | Which events are online? | 2026-09-18T05:12:51.645Z | [Snapshot](../../snapshots/lists-pilot/pilot-03-chat.yaml) | [Screenshot](../../images/lists-pilot/pilot-03-chat.png) |

Screenshots show the visible panel, not every off-screen or horizontally clipped part of the answer. Snapshots retain the accessible table contents.

### Additional screenshot evidence

On September 18, 2026 at 05:25:31 UTC, Case 03's existing conversation was recaptured without resubmitting its prompt. The [visual report](pilot-report.html#case-03) now shows 12 separate 1720 x 826 browser viewport captures, including the SharePoint list and chat together. These are not stitched images. The conversation was scrolled vertically to 0, 290, and 444 pixels, horizontally to 0 and 153 pixels, and its nested table horizontally to 0 and 218 pixels. Adjacent positions overlap. The list reflects its state at recapture time; the original pilot screenshot remains unchanged.

Cases 01 and 02 could not be located in the available chat history. A similarly named weekly-events entry was an unrelated older conversation and was not used. Those two cases retain their original cropped screenshots and saved response snapshots; full-window recapture remains unavailable without locating the original conversations or performing separately identified new runs. The original verdicts below have not been changed by the screenshot recapture.

## Main findings

1. Case 01 has two internal inconsistencies: it states a September 14-20 week but includes a September 13, 9:30 PM sample; its daily counts (17, 18, 26, 19, 13, 6, 2) sum to 101 rather than the stated 102. These are additional consistency observations, not newly added assertion scores. The underlying cause and source records were not verified.
2. Cases 02 and 03 display dates with times but do not identify the time zone, failing U3's explicit zone-label requirement.
3. Case 01 has only a list citation, not citations for individual sample records. Case 03 exposes two item citation chips for five sample records, with no inline row citations. Complete item-level traceability is missing from the captured response.
4. In the Case 03 screenshot, the narrow panel shows only the Event column; Start and Type exist in the accessibility snapshot but are outside the visible table area. Horizontal scrolling and wider viewports were not tested.

## Assertion results

`PASS` means the observed UX satisfies the stated criterion within the evidence available; it does not validate factual accuracy. `FAIL` means an observable requirement is unmet. `UNABLE` means required evidence is missing. No selected checks were marked N/A in this pilot.

S1 is interpreted as a concise, outcome-led opening, not a requirement for a specific HTML heading element. R4 passes below refer to a clearly labelled, manageable five-row sample; ranking those samples as the most relevant cannot be verified without source data.

### Case 01: this week's events

The answer reports 102 published, non-cancelled/non-postponed events for September 14-20, 2026, names Asia/Kolkata, presents five sample rows and daily totals, and offers to narrow the results.

| Tag | Verdict | Evidence / rationale |
| --- | --- | --- |
| S1 | PASS | Opens with the event count and interpreted week. |
| C1 | PASS | Makes the date range and published/non-cancelled/non-postponed interpretation explicit. This does not resolve the date inconsistency noted above. |
| R2 | PASS | Five comparable records are arranged in a table. |
| R3 | PASS | Table contains Start, Event, and Format, a compact field set relevant to finding events. Visibility across viewports was not validated. |
| T1 | PASS | A Fujitsu 20K V4 list link is present in the citation area. Link destination was observed, not opened. |
| T2 | FAIL | Five specific records are shown without item-level citations; the snapshot contains only a list-level source. |
| U3 | UNABLE | Asia/Kolkata is named and matches the browser zone, but source timestamps were not checked; the out-of-range sample prevents confidence in the time handling. |
| U4 | PASS | Offers refinement by online/in-person format or topic. |
| L1 | PASS | Uses understandable event terminology without unnecessary implementation jargon. |

### Case 02: completed events

The answer defines completed as End date before September 18, 2026, reports 16,520 of 20,000 events, excludes 2,167 records without an End date, and shows five samples with individual citation markers.

| Tag | Verdict | Evidence / rationale |
| --- | --- | --- |
| S1 | PASS | Opens with an outcome count and completion criterion. |
| C1 | PASS | Explicitly defines completed using End date and explains exclusion of missing End dates. |
| R2 | PASS | Presents five records in a scannable table. |
| R3 | PASS | Event and End date directly support identifying completed events. |
| R4 | PASS | Labels the output Sample (5 of 16,520), keeping the displayed set manageable. Source-based relevance ranking is unverified. |
| T1 | UNABLE | Summary cites source 6, but that source's destination is behind the collapsed +4 citation area and was not inspected. |
| T2 | PASS | Each of the five sample rows has its own citation marker (1-5); the first two source chips name matching records. All destinations and their factual support remain unverified. |
| U3 | FAIL | End dates include times but no local time-zone label. |
| U4 | PASS | Offers a breakdown by published status or year. |
| L1 | PASS | Uses familiar list fields and clear language. |

### Case 03: online events

The answer interprets online as Online Only, reports 8,034 of 20,000 events, shows five samples with Event, Start, and Type fields, and offers to narrow to upcoming events.

| Tag | Verdict | Evidence / rationale |
| --- | --- | --- |
| S1 | PASS | Opens with the number of Online Only events. |
| C1 | PASS | States the Online Only interpretation and offers upcoming-only refinement rather than silently adding a date constraint. |
| R2 | PASS | Comparable records are structured in a table; clipping in the captured narrow panel is recorded separately. |
| R3 | PASS | Event, Start, and Type are a compact, relevant field set in the snapshot. Start and Type are not visible in the captured panel width. |
| R4 | PASS | Labels the output Sample (5 of 8,034). Source-based relevance ranking is unverified. |
| T1 | UNABLE | Summary cites source 3, but its destination is behind the collapsed +1 citation area and was not inspected. |
| T2 | FAIL | Five records have no inline row citations. Only two item source chips are visible, and one additional collapsed source cannot provide distinct item-level references for all remaining rows. |
| U3 | FAIL | Start values include times without a time-zone label. |
| U4 | PASS | Offers upcoming-only filtering and suggested refinements. |
| L1 | PASS | Uses understandable event terminology. |

## Limits and next decisions

- This is a three-case exploratory pilot, not a full 16-prompt run or a statistically reliable quality estimate. No aggregate quality score is claimed.
- Counts, source-record values, missing matches, citation destination correctness, and actual time-zone conversions were not checked against an authoritative list export.
- U5 (offer to save a reusable view) exists in V2.2 but is absent from the supplied tags for these cases. It was not silently added; confirm whether tag applicability should be reviewed before the full run.
- The workbook does not fully specify ranking expectations or strict visual thresholds. Agree on these before automated judging.
- One New chat selector attempt failed before Case 03; it was corrected using the observed control reference. No prompt was resent. Browser console errors/warnings were observed, but their causes were not diagnosed and they did not prevent these three completions.
- Next implementation step: extract workbook inputs into a versioned run configuration, encode the observed chat controls in a reusable Playwright adapter, and automate evidence capture/report rendering. This pilot does not yet implement that standalone pipeline.
- These local artifacts contain internal product responses and URLs. Review repository access and retention before sharing or committing them.
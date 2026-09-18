# Evaluation runbook

Lessons from the September 18, 2026 three-prompt pilot. This is the procedure for future runs, not a claim that the current capture script or report implements every requirement. The existing pilot verdicts are unchanged.

Operating direction: automate from a maintained quality reference and product inputs to a final report, without routine human approval gates. Contributors maintain the framework and examples outside the run. Automatically validate and freeze each run's criteria; disclose ambiguous or unsupported checks instead of inventing judgments. See the [meeting brief](meeting-brief.md) for status and requested team inputs.

## Before a run

- Use the [project intake skill](.github/skills/odsp-eval-intake/SKILL.md) to prepare or refresh an [intake handoff and readable brief](intake/README.md) from the URL, plain-language context and optional materials. Collect only authorized evidence, preserve originals and expose gaps before criteria preparation. The validator checks declared context, not source truth or execution permission. Carry gaps into dependent checks without blocking unrelated supported work, rewriting checks or inventing facts. Reuse the saved intake on follow-up; do not depend on chat history.
- Confirm the target URL, product purpose, authorized test account, allowed actions, and whether source-data access is available. Do not collect credentials in chat or commit authentication state.
- Freeze the prompt set, assertion definitions/version, tag selections, and judging rules. Record a run ID, timestamp, browser viewport, browser time zone, intended user time zone, and relevant product configuration when observable.
- Automatically review assertion applicability before execution. Conditional checks depend on the actual response and matching data, not just prompt wording. For example, U5 exists in V2.2 but was absent from the supplied pilot tags; record proposed mapping changes under the run's configured policy and freeze the resulting version before execution. Never silently rewrite supplied mappings or prior runs.
- Define what each check requires: visible UI, source link inspection, authoritative record values, or reference answers. Check those dependencies before starting.
- Establish consistent interpretations across cases. Citation presence, correct destination, and factual support are different checks; explicitly define which the assertion requires. Do not demand source verification for one equivalent case while accepting a citation marker alone in another.
- Use one preview case to validate input, completion, fresh-chat isolation, capture, and report rendering before expanding the run.

## Per-prompt execution

1. Start a fresh conversation and verify it has no prior messages. Submit the exact prompt from the frozen run definition once.
2. Wait for the response inside the chat iframe. Require a final response and its completion controls, with no generation indicator remaining. Apply a bounded timeout; do not confuse a transient status change with completion.
3. Record the exact prompt, full final response text and table structure, citations, capture time, and a conversation identifier or URL when available. Check that the saved response matches the current case.
4. Save the initial visible response before inspecting sources or changing scroll position. Preserve it separately from later inspection evidence.
5. Capture the full browser viewport, including the list and chat together. Use separate images, not stitched images. Scroll using real wheel gestures or visible scrollbars, with overlap between captures.
6. Check horizontal and vertical scrolling independently. Do not force `scrollLeft`, `scrollTop`, resize the target panel through CSS, or change overflow styling to reveal inaccessible content. An `overflow-x: hidden` container can accept a DOM offset without supporting user scrolling. If a gesture cannot expose content, record clipping as a product observation.
7. Inspect every screenshot for legibility, correct case, actual scroll movement, and missing or repeated regions. Dimensions and successful file creation alone do not prove useful evidence. Record the gesture and resulting position for each capture.
8. Expand collapsed citation groups, inspect relevant citation previews/destinations, and compare source records when required. These are evidence-inspection actions, not follow-up prompts. Do not trigger suggested prompts, regenerate answers, or modify the list.
9. Resolve missing evidence with a bounded, documented inspection attempt. If access, source data, or controls prevent a check, retain UNABLE with the exact blocker and attempted action. Never force a verdict just to reach full coverage.
10. Save and verify all artifacts before leaving the conversation. Do not depend on chat history: two original pilot conversations could not be recovered. Preserve any available recovery identifier, but do not assume it guarantees replay.

## Judging and scoring

- PASS: the applicable requirement is supported by collected evidence. FAIL: an applicable requirement is demonstrably unmet. N/A: its trigger does not apply, with a reason tied to the definition. UNABLE: the check applies but the necessary evidence cannot be obtained.
- Keep runner errors, evidence-collection gaps, and product failures separate. A selector failure is not an answer failure. A response completing is not the same as passing UX checks.
- Use equal weighting initially. UX assertion score = PASS / (PASS + FAIL) x 100. Evaluation coverage = (PASS + FAIL) / (PASS + FAIL + UNABLE) x 100. Exclude N/A from both denominators and display its count separately.
- Calculate the overall score from pooled check counts, not an average of rounded per-question percentages. Calculate each question's score and coverage with the same rules. Show the numerator and denominator alongside rounded percentages.
- If no checks can be judged, display "Not scored", not 0% or 100%. If no checks apply, coverage is N/A. Prompt completion coverage is a separate measure, such as 3 of 16 prompts.
- Label small-run scores "Provisional" and state that they describe selected UX assertions, not overall product quality or verified factual accuracy.
- Record additional consistency observations separately: totals that do not add up, dates outside stated bounds, mismatched units, or contradictory scope. Do not silently add them to the score. Any new checks must follow the quality reference and be included in a future version frozen before execution.
- Fix evidence gaps by adding evidence to the same response when possible. If rerunning is necessary, record a new run and do not overwrite or mix its evidence with the original answer.

## Report format

- Store HTML/Markdown in `reports/<run>/`, screenshots in `images/<run>/`, snapshots in `snapshots/<run>/`, and plans/results/JSON evidence in `runs/<run>/`. Keep source documents in `sources/`, reference docs in `docs/`, and helper scripts in `scripts/`. Use matching run names and file-relative report/JSON links; validate links after moves. Do not accumulate generated artifacts at the repository root. See the [folder guide](README.md#folder-guide).
- In every report, explicitly label assertion text as "Assertion" (or "Assertions" for a section), never "Unchanged requirement" or another substitute. Explain source preservation separately; do not alter supplied assertion wording.
- Left navigation: Overview first, followed by each prompt's full text. One selected prompt view at a time, with working direct links and keyboard navigation. Keep a usable navigation layout on small screens.
- Overview: provisional overall UX assertion score, evaluation coverage, prompt completion, pass/fail/unable/N/A counts, important findings, and methodology limitations.
- Prompt view: exact user question, full readable response and tables, per-question score and coverage, assertion verdicts with reasons, and evidence links. Identify rendered response text as a transcription, not an original screenshot.
- Show separate full-window screenshots at a useful size, with sequence numbers, capture timestamps, scroll positions, and full-size links. Do not use a narrow screenshot column for wide browser captures.
- Clearly distinguish original run evidence, later recaptures, and any diagnostic artifacts that do not represent normal user interaction. Later list state is not proof of the original list state.
- Keep verdict filters scoped to the selected question. Preserve unresolved and not-applicable counts rather than hiding them in an overall percentage.
- Validate report values against the source verdicts, asset loading, navigation, filters, and screenshot presentation at desktop and mobile sizes. Report validation failures separately from product findings.

## Pilot limitations to carry forward

- The pilot contains 22 PASS, 4 FAIL, and 3 UNABLE judgments. The agreed provisional calculation is 22/26 = 84.6% score and 26/29 = 89.7% evaluation coverage. These scores have been discussed but are not yet implemented in the HTML report.
- Two UNABLE judgments resulted from uninspected collapsed citations. Future runs should perform that inspection before leaving the case. Time-zone verification needs source timestamps and confirmed interpretation of the viewer's local zone.
- The full-window Case 03 gallery was generated using direct DOM scrolling. Its horizontal states are not all validated as user-reachable. Do not reuse that capture method as-is or treat those images as proof of normal interaction. Original response text and original pilot screenshots remain separate evidence.
- The current automation is an agent-driven pilot, not a production runner. Source-data checks, the safer capture routine, complete response rendering, and score presentation still require implementation.
- Internal responses, screenshots, and list URLs need an explicit access/retention policy before sharing or committing artifacts.

## Run completion checklist

- [ ] Configuration and assertion applicability reviewed and frozen.
- [ ] Each prompt isolated, submitted once, and completed or assigned a runner outcome.
- [ ] Full response, original screenshot, and source references saved per case.
- [ ] Captures use user-reachable actions and have been visually checked.
- [ ] Required source inspections attempted; genuine blockers documented.
- [ ] Per-question and pooled scores reconcile with verdict counts.
- [ ] Report navigation, filters, evidence links, and responsive layouts checked.
- [ ] Limitations, new observations, and any separate reruns clearly identified.
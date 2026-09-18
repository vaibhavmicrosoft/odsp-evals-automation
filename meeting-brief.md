# ODSP Evaluation Automation

Living brief | Last updated: September 18, 2026

**Goal:** Product URL + plain-language context + optional documents/assertions/prompts -> automated evaluation -> report, guided by Katherine's framework. No routine human approval gates.

**Status:** Agent-driven pilot demonstrated; reusable unattended harness not built yet.

## Done

- [x] Read 16 prompts and 17 original V2.2 UX definitions. Also reviewed screenshot of 17 proposed [content-quality additions](https://microsoft.sharepoint.com/:x:/t/ODDesignIDC/cQobnO7g1QiRRYoUEgoFGm0MEgUCcN5hLtpCHHA46JYNBaQ4SA): Accuracy, Clarity, Conciseness, Relevance, Respectfulness, Usefulness. Screenshot only; live workbook not verified, additions not imported/scored, pilot unchanged.
- [x] Ran 3 Lists prompts in fresh chats. New [Pages pilot](reports/pages-pilot/pages-pilot-report.md): Katherine CSV record 57 created a draft via bottom-right Copilot; 4/4 supplied structural checks pass (one duplicate, three distinct requirements). Not holistic quality or generated-assertion validation; no publication.
- [x] Saved response snapshots and original chat screenshots; recorded 29 judgments with reasons.
- [x] Built Lists and [Pages HTML reports](reports/pages-pilot/pages-pilot-report.html): overview, prompt navigation, verdict filters, assertion labels and evidence. Pages has exact prompt/full response, scores with caveats and galleries; desktop/mobile checks passed. Organized reports, images, snapshots, run data and sources by [folder convention](README.md#folder-guide); links updated.
- [x] Defined overall/per-question scoring and coverage rules; display still pending.
- [x] Adopted Emma-inspired [project intake skill](.github/skills/odsp-eval-intake/SKILL.md); fresh [Parts Inventory intake](intake/cases/parts-inventory-pilot/r1/brief.md) saved and validated, with API access/currency gaps. Agent-led collection and handoff demonstrated, not an Emma runtime install or unattended pipeline.
- [x] [Parts Inventory HTML pilot](reports/parts-inventory-pilot/report.html): 12 newly generated assertions frozen before one Copilot prompt; 10 PASS / 2 FAIL, 83.3% score / 100% judgment coverage. Report omits folder part ($97.20); included arithmetic matches. Visible quantities/filter consistency remain assertion gaps, unscored. Natural-scroll evidence and responsive report verified.
- [x] Agreed input model: generate contextual assertions when absent; preserve supplied checks and label generated additions. V2.2 is a Lists-specific user input, not the default framework. Implementation pending.
- [x] Reviewed all three shared Universal Knowledge Base skills: [define-quality-criteria](https://github.com/x3-design/language-system/blob/main/plugins/content-engineering/skills/define-quality-criteria/SKILL.md) for scenario-grounded rubrics, [write-eval-assertions](https://github.com/x3-design/language-system/blob/main/plugins/content-engineering/skills/write-eval-assertions/SKILL.md) for case assertions, and [apply-quality-criteria](https://github.com/x3-design/language-system/blob/main/plugins/content-engineering/skills/apply-quality-criteria/SKILL.md) for scoring. Not integrated yet.
- [x] Reviewed Katherine's [Improving evals deck](https://microsoft-my.sharepoint-df.com/:p:/p/kasather/cQrD4HqHIkFmSo7wE6CTn3PuEgUCOmZFK1rI8ZqY04wnb010Xg?isSPOFile=1): outcome-focused assertions, side-effect checks, realistic prompts, and human/AI judge calibration. Reference guidance, not a complete reusable rubric.
- [x] Parsed all 487 cases in [Edited-vibe-assertions.csv](sources/Edited-vibe-assertions.csv): 1,403 populated Assert1-9 cells, scenario/category/prompt metadata, and source-test paths. CSV access blocker resolved; structural checks and selected case review only, not full semantic validation. 129 cases repeat assertion text internally; 44 assertions reference an unspecified expected pattern. Confidential/Internal Only; preserve as supplied reference, not golden data or Lists defaults.

**Original Lists pilot results:** 22 pass / 4 fail / 3 unable. Provisional score: **85%** (22/26 judged checks); evaluation coverage: **90%** (26/29 selected checks). Separate from the Pages pilot; not a validated product-quality benchmark.

**Known limitations:** Source facts were not fully verified. Two original chats could not be recovered. Full-window recaptures used forced scrolling and are not validated as user-reachable evidence.

## Missing: Our Build Checklist

- [ ] Correct screenshot capture: natural scrolling, separate full-window images showing list + chat, visual validation.
- [ ] Complete evidence collection before leaving each chat, including collapsed citations and required source checks.
- [ ] Reusable runner: input import, versioned configuration, fresh chats, completion detection, errors, and saved artifacts.
- [ ] **Intake follow-through:** calibrate semantic grounding and generated criteria after the fresh Parts pilot; add explicit visible-field coverage and filter-scope checks in a future version. Safe imports, managed history and executable assertion-pipeline integration remain pending. Preserve frozen prior scores.
- [ ] Proposed input protection: default to supplied prompts/assertions/rubric unchanged, including partial sets; suggestions stay outside execution and scoring. Augment/revise only by explicit opt-in, preserving originals and versioned changes; report unjudgeable checks without rewriting them. Generate missing input types only within authorized scope.
- [ ] Enforce one observable behavior per generated assertion; flag compound supplied checks without splitting them or changing score denominators. Treat "and/or" as review signals, not automatic split rules; define applicability triggers (e.g., when clarification is required) and applicable side-effect checks.
- [ ] Integrate define -> write -> apply and required knowledge files; supply scenario context, evidence requirements, and applicable agent instructions upfront; preserve rubric scales and explicitly define aggregation. Surface missing inputs instead of inventing criteria.
- [ ] **Optional Emma reference: experience review.** Not the evaluator or a core dependency. If pursued, compare on identical frozen evidence against our checks and human labels before deciding reuse. Retain periodic calibration, not routine per-run approval; lower scores alone prove nothing.
- [ ] Resolve the definition skill's per-run human spot-check recommendation against our unattended model; retain human-only judgments as pending, never silently substitute AI or claim full compliance.
- [ ] **Emma reference: report publishing.** Inspect `deploy-vibehub`; confirm permissions, then trial a non-sensitive report for stable URL updates, access and evidence links before deciding integration. Independent of optional experience review. Retain structured results, scores, coverage and full responses; publishing is not runner hosting.
- [ ] Scenario coverage map and recommendations for missing test cases.
- [ ] Reliable unattended authentication/session setup and secure artifact retention.
- [ ] Later: shared website. [Emma references](docs/emma-reference-review.md) inform inspect -> test fit -> decide -> integrate. Intake evidence model adapted locally, not full Emma integration; review/publishing queued. Preflight and scheduling remain reference ideas.

## Needed From Others

- [ ] **Katherine (quality/design):** Confirm proposed content-quality additions, applicability/anchors, overlap with existing UX checks, and mapping of screenshot categories to UKB ACCRU (labels differ; preserve originals). Identify approved CSV examples; supply test fixtures/patterns, source pages, and labelled outputs with reasons. No per-run approvals.
- [ ] **Product team:** Product goals, users, key tasks, specs/Figma/research, and known limitations.
- [ ] **Data/domain owner:** Source-truth dataset, expected outcomes, and date/time-zone conventions.
- [ ] **Eval Studio local trial: deferred. Contact completed.** Vaibhav contacted Sreya Ahuja (Photos); she reports parts are still breaking. Await her confirmation of a usable build of [PR 2363528](https://onedrive.visualstudio.com/ODSP-Web/_git/odsp-web/pullrequest/2363528), then obtain setup/access details, try locally and verify live versus simulated scoring before assessing reuse. No confirmed retry date; not run/integrated. Keep the deferred trial visible in "what's left" summaries, but do not repeat the completed contact task. Core eval work can proceed independently.
- [ ] **Engineering/file owner:** Supported test access, allowed actions, feature configuration, and stable UI hooks. [LLM rubric system prompts](https://microsoft-my.sharepoint-df.com/personal/prchando_microsoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fprchando_microsoft_com%2FDocuments%2FMicrosoft%20Teams%20Chat%20Files%2Flm-rubric-system-prompts-report.html) received via Katherine but NOT reviewed: SharePoint denies the signed-in user's access; need owner-granted access or an authorized local copy.
- [ ] **Security/data owner:** Evidence storage, sharing, and retention rules.

## Next Milestone

- [ ] Assign input owners and delivery dates.
- [ ] Next: calibrate the Parts pilot's generated assertions, especially visible field presence versus embedded-data accuracy; connect Katherine's assertion workflow (integration pending). No retrospective criterion changes.
- [ ] Then: validate corrected capture/execution on a small preview before a separate full 16-prompt run and scored report.

**Guardrails:** Collect evidence first. Never force hidden UI into view or invent verdicts. Report unsupported measurements and uncertainty explicitly.

[Demo report](reports/lists-pilot/pilot-report.html) | [Detailed findings](reports/lists-pilot/pilot-report.md) | [Runbook](evaluation-runbook.md)
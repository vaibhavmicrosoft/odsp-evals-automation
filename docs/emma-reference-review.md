# Emma: Reuse Opportunities

Reviewed September 18, 2026: all six sections of the [capability catalog](https://vibehub.microsoft.com/app/yenliangliu--cbksw/what-emma-can-do.html?scoutTheme=light) and the [setup and night-shift guide](https://vibehub.microsoft.com/app/yenliangliu--cbksw/setup-emma.html). Initial findings below describe documented capabilities. Follow-up: intake skill and artifact contract read at a pinned revision; [local adaptation and fit trial](../intake/README.md) implemented. No Emma installation/runtime test, live product evaluation or deployment; dependency implementations remain unreviewed.

## Relevant Capabilities

| Documented capability | Potential use in ODSP evaluations |
| --- | --- |
| `intake`: evidence-grounded Cases/Briefs, source history, readiness and blockers; uses `get-review-context`. | Structure plain-language product context, evidence requirements and missing-input reporting before selecting assertions. Contact: David Chen. |
| `review`: AI, stakeholder, customer and User Review modes; prioritized findings with evidence and scoped quality/coverage assessments, not ship approval. | Compare as a qualitative judge on the same frozen cases and evidence as our assertion-based method. Contact: Yangzi Han. |
| `sims`: bounded child workflow, provenance and confidence tiers, explicitly simulated reactions. | Optional exploratory perspective, never real user evidence, ground truth or a substitute for human calibration. Contacts: Yizhou Fan and Kexin Zhang. |
| `content-design` and `a11y`: contextual content audits and accessibility findings/specifications. | Assess specialized checks where applicable; do not automatically add them to supplied rubrics or scoring. Contacts: Yangzi Han and Qing Tian. |
| `research-report`: canonical Markdown with optional content-identical VibeHub/PowerPoint outputs. | Reuse the single-source reporting principle while retaining structured assertion-level results and evidence. Contact: Yizhou Fan. |
| `knowledge-builder`: evidence-backed product/profile knowledge, staging and validated packs. | Explore versioned product context and source ownership instead of repeatedly collecting context. Approved promotion is distinct from routine evaluation execution. Contact: David Liu. |
| `deploy-vibehub`: publish local HTML/static artifacts/prototypes with stable URLs and update metadata using authorized access. | Candidate distribution path for our static report or demo. Not evidence that VibeHub hosts a persistent evaluation runner; access, retention and sharing policy require confirmation. Contact: David Liu. |

## Important Distinctions

- `experience-review` takes ER tasks and meeting evidence, then prepares sessions and extracts ratings/issues. It is not described as automatically executing product prompts against atomic assertions. Publication and Azure Boards filing have separate approval requirements. Contacts: Xin Jin and Yizhou Fan.
- `deliver` lists browser/CDP, Playwright and acceptance proof for UI implementation. Browser tooling in a capability description does not establish a reusable evaluation harness.
- The catalog does not establish an end-to-end product URL -> prompt execution -> source verification -> assertion-level verdict/coverage pipeline. That remains our implementation and validation work; absence from the catalog is not proof of absence from Emma's code.
- Confirm the exact Emma skill/version used in the earlier Lists comparison before interpreting it. This current catalog distinguishes `review`, `sims` and `experience-review`; it does not identify the earlier run's configuration.

## Distribution and Unattended Execution

- Emma's setup guide points to the [gim-home/Emma repository](https://github.com/gim-home/Emma) for plugin installation and initialization. It lists VS Code, Copilot CLI, Copilot app, Scout and Emma Studio as surfaces. This is a plugin-distribution reference, not proof our standalone skill already supports all hosts.
- Initialization reports dependency/MCP readiness. A similar scoped preflight would help our runner expose missing browser, source and authentication dependencies before starting.
- The night-shift guide describes an ODSP persistent Dev Box plus Scout scheduled automation: explicit source scope and stopping conditions, a manual trial before scheduling, no overlapping runs, and minimal connected sources. This is a candidate execution model, not a tested solution for unattended SharePoint authentication.
- Night-shift examples return drafts without automatically sending them. Keep execution automation separate from publishing, external side effects and knowledge promotion; do not add routine per-run approval gates to our agreed workflow.

## Recommended Follow-Up

- [x] Inspect `intake` and its contract at a pinned revision, identify runtime dependencies, and trial a small local evidence-handoff adaptation. [Scope, limitations and remaining intake work](../intake/README.md).
- [ ] Finish intake validation with real product context, then investigate `review`, then `deploy-vibehub`, testing fit before each integration. Do not install or adopt the full plugin by default.
- [ ] Review the existing Lists/Emma comparison artifact and compare judges on identical cases/evidence, assessing useful detections and human agreement rather than incompatible raw scores.
- [ ] Confirm approved VibeHub sharing/storage rules and persistent execution prerequisites with owners. No deployment or environment provisioning is authorized by this reference review.
- [ ] Keep supplied assertions unchanged; Emma-derived recommendations stay outside execution/scoring unless explicitly adopted. Pilot results are unchanged.
# ODSP Evals Automation

Automation tooling for ODSP evaluations.

## Status

Agent-driven SharePoint Lists and Pages pilots are complete. A standalone runner has not yet been implemented.

- [Pages visual report](reports/pages-pilot/pages-pilot-report.html)
- [Visual pilot report](reports/lists-pilot/pilot-report.html)
- [Pilot findings and limitations](reports/lists-pilot/pilot-report.md)
- [Evaluation runbook and future-run checklist](evaluation-runbook.md)
- [Meeting brief: progress, gaps, and team inputs](meeting-brief.md)
- [Intake workflow, validator and Emma fit assessment](intake/README.md): [project intake skill](.github/skills/odsp-eval-intake/SKILL.md) for agent-led context gathering, with tested JSON handoff and readable brief generation. A fresh collection trial and unattended evaluation runner remain pending.

The runbook incorporates lessons from the pilot. In particular, the current full-window capture script forces DOM scroll positions and must not be reused as evidence of normal user scrolling without correction.

## Folder Guide

| Folder | Contents |
| --- | --- |
| `reports/<run>/` | HTML reports and their Markdown versions. Start here to review an evaluation. |
| `images/<run>/` | Screenshots, grouped by the same run name. |
| `snapshots/<run>/` | Captured page and chat snapshots. |
| `runs/<run>/` | Frozen plans, structured results and supporting JSON evidence. |
| `sources/` | Original CSV and Excel documents. |
| `docs/` | Reference reviews and supporting documentation. |
| `scripts/` | Browser capture and other helper scripts. The legacy capture script remains unsafe for evaluation reuse. |
| `intake/` | Intake documentation, examples and future versioned cases. |

Keep this README, the meeting brief and evaluation runbook at the top level for easy access. Intake CLI/test entry points also remain here so existing commands still work. Hidden tool/configuration folders are unchanged.

Use this layout for future evaluations instead of adding reports or screenshots to the root. Keep the same run name across artifact folders. HTML/Markdown links and run JSON file references are relative to their containing file; intake source references remain repository-relative. Keep companion folders together when moving or sharing reports, subject to evidence access rules.
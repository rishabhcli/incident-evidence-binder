# Disclosure

This page belongs to [the main Skill](../SKILL.md). It covers third-party components, what was developed for the UGREEN Hackathon 2026 on AI NAS, AI tools used, data flows and known limits.

## Third-party components and licenses

| Component | Source and version | License | How it was used |
| --- | --- | --- | --- |
| UGREEN Skill Developer Package (uliya-skill-kit) | Starter Kit download from the hackathon page, archive uliya-skill-kit-0.7.3-en | The archive contains no license file. It is used under the terms UGREEN published with the Starter Kit and the SkillHub agreements. | Its capability catalog 2.0.0 and its static checker were read and run locally to design and check the Skill. None of its files are included in this package. |
| Node.js | https://nodejs.org, version 26.7.0 | MIT | Runs the Starter Kit checker locally. Not included in the package. |
| Playwright with Chromium | https://playwright.dev, Playwright 1.64.1 | Apache-2.0 (Playwright), BSD-3-Clause plus bundled component licenses (Chromium) | Rendered the proposal PDF from HTML. Not included in the package. |

The package itself holds only Markdown text written for this hackathon. It contains no scripts, manifests, binaries, credentials, personal data, models or datasets, and it pulls nothing from outside sources.

## Developed for the hackathon

The concept, the whole workflow and every file in this package were created during the hackathon period, starting in late October 2026. They are:

- The orchestration in the main Skill file: scope confirmation, camera event query, photo and document search, requirement checklist from the user's own policy, approval gate, copy-only binder creation, SHA-256 comparison, timeline and manifest saving, and the verify mode.
- The binder layout, the capability map, the test plan and this disclosure page.

No earlier Skill, template, or submission material was reused. The only structural starting point was the section list required by the Starter Kit standard.

## AI tools used

- Aside, an AI browser agent running Anthropic Claude models, was used in this order: to read the hackathon rules and the Starter Kit documents, to propose the concept after reading the capability catalog, to draft this Skill file and the reference pages, to draft the proposal text, to run the Starter Kit checker and fix its findings, and to render and check the proposal PDF.
- The entrant who owns this submission assigned the task to the agent. The agent produced the drafts and the checks, so the concept and the wording were AI assisted from start to finish.
- No AI tool was used inside the package at run time except the AI experts that UGOS provides on the NAS.

## Data flows and external services

- The Skill makes no network calls and does not use any third-party API.
- Camera events, photos and documents are read from the NAS by the registered experts only after the user confirms the scope. Copies are written only inside the new binder folder after the user approves the plan.
- AI processing such as photo descriptions, text extraction and drafting runs inside the registered experts. Which model they use, local or a cloud service supported by Uliya, is decided by the platform and not by this Skill. Test data is synthetic for that reason.
- Nothing is shared, sent by message or uploaded to any outside service.

## Known limits and risks

- The Skill has not been run on a NAS. Every behavior described is an expected behavior to be checked on the testing day.
- The catalog marks all action stability as unknown. Any action can behave differently than described.
- Camera evidence may be available only as a temporary playback reference, not as a saved file.
- Camera steps work only if cameras are registered in the NAS surveillance feature. Without them the binder is built from photos and documents.
- Photo descriptions and document answers come from AI experts and can be wrong. The user reviews the timeline and checklist before anything is copied.
- Hash comparison is done by the experts and checked again in the conversation. Long hash values are a place where a mistake can hide, so the test plan checks the comparison with a deliberately changed file.
- The count limits of 25 events, 60 photos and 15 documents were chosen to keep a run bounded and have not been measured.
- The binder helps organize material. It is not legal advice and is not proof that a source file was genuine.

# Incident Evidence Binder

A Skill for UGREEN UGOS AI NAS, written for the UGREEN Hackathon 2026 on AI NAS (Round 1, Automate Your Workflow track).

It builds one organized evidence binder for a single incident (water leak, car damage, break-in attempt, deposit dispute) from camera events, photos and documents that are already on the NAS. It reads the user's own policy or lease to list the proof that document asks for and shows what is missing. After the user approves, it copies the chosen files into a new folder with a timeline and a SHA-256 manifest. A second mode re-checks a binder later and reports files that changed, went missing or were added.

## Status

- Built: the Skill package (`skill/incident-evidence-binder`, Markdown only) and the Round 1 proposal (`proposal/`).
- The package passes the static checker in the UGREEN Skill Developer Package (uliya-skill-kit 0.7.3-en, catalog 2.0.0) with zero errors and zero warnings.
- Not done: nothing has been run on a UGREEN NAS. Every behavior in the Skill is an expected behavior that still needs to be tested.

## Layout

- `skill/incident-evidence-binder/SKILL.md`: entry point (goal, input, capability evidence, delegate workflow, completion and failure).
- `skill/incident-evidence-binder/references/`: capability map, binder layout, test plan, disclosure.
- `dist/incident-evidence-binder.zip`: the package as submitted.
- `proposal/`: proposal source (`proposal-content.json`, `build-proposal.mjs`) and the rendered PDF.

## Check it yourself

The checker ships in the Starter Kit and is not redistributed here. With the kit extracted:

    node uliya-skill-kit/scripts/check-skill.mjs skill/incident-evidence-binder

## AI assistance

The concept, the Skill files and the proposal text were drafted by an AI agent (Aside, running Anthropic Claude models) for the entrant. See `skill/incident-evidence-binder/references/disclosure.md`.

## License

MIT, see `LICENSE`. The UGREEN Skill Developer Package is used under the terms UGREEN published with it and is not included in this repository.

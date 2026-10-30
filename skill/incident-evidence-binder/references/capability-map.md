# Capability map

This page lists the NAS capabilities the Skill relies on. It was written from `capability-catalog.json` version 2.0.0 (generated 2026-09-01) in the UGREEN Skill Developer Package. The parent Skill only sends delegate commands. Each expert chooses and runs its own CLI actions, so the actions below are the ones each expert is expected to use for the delegations in [the main Skill](../SKILL.md). The catalog marks the stability of every action as unknown, so real behavior is confirmed during the testing day, not assumed here.

## Expected actions by workflow step

| Step | Expert | CLI | Expected actions | Effect and approval in the catalog |
| --- | --- | --- | --- | --- |
| Build 2 | file-agent | file-workflow | get-user-dir | read, none |
| Build 2, 5, Verify 2 | file-agent | ug-filesystem | ls, find, stat, `cat` | read, none |
| Build 3 | security-monitor-agent | ug-surveillance | cameras, event-timeline | read, none |
| Build 4 | photo-agent | ug-photo | search-picture, meta, vision-vlm, vision-ocr | read, none |
| Build 5 | document-agent | ug-document | qa, extract, reconcile | read, none |
| Build 7 | security-monitor-agent | ug-surveillance | event-evidence | read, none |
| Build 8 | file-agent | ug-filesystem | mkdir, cpmv (copy type) | state change, gateway approval |
| Build 9, Verify 3 | file-agent | ug-filesystem | sha256sum | read, none |
| Build 10 | knowledge-agent | ug-knowledge | save-text | state change, workflow |
| Build 11 | document-agent | ug-document | writing (draft task) | mixed, gateway approval |
| Build 12 | file-agent | ug-filemgr | tag-list, tag-add, tag-add-file | tag-list read; tag-add gateway; tag-add-file conditional |

Every read action runs without approval. Every write action in the table is either gated by the platform approval gateway or runs as a workflow that returns waiting_approval. The Skill also asks for the user's own confirmation before the first write (build step 6).

## Capabilities deliberately not used

- Identity and biometric lookups in ug-surveillance: identity-resolve, faces, face-detail, vehicle-plates, vehicle-plate-detail. The binder records what happened and when, not who was involved.
- Deletion and sharing: del, batch-del, share-mkdir, restore. The Skill never removes or exposes files.
- Moving and renaming: rename, chtimes, echo on existing files, batch-move. Originals stay untouched.
- Album creation in ug-photo. The Skill reads photos and does not create or change albums.
- ug-video and ug-music. Neither is needed for this workflow.

## Things the catalog does not promise

- event-evidence returns evidence references with a time limit. The catalog does not say whether a snapshot can be saved as a file inside the binder. The Skill records a reference when no real file is returned and never calls it a saved clip. Whether a snapshot file can be copied is a test item in [the test plan](test-plan.md).
- The catalog has no scheduling, notification or calendar capability, so the Skill is run on request only.
- The catalog has no capability for signing or timestamping with an outside authority. The SHA-256 manifest is the only integrity measure.

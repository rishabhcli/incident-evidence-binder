---
name: incident-evidence-binder
description: Time-ordered, hash-checked evidence binder for one incident such as a water leak, car damage, a break-in attempt or a deposit dispute, built from camera events, photos and documents already stored on the NAS, with a list of the proof the user's own policy or lease asks for and what is still missing. Also re-checks a finished binder later and reports any file that changed or went missing. Use when the user says things like "build an evidence file for last Tuesday's water leak", "gather proof for my insurance claim" or "check that my evidence binder is still intact".
---

# Goal

Turn material that already sits on the NAS into one organized evidence binder for a single incident. The binder is a new folder that holds copies of the files the user approves, a plain-language timeline, a list of the proof the user's own policy or lease asks for (with what is still missing), and a SHA-256 manifest.

A second mode re-checks an existing binder at any later date. It recomputes the hashes and reports which files are unchanged, changed, missing or newly added.

What this Skill does not do:

- It does not give legal advice and does not decide who is at fault.
- It does not prove a photo or clip was genuine before it was copied. The manifest only shows that a binder copy matched its original when it was made and lets the user see later changes.
- It does not identify people or vehicles. Face, identity and license plate lookups are out of scope.
- It does not delete, move, rename or edit any original file.
- It does not send, share or upload anything outside the NAS.

# Required input

Ask for these in one short message and wait for the answers. Do not pre-collect parameters that belong to an expert.

- Mode: build a new binder, or verify an existing binder.
- Build mode:
  - A one-sentence description of the incident and its purpose (insurance claim, landlord, police report, personal record).
  - The incident window: start and end date and time, plus the timezone if it is not obvious.
  - Optional baseline window: an earlier period that shows the condition before the incident.
  - Optional camera names, photo albums or folders, and the paths of any policy, lease, receipt or estimate files.
  - A short folder-name hint for the binder.
- Verify mode: the binder folder to check.

Permissions and privacy: camera events, photos and documents are read only after the user confirms the scope in step 1. They are used only to build this binder. The Skill makes no network calls of its own. AI processing happens inside the registered experts on the NAS. Details are in [the disclosure notes](references/disclosure.md).

# Generation-time capability evidence

- `file-workflow` → `file-agent`
- `ug-filesystem` → `file-agent`
- `ug-filemgr` → `file-agent`
- `ug-surveillance` → `security-monitor-agent`
- `ug-photo` → `photo-agent`
- `ug-document` → `document-agent`
- `ug-knowledge` → `knowledge-agent`

Each mapping comes from the capability catalog 2.0.0 shipped with the Skill Developer Package. The actions each expert is expected to use, their effects and their approval values are listed in [the capability map](references/capability-map.md).

# Workflow

Only the delegate command is used to reach the NAS. Before sending a command, replace every value in curly braces with the real value the user confirmed or the real result an earlier step returned. If a value is not available, stop the steps that depend on it and say which value is missing. Send commands one at a time and wait for each result.

## Build mode

1. Confirm the scope (no delegation). Repeat the incident description, window, baseline window, cameras, folders and documents back to the user. State that camera events, photos and documents in that scope will be read, and that nothing is written until step 6. Continue only after an explicit yes. If the answer is missing or unclear, return waiting_user.

2. Resolve the destination. Find the user's own directory and check that the binder folder name is free.

   `delegate --target file-agent --instruction 'Resolve the current NAS user home directory and report its real path. List the top-level folders in that directory and report whether a folder named {binder_folder_name} already exists. Only read. Do not create, move, rename or delete anything. If the directory cannot be resolved, return failed with the reason.'`

   If the name exists, add a numeric suffix to the proposed name. Never reuse or overwrite an existing binder.

3. Camera events. Leave this step out if the user said there are no cameras.

   `delegate --target security-monitor-agent --instruction 'List the registered cameras with their real names and whether each one is online. Only read. Return the list exactly as found. If no cameras are registered, say so and return nothing else.'`

   Ask the user to pick the cameras if they did not name them (waiting_user). Then query events from the real result.

   `delegate --target security-monitor-agent --instruction 'Query camera events from {incident_start} to {incident_end} in timezone {timezone} on the cameras {approved_cameras}, limited to 25 events. Return for each event its event time, camera name, topic and event reference exactly as found. Only read. Do not resolve identities, faces or license plates and do not guess who or what appears. If there are no events, report zero matches and stop.'`

4. Photos and videos.

   `delegate --target photo-agent --instruction 'Search the photos and videos captured between {incident_start} and {incident_end}, limited to 60 items, and also those captured between {baseline_start} and {baseline_end} when a baseline window was given, limited to 60 items. Limit the search to {approved_albums_or_folders} when the user named any. For each item return the real file path, the capture time from its metadata, the camera model if present, one neutral sentence describing what is visible and any readable text such as a serial number or label. Only read. Do not name people, do not create albums and do not change files. If nothing matches in a window, report zero matches for that window.'`

   If an item has no capture time in its metadata, label its time as taken from the file modification time and mark it lower confidence.

5. Documents and requirements.

   `delegate --target file-agent --instruction 'In the folders {document_folders} find documents and images modified between {document_search_start} and {incident_end}, and also the named files {named_documents}. Return the real path, size and modified time of each one. Only read. If nothing matches, report zero matches and do not search any other folder.'`

   `delegate --target document-agent --instruction 'Read only the policy, lease or agreement at {policy_path}. Answer from its text and quote the page for each answer: the deadline to report this kind of incident, the proof or documentation it requires, any deductible or limit that applies, and who must be notified. If the document does not state an item, report that item as not stated. Do not guess. Only read.'`

   `delegate --target document-agent --instruction 'Extract the vendor, date, amount and a one-line description from each of these receipts, estimates and invoices: {receipt_paths}. Then check whether the amounts in the estimate and the receipts agree and list every difference. Only read. If a file cannot be read, name it in the failures and continue with the others.'`

   Use the two document commands only when the user supplied the matching files.

6. Plan and approval (no delegation). Using only real results from steps 2 to 5, show the user:

   - A timeline table sorted by time with these columns: time, source (camera event, photo, document), item, time confidence (event record, photo metadata, file time).
   - A requirement checklist built from the policy answers, with each requirement marked as covered by a listed item, not covered, or not stated in the document.
   - A list of gaps, for example a period inside the window with no camera event, no baseline photo, or a missing receipt.
   - The exact files proposed for copying and the proposed binder path.
   - The count limits: at most 25 camera events, 60 photos and 15 documents. If more were found, ask the user to narrow the scope instead of truncating silently.

   Ask the user to approve, remove or add items. Nothing is written before an explicit approval. Return waiting_approval until it is given. If the user declines, stop with cancelled and report that nothing was written.

7. Camera evidence references. Only for events the user approved.

   `delegate --target security-monitor-agent --instruction 'For each of these approved camera events: {approved_event_references}, retrieve one snapshot evidence reference. Report whether a real image file or only a temporary playback reference was returned for each. Only read. Do not identify people or vehicles. If evidence is no longer available for an event, say so for that event.'`

   A temporary playback reference is recorded in the timeline as a reference only. Do not describe it as a saved clip.

8. Create the binder and copy the approved files.

   `delegate --target file-agent --instruction 'Create the folder {binder_path} with the sub-folders 00-summary, 01-camera, 02-photos and 03-documents. Then copy, never move, each approved file listed here: {approved_files} into the matching sub-folder and keep the original file names. Do not overwrite existing files. Do not change the original files. Report each source path with its new path, or the reason a copy failed.'`

9. Hash check.

   `delegate --target file-agent --instruction 'Compute the SHA-256 value of each original file and of its copy in the binder for these pairs: {copied_pairs}. Return both values for every pair and state whether the two values are identical. Only read.'`

   Compare the two values for each pair yourself and do not rely only on the expert's statement. Mark a pair as matched or mismatched. Never delete a mismatched copy without asking the user. Report it and offer to copy it again.

10. Save the timeline and manifest. The layout of both files is in [the binder layout notes](references/binder-layout.md).

    `delegate --target knowledge-agent --instruction 'Save the following text as a new file in {binder_path}/00-summary with the filename hint incident-timeline. Do not overwrite an existing file. Text: {timeline_text}'`

    `delegate --target knowledge-agent --instruction 'Save the following text as a new file in {binder_path}/00-summary with the filename hint hash-manifest. Do not overwrite an existing file. Text: {manifest_text}'`

11. Optional statement draft. Offer it once. Run it only if the user says yes.

    `delegate --target document-agent --instruction 'Draft a neutral one-page incident statement in a formal style using only the verified facts in this text: {verified_timeline_text}. Do not add facts, causes, blame, amounts or people that are not in the text. Mark every item the user marked as uncertain. Save the draft in {binder_path}/00-summary.'`

12. Optional tag. Offer it once. Run it only if the user says yes.

    `delegate --target file-agent --instruction 'Add the tag incident-evidence to each file in {binder_path}, creating the tag first if it does not exist. Report each file that was tagged and each failure.'`

13. Final report (no delegation). Report the binder path, the number of files copied and matched, any mismatched copy, the requirement checklist with its gaps, and the sections that were empty. State plainly which steps returned completed and which did not.

## Verify mode

1. Ask for the binder folder if it was not given. Confirm that the Skill will only read.

2. List the binder and read the manifest.

   `delegate --target file-agent --instruction 'List every file under {binder_path} with its size and modified time. Then read the text of the hash manifest file in the 00-summary folder of that binder and return it unchanged. Only read. If the folder or the manifest does not exist, say so and stop.'`

3. Recompute the hashes from the real manifest result.

   `delegate --target file-agent --instruction 'Compute the SHA-256 value of each of these binder files: {manifest_binder_files}, and of each of these original files: {manifest_original_files}. Name every file that is missing. Only read.'`

4. Compare (no delegation). Report four groups: unchanged, changed (hash differs from the manifest), missing, and added (in the folder but not in the manifest). Report originals that changed since the copy as a separate note, because a changed original is not proof of tampering. Do not repair, replace or delete anything. If the user wants a repair, return to build mode with a new folder.

# Completion and failure

Report a business result only after the expert returns completed. Handle every delegation state explicitly:

- completed: use the real result in the next step and keep it for the final report.
- failed: stop the steps that depend on that result, name the failed step, keep the partial results and say what was written and what was not.
- cancelled: stop, report that the user or the platform cancelled it, and say what was written before that point.
- waiting_user: ask the user the one question the expert needs, then resume the same step. Do not guess an answer.
- waiting_approval: tell the user which write is waiting for approval and pause. Do not retry the write another way.

Empty and partial results:

- A step with zero matches is reported as an empty result and the workflow continues with the other sources. The binder section for that source says "no items found in the confirmed scope".
- If every source is empty, report that and stop. Create no binder folder. Do not widen the window or search other folders unless the user asks.
- If a copy or hash check fails for some files, keep the files that succeeded and list the failures. Never describe a binder as complete when any approved file failed.
- If camera evidence is no longer available, record the event in the timeline and mark the evidence as unavailable.

Data and permission handling:

- Write only inside the new binder folder.
- Use only paths and sources the user confirmed in step 1 or approved in step 6.
- Never put credentials, personal data from outside the confirmed scope or invented values into the timeline, manifest or statement draft.
- Run the tests in [the test plan](references/test-plan.md) before relying on this Skill for a real claim.

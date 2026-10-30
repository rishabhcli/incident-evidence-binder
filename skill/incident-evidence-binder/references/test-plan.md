# Test plan for the testing day

Nothing in [the main Skill](../SKILL.md) has been run on a UGREEN AI NAS yet. This plan lists what will be checked on the one assigned testing day. All test data is synthetic: invented photos with set capture times, an invented policy document and an invented receipt. No real personal data is used.

## Preparation before the testing day

- Create about 8 synthetic photos with capture times inside a fixed two-hour window, 2 more from the day before as baseline photos, and 2 outside both windows as decoys.
- Write a two-page invented policy PDF that states a reporting deadline, a required-proof list and a deductible, each on a known page.
- Create one invented receipt image and one invented estimate document whose total differs from the receipt by a known amount.
- Keep the whole set small so uploading to the NAS takes minutes, not hours.

## Core test 1: build a binder

1. Ask for a binder for the synthetic window with the baseline window, the policy and the receipts.
2. Expect: the scope is repeated back and the Skill waits; the timeline lists only items inside the confirmed windows; decoys are absent; the checklist matches the invented policy and its page numbers; the receipt and estimate difference is reported; at least one gap is listed.
3. Approve the plan. Expect: a new binder folder with the four sub-folders, copies of exactly the approved files, matched hashes for every copy, a timeline file and a manifest file.
4. Check the originals: their hashes and modified times are the same as before the run.
5. Repeat once with approval refused. Expect: the Skill returns cancelled and the NAS has no new folder.

## Core test 2: verify a binder

1. Using the binder from test 1, change one copy by hand in the NAS file manager, remove another copy and add one extra file.
2. Ask the Skill to verify the binder.
3. Expect: one changed file, one missing file, one added file, the rest unchanged, a clear separate note if an original changed, and nothing repaired, deleted or written.

## Edge case: empty and partial scope

1. Ask for a binder for a window that holds no photos, no documents and no camera events.
2. Expect: each source is reported as zero matches, the Skill stops, no binder folder is created and no content from other dates is offered as a substitute.
3. Then ask for a window with photos and documents but with no cameras registered. Expect the camera section to say that no items were found in the confirmed scope and the rest of the binder to complete normally.

## Other items to observe

- Whether event-evidence can return a snapshot as a real file. If it cannot, the Skill keeps recording references only and the description stays accurate.
- Whether vision-vlm descriptions stay neutral and free of names or guesses about people.
- How the platform shows approval requests for mkdir, cpmv, save-text and writing, and whether waiting_approval is surfaced the way the Skill expects.
- Time taken for 60 photos and 15 documents, to confirm the count limits are sensible.

## Output of the testing day

For each test: the exact user sentence, each delegate result state, the created files and the pass or fail result. Any step that fails is fixed in the final package, and the final description is changed to match what actually worked.

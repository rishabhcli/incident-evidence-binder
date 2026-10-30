# Binder layout

This page describes the folder, the timeline file and the manifest file that [the main Skill](../SKILL.md) creates in build mode. Names in capitals are placeholders.

## Folder

The binder is created next to the user's own files in a folder named like this:

```
Evidence-SHORT-HINT-YYYYMMDD
  00-summary     timeline and hash manifest, plus the statement draft if requested
  01-camera      saved snapshot files, only if the expert returned real files
  02-photos      copies of approved photos and videos
  03-documents   copies of approved documents, receipts and estimates
```

If the name is taken, a numeric suffix is added. An existing folder is never reused.

## Timeline file

Saved with the filename hint incident-timeline. It contains, in this order:

1. Incident description, purpose, confirmed window, baseline window and the date the binder was built.
2. A table sorted by time with the columns time, source, item, time confidence and binder path.
3. The requirement checklist from the user's policy or lease. Each line has the requirement, the page where the document states it, and one of covered (with the item), not covered, or not stated.
4. A gaps list: periods with no camera event, missing baseline photos, missing receipts.
5. A short section named What this binder does not show, which repeats that the manifest only proves the copies matched their originals when they were made.

Time confidence values are event record, photo metadata and file time. File time means the capture time was missing and the file modification time was used.

## Manifest file

Saved with the filename hint hash-manifest. It contains one row per copied file:

```
number | binder path | original path | size | original modified time | SHA-256 of original | SHA-256 of copy | result
```

The result is matched or mismatched. The file ends with the date and the count of matched and mismatched rows. Camera events that exist only as references appear in the timeline and not in the manifest.

## Verify mode output

Verify mode writes nothing. It returns four groups in the chat: unchanged, changed, missing and added, and a separate note for originals that changed after the copy was made.

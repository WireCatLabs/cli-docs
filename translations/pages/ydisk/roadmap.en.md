---
title: "Roadmap"
---

This page lists what is planned for `ydisk` and not done yet. Read it before you build a workaround for a missing
feature: it may already be on the way. The order can change, and there are no dates. To suggest something, open an
[issue on GitHub](https://github.com/WireCatLabs/ydisk-cli/issues).

## What works today

`ydisk` signs in to your Yandex Disk with a Yandex token you make once. It copies the text of the folders you choose to
your computer, so you and your agent search it by words, by meaning and by file name, even without the internet. The
same tool lists, downloads, uploads, moves and shares files on the Disk within the permissions you set, over the
command line or MCP. A folder you [mirror](./mirrors.md) stays the same on your computer and on the Disk, both ways,
and a file a sync deletes or replaces is kept. A mirror can hold the whole Disk, with the folders you choose left
out, and stops before many deletions or overwrites at once until you allow them. A text file edited on both sides in
different places is merged, and a real conflict waits for you with both versions. Your agent can also
[edit a file on the Disk](./usage.md#edit-a-file-on-the-disk) where it is: a text file, cells of an `.xlsx` or
paragraphs of a `.docx`, with the formatting kept and the replaced content saved on your computer. It can also
create a new Word document or Excel workbook there. A sync reads the text of scans and pictures by
[OCR](./usage.md#scans-and-pictures), on your computer by default, and keeps
[earlier versions](./usage.md#earlier-versions-and-what-changed) of each synced file for a year. You can also
[open the Disk as a folder](./mount.md) in your file manager, read-only. See [start here](./index.md).

## Next

- Nothing new is planned right now.

What changed in each released version is in the [changelog](./changelog.md).

---
name: html-report
description: Build a single-file HTML data report (an audit, a measurement, an analysis) that reads well, works in light and dark themes and on a phone, and can be published as a Claude artifact or opened locally. Use when the user asks for a report, an audit page, stats with graphs, or "make it an HTML page".
---

# html-report

A house style for reports that hold numbers: one reading column, wide figures, both themes, tables whose digits
line up. The files next to this one are the whole kit; nothing else needs to be installed.

Install: copy this folder to `~/.claude/skills/html-report` (or your agent's skills folder). Refresh the copy after
the folder changes here.

| File | What it is |
|---|---|
| `report.css` | The base styles and colour tokens. Inline it into the page at `/*__BASE_CSS__*/`. |
| `skeleton.html` | A page with every part in place: header, key numbers, findings, a chart, a table, method. |
| `check` | Screenshots the page at 1280 and 390 px wide, light and dark, with the Chrome already installed. |

A generator script reads `report.css` and replaces `/*__BASE_CSS__*/` in its template with it, so the published
page stays one file.

## Order of a report

The reader wants the answer first and the proof after it.

1. **Header**: a one-line context (`what was measured · data pulled <date>`), the title naming the subject, one
   paragraph on what the page covers and where the data came from. A short list of links to the sections when the
   page is long.
2. **Key numbers**: 4 or 8 tiles (`.kpis`), never a count that leaves one tile alone in a row. Each label says what
   the number counts and over which period.
3. **Findings**: sentences, each led by its number in bold. They are generated from the data where possible, so they
   stay true when the report is rerun.
4. **Reading and advice**, when asked for: what we think it means, what works, what to change, what to try. Keep it
   apart from the measured findings, and say "we think" where it is a guess.
5. **Evidence**: one section per question the reader has ("Does posting more often cost views?"), each with its
   charts and tables.
6. **Method**: the source, the period, what was left out, the definitions of every derived measure, what the data
   cannot show.

## Rules

**Headings.** Each section opens with an `h2` that says what the section answers. No small label above a heading,
no section numbers: the heading does that work. Figure titles are `h3`.

**Numbers.** Tabular figures everywhere (the base sets it). Right-align number columns (`th.n`, `td.n`). Round to
what the data supports. Write a unit or `%` on the number, not only in the header. Define each derived measure the
first time it appears, in the caption under the figure.

**Charts.** Chart.js from cdnjs, pinned (`4.4.1`). Take every colour from the CSS tokens and redraw when the theme
changes (the skeleton shows how), or ticks stay black on a dark page. Show shares, not counts, when the groups differ
in size. Mark an unfinished period ("2026 (to 10-10)") so a drop is not read as a decline. Hide groups too small to
trust and say so in the caption. Two y-axes only when both series share the x-axis and the caption says which is
which.

**Tables.** Wrap each in `.tbl` so it scrolls inside its box on a phone, not the page. Headers in sentence case.

**Boxes.** A figure sits on the page without a frame; only a block that stands apart from the flow (an interpretation
panel, the subject's profile) gets `.panel`. Never a box inside a box.

**Colour.** Accent for the main series and links; `--good` and `--bad` only for meaning (better, worse); `--warm` for
the second series. Change the tokens in `:root` and both dark blocks together to give a report its own palette.

**Type.** A display face for `h1` and `h2` only, a sans for the text, a mono for numbers in tables and tiles. Running
text stays under about 70 characters a line.

**Copy.** Plain sentences. Name things the way the reader does. A finding says what was measured and how much; the
advice says what to do.

**Privacy.** A report about people's activity counts them and never names them. The page source holds all of the
data the script embeds, not only what is shown, so leave names out of the embedded data too.

## Before you publish

1. Run `check page.html` and look at the four screenshots once: overflow on the phone, unreadable chart text in
   dark, a tile alone in a row, a caption missing.
2. Fix everything you saw in one pass. Do not loop.
3. As a Claude artifact: publish the HTML file. It must stay one file, with fonts from Google Fonts and scripts from
   cdnjs only.

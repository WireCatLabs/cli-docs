---
name: WireCat Memory comparisons
description: Local evidence-led homepage comparisons; no production identity selection.
colors:
  button: "#4b53f0"
  button-ink: "#fff"
  accent: "#4b53f0"
  accent-soft: "#eeefff"
  wall: "#f1f4f2"
  paper: "#fff"
  ink: "#182822"
  muted: "#4c5e55"
  line: "#ccd7cf"
  soft: "#e5ece7"
  teal-accent: "#236b63"
  blue-accent: "#315baf"
  warm-accent: "#5145df"
  dark-wall: "#131718"
  dark-paper: "#0d0f10"
  dark-ink: "#e9eeec"
  dark-muted: "#a7b1ae"
  dark-line: "#2a3034"
  dark-accent: "#9ea4ff"
  dark-accent-soft: "#202333"
  dark-soft: "#1c2023"
typography:
  display:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(32px, 3vw, 43px)"
    fontWeight: 800
    lineHeight: 1.22
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "29px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-.035em"
  result-title:
    fontFamily: "Onest, sans-serif"
    fontSize: "21px"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "-.02em"
  body:
    fontFamily: "Onest, sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  label:
    fontFamily: "Onest, sans-serif"
    fontSize: "13px"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.65
rounded:
  control: "7px"
  prompt: "8px"
  panel: "12px"
  pill: "999px"
spacing:
  compact: "12px"
  reading: "16px"
  panel: "20px"
  section: "37px"
components:
  button-primary:
    backgroundColor: "{colors.button}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  task-tab-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  prompt:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.prompt}"
    padding: "15px 16px"
---

# Design System: WireCat Memory comparisons

## Overview

**Creative North Star: "Memory"**

Memory is a local comparison system built around readable conversation evidence: a compact statement beside a worked result, with the messages behind it available on demand. Paper surfaces, restrained strokes and rounded controls keep the demonstrations legible against the faint illustrated wall.

This file describes only the finished prototypes in this directory. The owner selected the Memory headline and layout; the four comparison variants and light palettes are still alternatives, not a selected production identity. Production, earlier prototypes and the repository design system remain outside this record.

**Key Characteristics:**

- Evidence beside the result, with full transcripts one page away.
- Onest reading text and Unbounded display headings.
- Four light palettes; one unchanged production dark palette.
- Pill actions, stroked paper panels and restrained disclosure controls.

Scope and evidence: `DIRECTION.md`, `README.md`, `build.mjs`, `styles.css`, `base.css` and `interactions.js`. Reviewer disposition is ship at local comparison scope after the transcript class namespace and dropdown stacking fixes. Review captures at the repository’s `.impeccable/review/homepage-memory` cover the four variants at desktop, mobile, narrow and dark sizes, setup dropdown widths, footer themes, gallery and eight examples; this record does not claim production launch approval.

## Colors

### Primary

The classic light view uses the production purple for buttons and links. Teal, blue and warm variants substitute their named accent and matching pale selected-state fill. In dark mode, the button and link roles separate.

### Neutral

Wall is the page field; paper hosts demonstrations and disclosures; soft holds prompts; line separates reading groups. Ink and muted provide the reading hierarchy. The normative frontmatter records the default and shared dark roles; full alternative overrides remain in `styles.css`.

| Light test | Wall / ink / muted / line / soft | Accent / selected fill |
| --- | --- | --- |
| Classic | Default frontmatter roles | Default frontmatter roles |
| Teal | Classic neutrals | teal-accent / `#e2efeb` |
| Blue | `#f3f6fa` / `#172735` / `#495e70` / `#ccd7e2` / `#e9eef5` | blue-accent / `#e8eefb` |
| Warm | `#faf7f0` / `#28291f` / `#625e50` / `#ddd6c9` / `#efece3` | warm-accent / `#efeafa` |

**The Common Dark Rule.** Changing the light palette never changes the dark palette. Primary actions keep the production button color; links use the separate dark accent.

## Typography

Unbounded provides the heavy, tight display voice. Onest carries paragraphs, navigation, prompts and answer titles; system monospace is reserved for commands and tool payloads. The hero uses the display clamp in frontmatter, changes to 34px below 1100px, 36px below 900px, 32px below 650px and 28px below 374px. Supporting hero text is 18px/1.6, becoming 17px on phones. Result text grows from 14px to 15px on phones; source metadata grows from 12px to 13px. Paragraphs have a general 68ch ceiling, with more compact hero copy and evidence columns.

**The Readable Evidence Rule.** Display typography introduces the task; prompts, answers, sources and tool calls use reading or code typography.

## Layout

The main container is capped at 1320px with 40px side gutters; gutters reduce to 24px and then 18px. Desktop hero proportions are .95fr/1.35fr with a 42px gap. The result/source interior is 1.1fr/.9fr. At 1100px the evidence stacks; at 900px the hero stacks and evidence returns to two columns; at 650px both reading layouts become a single column. Benefit and feature groups use three columns and collapse to stacked rows with horizontal dividers on phones. The comparison gallery uses two columns, then one.

Comparison composition is local: all four retain the approved heading “Memory for your messages. Context for your agent.” Outcomes tests find/prepare/reply with tool inventory below; roles tests personal account/bots/admin with a small hero tool strip; workflow tests find/check/act with a quiet compatibility line; calculator repeats outcomes with one optional estimate and no hero tool strip. Every hero has three current landing scenarios. More tasks appear lower, and `/examples` holds all eight full walkthroughs. The redesigned Why section, permission/reading/source facts, existing closing setup block and current production footer follow. These alternatives are not global layout mandates.

## Elevation & Depth

Paper, soft tonal fills and thin strokes create the everyday depth. A faint tiled wallpaper appears behind the first viewport (opacity .5 in light, .12 in dark). Hover adds a small action shadow; setup disclosure uses `0 14px 32px #0d0f1024`. The open dropdown has z-index 60, its host 25, so nearby setup controls cannot cover it. Dropdowns constrain height to the viewport and scroll internally.

**The Disclosure Depth Rule.** Ordinary content stays flat. The setup dropdown alone uses a floating shadow and an open stacking level above adjacent setup controls.

## Shapes

Primary and secondary actions use pill corners. Prompt blocks use 8px corners; tabs and code disclosures generally use 7px; walkthrough and setup panels use 12px; the hero demo uses 13px. Thin borders distinguish bounded reading surfaces. Small stroked SVG icons support action and source affordances. Full transcript wrappers use the scoped `walkthrough-step` class to avoid the inherited circular badge geometry.

## Components

- **Actions:** primary buttons use button/button-ink, 12px 20px padding and a 45px minimum height. Secondary buttons use paper, accent text and a line stroke. Hover shadow transitions over .18s; links underline on hover. Links, buttons and summaries have a 3px accent focus outline with 4px offset.
- **Navigation:** header links open documentation and About pages. Connect opens native `details` dropdowns in header, hero and closing CTA. Only one setup dropdown remains open; outside click closes it, and Escape closes it and returns focus to its summary.
- **Setup disclosure:** Telegram/MAX provider controls replace the prompt, command and docs destination. Copy uses the actual `wordsFor('en').onboarding.prompt`; manual terminal setup is a nested disclosure. Copy feedback appears in an aria-live toast. This is a setup request to run in the user’s agent.
- **Task tabs:** selected tabs use accent-soft and accent; arrows, Home and End move selection and focus with roving tabindex. Walkthrough selection accepts the `case` query parameter. Sources disclose in place; full walkthrough links open `/examples`.
- **Demonstrations:** prompt, finished answer and message sources sit together. Hero summaries derive from reviewed `lib/landing/en.json`; full transcript IDs are namespaced while source identifiers remain readable. Tool calls use expandable preformatted blocks.
- **Calculator:** only the calculator version includes volume sliders and six editable timing assumptions. The result announces changes politely, labels negative savings honestly and states that setup/history downloads are excluded. Its arithmetic follows the current time-savings model; no measured performance claim is made.
- **Footer:** `footerHtml` is adapted with the same SiteFooter contacts, logo and installation placement transformations. Production CSS snapshots supply its layout and themes; local destinations are rebased to the public site. Preserve its content, links, columns and contact layout.

Panel transitions last .2s with `cubic-bezier(.16,1,.3,1)`. Reduced-motion preference disables animations and transitions.

## Do's and Don'ts

### Do:

- Do keep results and their source disclosures visually connected.
- Do use the same production dark roles in every comparison variant.
- Do retain keyboard tabs, visible focus and Escape focus return in setup dropdowns.
- Do preserve the production footer’s content and layout through its existing rendering transformations.

### Don't:

- Don’t promote an unselected comparison palette or benefit grouping into production identity.
- Don’t make header links or Connect controls scroll to homepage sections.
- Don’t apply the inherited circular step badge to full transcript wrappers.
- Don’t invent message evidence, tool syntax or performance claims.

Not canonized: inherited prior-prototype components, incidental scenario wording and comparison controls are not new reusable production rules. No new brand asset, alternate dark identity or production decision is established here.

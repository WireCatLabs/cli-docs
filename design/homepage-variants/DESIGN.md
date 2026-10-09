---
name: WireCat homepage comparison prototypes
description: Six local Persuade explorations within the existing WireCat visual language.
colors:
  bg: "#f1f4f2"
  paper: "#fff"
  soft: "#e6ece8"
  ink: "#182822"
  muted: "#4c5e55"
  line: "#cbd6cf"
  accent: "#5145df"
  accent-soft: "#eeeafd"
  on-accent: "#fff"
  dark-bg: "#171e1b"
  dark-paper: "#222d26"
  dark-soft: "#2d3c32"
  dark-ink: "#f0f5ef"
  dark-muted: "#b7c8bd"
  dark-line: "#475b4d"
  dark-accent: "#b3a9ff"
  dark-accent-soft: "#38314f"
  dark-on-accent: "#201838"
typography:
  display:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 64px)"
    fontWeight: 800
    lineHeight: 1.17
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(26px, 2.6vw, 38px)"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Onest, sans-serif"
    fontSize: "21px"
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Onest, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "14px"
    lineHeight: 1.7
rounded:
  tab: "6px"
  artifact: "8px"
  panel: "12px"
  demo: "15px"
  pill: "999px"
spacing:
  tight: "12px"
  paragraph: "16px"
  action: "24px"
  panel: "28px"
  section-mobile: "48px"
  section: "84px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "14px 23px"
  button-small:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  demo:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.demo}"
  installation:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
    padding: "28px"
---

# Design System: WireCat homepage comparison prototypes

## Overview

**Creative North Star: "The request, the context, a useful result."**

This scene uses Persuade mode: help people who already use AI agents see a useful messaging task and reach setup. It preserves WireCat's monogram, purple accent, green surfaces, Unbounded headings and Onest body. These six comparison prototypes do not select a replacement identity or govern production pages.

**Key Characteristics:**

- Large, compact display headings beside readable task evidence.
- Quiet surfaces and dividers; accent identifies actions and meaningful text.
- Complete local examples with expandable sources and an explicit setup ending.

Ground truth: [styles.css](styles.css), [build.mjs](build.mjs), [interactions.js](interactions.js). The [direction contract](DIRECTION.md) describes the scene; screenshot evidence is in [the review directory](../../.impeccable/review/variants/).

## Colors

### Primary

Purple `accent` marks primary buttons, highlighted headline phrases, text links and selected workflow stages. `accent-soft` supplies the selected workflow background; `on-accent` supplies its button contrast. The monogram retains its own embedded brand fill.

### Neutral

Pale green `bg` is the page canvas. White `paper` separates demonstrations, setup and control sections; `soft` groups prompts and commands. `ink`, `muted` and `line` distinguish principal text, supporting copy and divisions. The dark theme maps the same roles to the `dark-*` tokens above.

**The Role Continuity Rule.** Theme changes preserve surface and action roles across all six pages.

## Typography

Display and section headings use self-hosted Unbounded (800); body, controls and smaller headings use self-hosted Onest. Code uses the platform monospace stack. Balanced display text has tight tracking; body paragraphs have a default maximum width of 68ch.

The frontmatter records the shared ramp. Each hero has an implemented override: Direct tops out at 54px; Memory 80px; Context and Workflow 68px; Audiences 58px; Minimal 74px. Supporting hero copy uses 21px/1.6 and muted ink. Demo titles use 23px; compact demonstrations use 21px. Controls and supporting labels generally use 13–15px.

## Layout

The common desktop container is capped at 1200px with 40px side gutters; at widths of at least 1600px it caps at 1280px with 50px gutters. Sections use the recorded desktop spacing, while heroes and control bands have their own padding. Two-column introductions and setup blocks alternate with three-column outcomes and audiences.

| Local entrypoint | Implemented composition |
| --- | --- |
| [Comparison index](http://localhost:4325/) | Two-column numbered text list linking to all approaches. |
| [Direct](http://localhost:4325/direct) | Equal split hero with a compact reply-first demo; outcomes → audiences → control → extended workflow → setup → FAQ. |
| [Memory](http://localhost:4325/memory) | Centered oversized promise and bordered memory strip; asymmetric retrieval explanation/demo → outcomes → control → audiences → setup. |
| [Context](http://localhost:4325/context) | Left-aligned promise above source fragments and a payoff; outcomes → centered wide brief-first demo → audiences → extended workflow → control → setup. |
| [Audiences](http://localhost:4325/audiences) | Split heading and introduction; three equal audience columns → centered audience-specific demo → control → admin detail → setup → FAQ. |
| [Workflow](http://localhost:4325/workflow) | Large left-aligned promise and tool names; four-stage board → two-column explanation → audiences → control → setup. |
| [Minimal](http://localhost:4325/minimal) | Centered promise and agent names → 900px-wide demo → three concise reasons beside a heading → setup. |

At 1050px and below, gaps narrow and the control grid becomes two columns. At 760px and below, gutters become 18px, sections become 48px, principal columns stack, audience divisions become horizontal, and workflow tabs become a two-by-two grid. Secondary header links disappear while Connect and theme controls remain. Hero sizes reduce per variant; a further 374px breakpoint adjusts the narrowest heading, header and command sizes.

## Elevation & Depth

Dividers and alternating surfaces carry most depth. Demonstrations have a subtle ambient shadow; primary buttons acquire a slightly stronger shadow on hover. There are no hard offset shadows. Exact shadow and motion values live in the scoped sidecar.

## Shapes

Primary actions and installation choices are pills. Demonstrations have the largest panel corners; prompts and setup use softer panel corners; source quotations and artifacts use smaller corners. Thin borders separate panels, rows and disclosures. Icons are inline SVG strokes; the brand is an inline SVG monogram.

## Components

### Buttons and navigation

Primary actions are filled accent pills with a 48px minimum height; header actions use the small variant with a 40px minimum. Hover blends the accent toward ink. Text links pair readable text with an SVG arrow. Interactive controls share a 3px accent focus outline offset by 5px. The comparison selector belongs to a separate preview navigation band above product navigation.

### Demonstration and source evidence

The recurring demo contains example tabs, a shaded request with copy action, a useful result, and separate source/tool disclosures. Selected tabs use the soft surface and stronger text. Tabs use roving focus and ArrowLeft/ArrowRight/Home/End keys; hidden panels leave the visual flow. Audience links select their matching case and scroll to the demonstration.

### Setup

Telegram/MAX choices update the description, npm command, copied value and public installation guide together. The panel includes the next request and agent setup links. Copy confirms through the button and a live status toast; unavailable clipboard access produces a readable manual-copy fallback.

### Workflow and disclosures

The four-stage board retains a visible stage selector while switching between message, email, note and draft artifacts. It uses the same tab keyboard model as examples. Native source, execution and FAQ disclosures expose their content on request. Example results are illustrative and never execute messaging operations.

### Theme and motion

Theme selection persists locally under `wirecat-preview-theme`. Result panels use one brief opacity/blur transition; buttons and toast have short state transitions. Reduced motion disables animation, transitions and smooth scrolling. Content has no entrance animation.

## Do's and Don'ts

### Do:

- **Do** preserve shared color roles, fonts and components when comparing these six compositions.
- **Do** keep result sources inspectable and setup links concrete.
- **Do** preserve keyboard tab selection, visible focus and reduced-motion behavior.

### Don't:

- **Don't** treat this exploration as a selected production identity.
- **Don't** add fabricated customer evidence or imply these illustrative controls perform live actions.
- **Don't** inherit incidental per-variant copy, hero sizing or section order as global brand rules.

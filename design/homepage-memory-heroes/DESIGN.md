---
name: WireCat Memory hero variants
description: Scoped record of the implemented Outcomes landing refinement.
colors:
  primary: "#4b53f0"
  primary-soft: "#eeefff"
  neutral-bg: "#f1f4f2"
  paper: "#fff"
  ink: "#182822"
  muted: "#4c5e55"
  line: "#ccd7cf"
  soft: "#e5ece7"
  result-bg: "#eaf7ef"
  result-line: "#b5d6be"
  result-ink: "#1c6743"
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
  body:
    fontFamily: "Onest, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  transcript:
    fontFamily: "Onest, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "Onest, sans-serif"
    fontSize: "12px"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.65
rounded:
  tool: "6px"
  tab: "7px"
  inset: "8px"
  request: "10px"
  dropdown: "12px"
  demo: "13px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  scenario-tab-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.tab}"
    padding: "10px"
  provider-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  transcript-request:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.request}"
    padding: "17px 18px"
  transcript-response:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.request}"
    padding: "18px"
  tool-console:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.muted}"
    rounded: "{rounded.inset}"
    padding: "14px 15px"
---

# Design System: WireCat Memory hero variants

## Overview

**Creative North Star: "Memory"**

This scoped system records the finished prototype in this directory. It retains the selected Outcomes page: expressive headings, a muted green canvas, purple actions and compact evidence from conversations. The heading and the original AI-agent dialogue share the first viewport; the interface makes requests, executed tools, replies and source messages visually distinct.

The three variants change how the same original exchanges are disclosed. The wider page retains the Outcomes examples, six Why features, setup controls and production footer. This record describes their shared visual vocabulary; it does not replace the repository's broader design authority.

**Key Characteristics:**

- Purple actions on quiet green and white surfaces.
- Unbounded headings with Onest reading text.
- Original conversation evidence with progressive disclosure.
- Rounded inset surfaces, thin dividers and restrained shadows.

## Colors

### Primary

Purple marks primary actions, selected scenario tabs, active providers, icons and inline emphasis. Its pale companion identifies selection without competing with the dialogue.

### Secondary

The inherited green result colors distinguish outcome surfaces and supporting result treatments.

### Neutral

The green canvas holds white panels; the softer neutral fills setup prompts; requests use the pale purple accent. Ink carries reading text, muted ink carries supporting labels, and the line color separates adjacent controls and evidence.

**The Semantic Surface Rule.** Label every request, tool group and reply. Requests use a right-aligned purple inset; consecutive tools share a muted console; replies use a separate full-width bordered surface. Preserve these role distinctions when adapting the original markup.

Dark mode uses the implemented overrides: canvas `#131718`, paper `#0d0f10`, soft `#1c2023`, ink `#e9eeec`, muted `#a7b1ae`, line `#2a3034`, accent `#9ea4ff` and accent-soft `#202333`. Primary buttons retain the primary fill and white text. The production footer retains its own inherited theme variables.

## Typography

Display and section headings use Unbounded with Onest and sans-serif fallbacks. Body text and controls use Onest; commands use the system monospace stack.

The display is heavy and tightly tracked, while long exchanges use regular reading text. Desktop transcripts use the transcript role; mobile increases them to body size with the same generous line height. Tool summaries and supporting source metadata stay smaller. Paragraphs are capped at 68 characters where the inherited layout permits.

**The Reading Role Rule.** Keep code in monospace and source labels subordinate to request and reply text. Do not flatten the conversation into a single typographic treatment.

## Layout

The shared desktop container is capped at 1320px with 80px total side space. The hero splits into `.85fr` copy and `1.35fr` dialogue columns with a 42px gap. At 1000px the hero stacks and its copy uses two columns; at 650px the copy becomes one column. Container gutters narrow to 48px total, then 36px total on mobile.

The dialogue sits in one bordered panel. Its transcript scrolls internally with a 690px height cap and 760px on mobile. Requests occupy 90% of the transcript width and align right; on mobile they occupy 96%. Replies occupy the full width. A compact role key sits between toolbar and scenario tabs. The transcript has 22px side padding on desktop and 16px on mobile. Toolbar, tabs and walkthrough controls remain distinct bands around that transcript.

Outcomes examples, the six Why items and the useful feature strip use three columns on desktop and collapse to a single reading column on mobile. The useful strip contains digests, latest files and unanswered questions. Setup dropdowns are anchored to their triggers; their inherited viewport height cap and scrolling are implementation behavior, not a new layout policy.

## Elevation & Depth

Thin borders and surface tone provide most depth. The primary button gains a soft hover shadow (`0 4px 12px #26343824`); setup panels use `0 14px 32px #0d0f1024`. The faint inherited wallpaper belongs to the page canvas. Source disclosures remain flat inset surfaces.

## Shapes

Primary actions and provider segments use pill shapes. Scenario tabs, request insets and tool disclosures use smaller rounded corners; the main demonstration and setup panel have broader corners. Dividers separate content bands and columns without enclosing every paragraph.

## Components

### Buttons and setup controls

Primary actions use purple fill, white text and a pill silhouette. Secondary actions use white fill, purple text and a thin border. The inherited focus treatment is a 3px purple outline offset by 4px. Hover adds the soft button shadow. Setup is a native details disclosure containing provider selection, a copyable agent request and optional terminal installation instructions; the header panel aligns to its trigger's right edge.

### Scenario and provider controls

Scenario tabs wrap within their band and show selection through a pale purple fill and purple text. Telegram/MAX provider controls sit inside a neutral pill container; the pressed option uses a white fill and purple text. Mobile gives these controls more vertical room. The hero compatibility row shows Telegram, MAX and Email.

### Original conversation

Requests carry a Your request label inside a right-aligned purple bordered inset. Consecutive executed tools form one muted Tool calls console with a command count; native expandable rows use monospace summaries and reveal payloads labeled Tool output · JSON. Replies carry an Agent response header inside a separate full-width bordered white surface and retain the original lists, paragraphs and source disclosures. The compact role key repeats these three labels before the transcript. Role headers use bold Onest text and small bordered SVG badges; the response header has a lower divider. These labels are metadata, preserving every original message and command. Chat begins with the first exchange and expands the continuation. Walkthrough presents original exchanges with Previous/Continue controls. Answer begins with the final original request/result and expands earlier history. Source message disclosures reveal the original quoted evidence. Adapted class and ID namespaces isolate these transcripts from older badge styles.

### Outcomes, feature strip and footer

Outcome columns pair concise headings with small result surfaces. The three useful lower features use the same reading hierarchy and purple line icons. The six Why items form a divided grid. Footer layout, language control, installation command and links remain the scoped production snapshots, with Onest overrides for this prototype.

## Do's and Don'ts

### Do:

- Do preserve the original requests, executed tools, replies and quoted source messages when changing disclosure layout.
- Do distinguish conversation roles through explicit labels, alignment and separate surfaces.
- Do retain the visible selected and pressed states of scenario and provider controls.
- Do keep focus outlines visible on links, buttons and disclosure summaries.
- Do retain the shared Outcomes vocabulary and inherited footer when extending these variants.

### Don't:

- Don't allow older badge classes or duplicate IDs to restyle the imported transcript.
- Don't style original tool calls as decorative result claims.
- Don't promote variant-specific disclosure order into a repository-wide design rule.

Not canonized: alternate palette selectors and unused inherited demo patterns belong to the prototype's source history; they are not the selected refinement's system.

---
name: WireCat homepage-next exploration
description: Shared visual system of three local homepage interpretations
colors:
  accent: "#5145e8"
  accent-soft: "#efedff"
  bg: "#f1f5f3"
  paper: "#fff"
  ink: "#142726"
  muted: "#4c6365"
  line: "#cddbd9"
  soft: "#edf3f2"
  green: "#eaf7ef"
  green-line: "#b5d6be"
  green-ink: "#1c6743"
  terminal: "#1c2c31"
  terminal-ink: "#ecf3ef"
  dark-bg: "#172321"
  dark-paper: "#223330"
  dark-ink: "#eaf3ee"
  dark-muted: "#b7cbc9"
  dark-line: "#45615b"
  dark-accent: "#b8afff"
  dark-accent-soft: "#38364e"
  dark-soft: "#2b3e3a"
  dark-green: "#234135"
  dark-green-line: "#4b8063"
  dark-green-ink: "#b8eccb"
  dark-terminal: "#12201f"
typography:
  display:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(29px, 2.7vw, 42px)"
    fontWeight: 800
    lineHeight: 1.22
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-.035em"
  title:
    fontFamily: "Onest, sans-serif"
    fontSize: "17px"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "-.02em"
  body:
    fontFamily: "Onest, sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.65
rounded:
  field: "6px"
  tab: "7px"
  card: "8px"
  button: "10px"
  example: "12px"
spacing:
  small: "12px"
  medium: "16px"
  large: "20px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#fff"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  tab-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.tab}"
    padding: "8px 10px"
  source-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "12px"
  answer:
    backgroundColor: "{colors.green}"
    rounded: "{rounded.card}"
    padding: "17px"
---

# Design System: WireCat homepage-next exploration

## Overview

**Creative North Star: "Inspectable context"**

This records the shared visual language of three completed local homepage prototypes: Guided, Workspace and Connections. Their compact compositions interpret the three preserved raster references; they are not pixel-perfect reproductions or a selected production identity. DIRECTION.md remains the surface brief, and this document applies only within this exploration.

The pages pair a quiet green field and fine divisions with dense, inspectable source material and purple actions. The same evidence-to-outcome vocabulary appears as a guided sequence, a dark-topped workbench and a source/context/result flow.

**Key Characteristics:**

- Compact introduction beside inspectable evidence.
- Purple actions, green outcomes and quiet neutral surfaces.
- Bold display headings with readable, dense source text.
- Shared components across three distinct compositions.

## Colors

### Primary

Purple accent and its pale selected-state surface distinguish calls to action, links, emphasized heading text and active tabs.

### Secondary

The green surface, stroke and ink identify answers and proposed artifacts. Small blue, purple and green source badges distinguish Telegram, MAX, email and notes; they are identity markers, not an additional action palette.

### Neutral

Green-tinted background, white paper, dark ink, muted text and fine lines organize the page. Soft neutral surfaces hold requests and commands. The workbench uses dark terminal surfaces with light text. Dark theme swaps the same semantic CSS variables; primary button and step text changes to dark purple ink for contrast.

**The Action and Outcome Rule.** Purple identifies actions and selected states; green identifies the useful result. Source identities retain their own small color markers.

## Typography

Display and section headings use the bundled Unbounded face; Onest provides body copy, titles and controls. Monospace is reserved for commands. The wordmark is an existing SVG asset.

The base hierarchy is recorded above. Hero supporting text uses (18px/1.58), source excerpts (13px/1.65), and compact labels generally (12–13px). At mobile width, excerpts increase to (14px), answer copy to (15px), and outcome headings to (19px). Paragraphs generally cap at (68ch). Headings balance their lines rather than expanding into oversized hero typography.

## Layout

The shared container caps at (1380px), with (40px) side gutters at normal desktop widths. Hero columns use (.84fr 1.5fr) with a (38px) gap. Guided distributes request, sources and answer; Workspace splits sources and result inside a workbench; Connections inserts a context node between sources and proposed artifact. Below them, fine divisions organize three feature columns, audience paths, integrations, trust and setup.

At (1200px), gutters shrink to (24px) and evidence grids simplify. At (900px), the hero stacks while its introduction becomes two columns. At (650px), gutters become (18px), introduction and evidence become single columns, navigation simplifies, and detail text grows. A narrow adjustment at (374px) fits the header and actions; a wide adjustment at (1700px) expands the container cap to (1480px). Components use wrapping and minimum-width safeguards for compact screens.

## Elevation & Depth

Borders and tonal layering supply most depth. The pale wallpaper is a low-opacity repeating motif behind the hero. Workbench chrome creates a darker inset zone. Buttons gain only a soft hover shadow (`0 4px 12px #26343824`); cards remain bordered rather than elevated. Selected panels enter with a short opacity/blur animation (200ms); reduced-motion preference disables animation, transitions and smooth scrolling.

## Shapes

Containers use gentle corners: example shells (12px), buttons and setup containers (10px), source/request/answer cards (8px), tabs and artifacts (7px), and command fields (6px). Thin strokes connect the surfaces visually. Circular source badges, step markers and the theme control are compact exceptions. Icons are inline stroke SVGs; source identities use small colored circles.

## Components

### Buttons

Primary actions use purple, white text, (12px 20px) padding and a minimum height of (45px); compact header actions reduce this to (38px). Secondary actions use paper, purple text and a fine border. Text links keep the same accent without a filled surface. Interactive links, buttons and disclosure summaries share a (3px) accent focus outline offset by (4px).

### Navigation

The preview strip links the three alternatives and preserved originals, with accent text for the current page. Site navigation pairs the WireCat SVG wordmark, section/doc links, theme control and setup action. Section links are hidden below (900px); the comparison strip wraps on mobile. These are local comparison controls, not a production navigation commitment.

### Example tabs and provider choice

Example tabs wrap rather than scroll; selected tabs use the pale purple surface. Four tasks share roving keyboard focus with arrow, Home and End support. Feature links select a task and scroll to it. Telegram/MAX installation choice uses pressed-state buttons and updates both the visible command and copied text.

### Source cards and answers

Source disclosures show identity, origin and excerpt immediately. Expanded details expose the source text. Green answer panels and proposed artifacts keep follow-up instructions and evidence disclosures separate from the completed output.

**The Inspectable Evidence Rule.** Source identity and an excerpt remain visible before a disclosure is opened; expanded details expose the original text.

### Requests, commands and status

Requests and installation commands use soft inset surfaces with copy controls. Copy feedback appears in a live status toast, with manual-copy fallback when clipboard access fails. Theme preference persists locally. There is no editable search input or live query playground in these prototypes.

## Do's and Don'ts

### Do:

- **Do** keep the shared tokens and components consistent across these three prototypes.
- **Do** preserve readable excerpts, keyboard focus, selected states and reduced-motion behavior.
- **Do** stack the evidence flow on small screens while keeping its source-to-result order.

### Don't:

- **Don't** treat this comparison as a selected production design system.
- **Don't** replace visible source excerpts with decorative placeholders.
- **Don't** imply that illustrative examples are live agent activity.

---
name: WireCat conversational hero treatments
description: Three compact landing compositions within the purple-green Memory world.
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
  body:
    fontFamily: "Onest, sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  conversation:
    fontFamily: "Onest, sans-serif"
    fontSize: "14px"
    lineHeight: 1.6
  label:
    fontFamily: "Onest, sans-serif"
    fontSize: "12px"
    fontWeight: 600
  tool:
    fontFamily: "monospace"
    fontSize: "12px"
    lineHeight: 1.65
rounded:
  inset: "8px"
  thread: "10px"
  messenger: "13px"
  bubble: "12px"
  prompt: "5px"
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
  scenario-tab-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    padding: "10px 12px"
  provider-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  user-bubble:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    padding: "11px 14px"
  assistant-bubble:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    padding: "13px 15px"
  quiet-activity:
    textColor: "{colors.muted}"
---

# Design System: WireCat conversational hero treatments

## Overview

**Creative North Star: "Memory"**

The current landing keeps the Memory heading, purple/green palette and Unbounded/Onest pairing, with tighter conversation and section density. Content, proximity and quiet horizontal rules join the page; separate frames belong to useful controls and conversation details rather than every section.

The owner selected `/landing-editorial` on 2026-10-09 as the canonical composition: open role lists, simple outcomes and compact bubbles. Workspace (role rail/unframed agent prose) and folds (expandable role rows/continuous conversation) remain alternatives in the studio and library. Four scenarios and three complete exchanges remain available in each conversation. Earlier designs are preserved references, not new heading or brand authority.

**Key Characteristics:**

- Compact conversation text and bounded scrolling.
- Three uses followed by concise question/result outcomes.
- Quiet rules with restrained functional frames.
- Trust and an editable estimate lead to setup.

## Colors

### Primary

Purple marks actions, selected controls, commands and the continuation cue. Pale purple supports understated selections and the continuous-conversation prompt.

### Secondary

Quiet green canvas and soft conversation surfaces carry the established Outcomes identity; inherited green result tokens remain available.

### Neutral

White paper, dark ink, muted supporting text and thin neutral rules keep evidence readable. Existing dark overrides remain: canvas `#131718`, paper `#0d0f10`, soft `#1c2023`, ink `#e9eeec`, muted `#a7b1ae`, line `#2a3034`, accent `#9ea4ff`, accent-soft `#202333`. Solid action fills retain white text.

## Typography

Unbounded retains the heavy, tightly tracked Memory display. Onest carries conversation text at 14px/1.6 on desktop and mobile; this is the intentional compact scale. Section headings use 26px, reducing to 24px on mobile. Role headings use 17px, capability names 14px and descriptions 13px (14px mobile). Outcome headings use 16px (17px mobile). Trust headings are 17px; command and supporting controls use 11–12px. Commands retain monospace. Older 15px conversation and oversized section examples are preserved references rather than the current defaults.

## Layout

Current sequence: hero → roles → outcomes → tool inventory → nine reasons → trust → calculator → CTA → footer. `/landing` and `/bubbles` alias the selected editorial/search composition. `/landing-editorial` combines open roles/simple outcomes/compact bubbles; `/landing-workspace` combines role rail/short dialogue outcomes/plain agent response; `/landing-folds` combines role folds/ask-get rows/continuous conversation. Each also has search/chat/voice ending URLs.

Conversation widgets use 16px 18px 12px padding and a 436px desktop cap, becoming 13px 12px and 470px on mobile. They scroll through all content. Turn spacing is 12px; requests use 11px 14px padding and responses 13px 15px, reduced on mobile. The continuation cue is 38px in this compact scope. Three hero-detail previews contain only the right-hand conversation rather than repeated whole heroes.

**The Complete Conversation Rule.** Reduce padding and initial viewport height without removing message content, source evidence or either follow-up.

The selected simple What you can do section occupies a full-width paper band between the green role and tool sections, retaining the same internal container and columns. Dark mode uses the existing paper token.

Role/outcome sections use 32px vertical spacing (26px mobile), split heading/context rows and 28px column gaps. Open roles and outcome columns stack at 650px. Workspace pairs a `.7fr` role rail with `1.3fr` capabilities, becoming horizontal role controls at 760px. Fold summaries retain all role names and summaries; mobile removes their indented content. Trust stacks at 760px. The unchanged editable estimate sits immediately before the unchanged left CTA.

## Elevation & Depth

Thin rules, quiet tones and compact inset surfaces provide most depth. The visible continuation cue retains its continuous 2.4-second opacity/scale/vertical pulse and soft offset shadow, including hover/focus; reduced motion disables animation and smooth scrolling. Used cues hide as subsequent exchanges appear. Existing setup-panel and action-hover shadows remain restrained.

## Shapes

The conversation widget uses an 8px radius. Compact bubbles use mirrored `12px 12px 3px 12px` and `3px 12px 12px 12px` corners. Plain replies are unfilled; continuous prompts use 5px corners and full width. Role rail selection and query previews use 5px corners; short dialogue examples use `9px 9px 3px 9px`. These are intentional current values, rather than inherited 17px bubbles or broad repeated section frames.

**The Purposeful Frame Rule.** Use proximity and quiet rules to join sections; reserve rounded surfaces for conversation, commands and functional controls.

## Components

### Conversation and checked commands

Retain all four scenarios, copyable Telegram/MAX requests, sources and both follow-ups. Read-only command blocks show checkmarks, first command and true remaining count, with more command names disclosed and no hero JSON. Call-count badges stay on one line, have no width cap, do not shrink and have a 28px minimum height; CLI text wraps in the remaining space. Their observed width is 93–95px across desktop/mobile/narrow captures, rather than a fixed-width token. Exact JSON remains inspectable on Examples. Compact, plain and continuous detail widgets vary framing while keeping the same content. Primary actions, selected scenario/provider controls and inherited 3px accent focus outlines remain.

### Roles and outcomes

**The Six Capabilities Rule.** Retain six capabilities for every role: three visible plus three disclosed in editorial, six in the workspace panel, and six inside each fold.

Role order is Personal account, Bots, Administer groups. Editorial shows all role lists and labeled three-more disclosures. Workspace uses accessible rail navigation. Folds use native details, opening the first role initially. Outcomes contain one task heading, one question and one result, without an additional repeated explanatory paragraph.

### Trust, calculator and setup

Open source, Your data and Your agent form a compact icon/heading/description/link strip before the calculator. Source links identify MIT messaging tools; data text distinguishes local archive storage from the agent’s model handling; agent text identifies CLI/MCP-compatible existing agents. The tool inventory, editable savings calculator and left setup invitation are unchanged.

Search now begins with a compact query preview and an optional functional sample test. Expansion exposes editable presets, input, actual matches and invalid-query feedback against 36 fictional local messages. Browser/desktop agent and original voice-note alternatives remain compact. No live account is connected by these examples.

### Production adaptation

The selected editorial composition is adapted for the public Next application in English, Russian and Spanish. Public entry routes are `/`, `/ru` and `/es`; localized feature and worked-example routes are `/{lang}/features` and `/{lang}/examples`. Feature pages use the reviewed three-role layout; examples retain the sidebar/mobile selector conversation library. The locale menu, owned links and native Next navigation/theme integration preserve the selected typography, palette, surfaces and complete interactions.

`components/landing/editorial.tsx` supplies the public client interactions and cleans up listeners. `scripts/export-editorial.mjs` generates scoped public snapshots in `lib/editorial/{en,ru,es}.json` and `lib/editorial/editorial.css` from the selected release sources. Search uses the local parser; installation actions retain analytics. Fictional fixtures and editable qualified estimates remain explicit, and retained English code/results carry locale notices.

All private collections remain in `design/`, outside the public export and sitemap: the durable inventory retains 81 links and the library retains 58 records. `pnpm design:serve` restores the five local preview ports. Production adaptation does not replace prior designs. Non-rendered inherited CSS detector warnings do not establish new visual rules; the rendered editorial system remains the authority. See [RELEASE.md](./RELEASE.md) for the release contract.

### Private workspace and preserved references

The studio selects composition, ending, theme, viewport and reason icons, and previews older pages. The library has 58 records, including 18 retained earlier blocks/images. Full/half metadata keeps multi-column sections full width and lets small conversation/command/ending parts share columns; previews resize to content up to 1800px. All 81 local design links remain in the durable [DESIGN-LINKS.md](./DESIGN-LINKS.md) inventory and machine registry.

Local indices: [current landing](http://127.0.0.1:4329/landing), [three compositions](http://127.0.0.1:4329/iteration-five), [studio](http://127.0.0.1:4329/studio), [block library](http://127.0.0.1:4329/block-library), [all design links](http://127.0.0.1:4329/all-designs). Current pages: [editorial](http://127.0.0.1:4329/landing-editorial), [workspace](http://127.0.0.1:4329/landing-workspace), [folds](http://127.0.0.1:4329/landing-folds).

Owner-selected references remain [original mockups](http://127.0.0.1:4326/references), [Guided](http://127.0.0.1:4326/guided) and [Calculator landing](http://127.0.0.1:4327/calculator). The before-rework composition remains at [its snapshot](http://127.0.0.1:4329/history/landing-before-visual-rework.html). Private indices are local review tools, absent from public-style navigation/footer; production routes and prior originals remain untouched.

## Do's and Don'ts

### Do:

- Do preserve the Memory heading and existing purple-green identity.
- Do retain complete three-turn conversations within the compact viewport.
- Do place trust before the unchanged calculator and setup.
- Do preserve bot-history limits, owner decisions and accurate model-processing wording.

### Don't:

- Don’t promote older heading, radius or section scales into the current compact composition.
- Don’t claim agent processing is necessarily local.
- Don’t replace full-width catalogue sections with half-width previews.

Not canonized: earlier large feature/composition scales, archived concept identities and an unconfirmed newspaper identity remain references rather than the current system.

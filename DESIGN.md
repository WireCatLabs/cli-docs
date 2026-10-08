---
name: WireCat
description: Existing public-site visual system, documented from the shipped About surface.
colors:
  brand: "#4b53f0"
  light-wall: "#f1f4f2"
  light-ink: "#182822"
  light-ink-soft: "#4c5e55"
  light-app: "#ffffff"
  light-app-2: "#f3f6f4"
  light-app-3: "#e5ece7"
  light-app-line: "#ccd7cf"
  dark-wall: "#131718"
  dark-ink: "#e9eeec"
  dark-ink-soft: "#a7b1ae"
  dark-app: "#0d0f10"
  dark-app-2: "#141719"
  dark-app-3: "#1c2023"
  dark-app-line: "#2a3034"
typography:
  about-title:
    fontFamily: '"Unbounded", sans-serif'
    fontSize: "clamp(30px, 3.6vw, 46px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  about-headline:
    fontFamily: '"Unbounded", sans-serif'
    fontSize: "clamp(20px, 2vw, 25px)"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  about-intro:
    fontFamily: '"Onest", system-ui, sans-serif'
    fontSize: "clamp(19px, 2vw, 23px)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: '"Onest", system-ui, sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  controls: "999px"
spacing:
  gutter: "clamp(16px, 2.7vw, 48px)"
  article-section: "32px"
  reading-inset: "24px"
  column-gap: "clamp(32px, 5vw, 72px)"
components:
  theme-toggle:
    rounded: "{rounded.controls}"
    height: "40px"
    width: "40px"
---

# Design System: WireCat

## Overview

WireCat's existing public-site identity pairs purple branding with green-tinted neutral surfaces, strong rounded lettering and clear reading space. About expresses that identity as a compact project article: an unboxed title, introduction and bold open-source statement lead into the story, with project facts and direct contact actions alongside it.

This document records the implemented system, with About as its reference surface. It preserves the incumbent identity and shared homepage decisions. About's article composition and smaller title are scoped to that page; they do not redefine the homepage hero. The detailed About direction remains in [.impeccable/surfaces/app-lang-home-about-page-tsx.md](.impeccable/surfaces/app-lang-home-about-page-tsx.md).

**Key Characteristics:**

- Purple WireCat monogram and word mark in the shared shell and project facts panel.
- Green-tinted light neutrals and charcoal dark neutrals with theme-aware ink.
- Open, ruled article sections beside a compact supporting sidebar.
- Distinct documentation/source links, compact email/Telegram buttons and secondary funding copy.

Source authority: [lib/landing/landing.css](lib/landing/landing.css), [lib/landing/theme.css](lib/landing/theme.css), [lib/landing/about.css](lib/landing/about.css), [lib/landing/header.css](lib/landing/header.css), [lib/landing/footer.css](lib/landing/footer.css), [app/[lang]/(home)/about/page.tsx](app/[lang]/(home)/about/page.tsx) and [lib/about.ts](lib/about.ts). Frontmatter records a reusable subset of those styles; source CSS remains authoritative for theme switching and the cascade. No product context or replacement brand world is established here.

## Colors

### Primary

The purple `brand` token identifies WireCat in the logo and matches the public-site `--me` selection accent. About's project-panel logo uses that same accent. Content links use ink, keeping purple concentrated in the identity.

### Neutral

Use the matching light or dark family through the existing CSS variables:

| CSS role | Light token | Dark token | Use |
| --- | --- | --- | --- |
| `--wall` | `light-wall` | `dark-wall` | Page ground and open article |
| `--ink` | `light-ink` | `dark-ink` | Headings, introduction, emphasized statements and links |
| `--ink-soft` | `light-ink-soft` | `dark-ink-soft` | Reading copy, fact labels and command names |
| `--app` | `light-app` | `dark-app` | Project facts panel and shared shell surfaces |
| `--app-2` | `light-app-2` | `dark-app-2` | Secondary shell surfaces, including the footer command strip |
| `--app-3` | `light-app-3` | `dark-app-3` | Purpose statement and shared tonal layers |
| `--app-line` | `light-app-line` | `dark-app-line` | Panel borders, article rules and navigation dividers |

Dark values originate on the public-site wrapper; `.light` supplies the light overrides. The shared shell has additional dim, status and syntax colors; they are not a new About palette.

**The Semantic Theme Rule.** Bind backgrounds, text and dividers to their existing semantic variables so the complete surface switches together.

## Typography

**Display and About section headings:** Unbounded, sans-serif, weight 800. English, Russian and Spanish share this family and weight. The current heading selection supersedes older Anybody, Oswald and Fira declarations in the stylesheet.

**Body:** Onest, system-ui, sans-serif. **Code:** JetBrains Mono, ui-monospace, Menlo, monospace. The shared footer retains its own `var(--font-docs, "Inter", sans-serif)` body override.

The frontmatter's `about-title`, `about-headline` and `about-intro` roles describe About only. Its title spans 30–46px, followed by a compact opening paragraph limited to 52ch and a bold 16px open-source statement. Article paragraphs use the body role and a maximum width of 70ch. Sidebar headings step down to 17px with a 1.45 line-height; sidebar paragraphs and fact values use 15px. Mobile contact keeps these smaller heading and copy sizes. Command names and fact labels are smaller supporting text. Funding paragraphs use 16px while retaining the article line-height.

Headings retain sentence case, tight tracking and balanced wrapping; introductory copy uses pretty wrapping. The wide heading family is part of the identity. Allow localized headings to wrap naturally rather than substituting a condensed face.

**The Scoped Hierarchy Rule.** Preserve each surface's established scale: About is a readable project article, while the homepage retains its own hero and section typography.

## Layout

The shared content wrapper is centered at a maximum width of 1240px with the fluid gutter recorded above. About narrows that wrapper to 1180px and uses top padding of `clamp(32px, 4vw, 56px)` with 56px below. Its unboxed introduction is limited to 800px and sits directly above the article and sidebar; it has no negative margins or primary demo links.

On wide screens, the article and sidebar use `minmax(0, 2.2fr) minmax(260px, 1fr)` columns and the recorded column gap. Story sections use the repeated article-section padding and a thin top rule; heading and copy occupy the same column. The sidebar groups project facts, contact text with email/Telegram buttons and contribution links. It remains in normal document flow.

Below 60rem, contact text and buttons appear immediately after the introduction, the desktop sidebar contact is hidden, and the article layout becomes one column. The mobile contact is separated by a thin top rule. The sidebar follows the entire story. Its grid has two tracks at this breakpoint, with contributions spanning both. Below 40rem, the sidebar becomes one column; project facts arrange in two columns with the maintainer spanning both, and panel padding reduces to the reading inset. Tool descriptions move below each row's documentation and GitHub links. Preserve this order across English, Russian and Spanish.

About's four article sections proceed through purpose, available tools, future plans and funding with a maintainer contact link. Open-source identity is stated in the introduction; its `#open-source` anchor remains there for existing links. Available tools include Telegram, MAX and Memo for email and notes. Future copy addresses owned data, personal context, knowledge, tasks and productivity; funding explains how custom AI work supports development and maintenance. Project facts and contribution routes support that story. This hierarchy belongs to About, not every public-site page.

## Elevation & Depth

About's introduction and article are flat on the page ground. Spacing, tonal contrast and thin theme-aware rules provide structure. The project facts panel is the one gently lifted surface, with `box-shadow: 0 12px 30px color-mix(in srgb, var(--ink) 5%, transparent)`. The purpose statement uses a tonal fill and border without a shadow. Shared homepage decoration remains governed by its existing styles; About adds no decorative background layer.

**The Article Ground Rule.** Keep story sections open and flat; reserve a contained surface for supporting facts or a meaningful statement.

## Shapes

About concentrates soft corners in the supporting facts panel (16px), purpose statement and contact buttons (12px). Those component-specific values do not establish a global radius scale. The introduction and ordinary article sections have no enclosing border or rounded panel. Shared theme and language controls retain their pill shape. Decorative link arrows are 18px square and do not shrink; contact buttons use smaller 16px mail and conversation icons.

## Components

- **Shared header and footer:** retain the existing shell and WireCat logo. The active About navigation item carries `aria-current="page"`. Language selection preserves the route, and the theme control switches the semantic palette.
- **Article introduction:** one h1, a concise opening paragraph and a bold open-source statement, directly on the page ground. The statement preserves `#open-source` with a 100px scroll margin. Contact follows the introduction on mobile; the story follows on desktop. Demo promotion belongs to the homepage's established composition.
- **Tool navigation:** three ruled rows pair Telegram, MAX and the localized email/notes label with the monospace commands `tg`, `max` and `memo`. Each bold name/command link opens documentation; a separate GitHub link with an arrow opens that tool's repository. Telegram, MAX and Memo documentation use localized site routes; Memo opens `/{lang}/docs/memo`. Descriptions sit between these links on larger screens and beneath them below 40rem. Documentation and agent setup links follow as a wrapping inline group.
- **Purpose statement:** a bordered tonal inset emphasizes the project's purpose within the first section. It uses the reading inset on larger screens and a smaller inset on narrow screens.
- **Project facts panel:** the shared logo, a supporting heading and a semantic definition list identify tools, MIT licence and maintainer. Its padding is 28px, reducing to the reading inset below 40rem. Keep this supporting context smaller than article headings.
- **Contact actions:** a supporting heading and short invitation precede two outlined buttons for configured email (`mailto:`) and the maintainer's direct Telegram URL. The same content renders in the desktop sidebar after project facts and on mobile immediately after the introduction; CSS displays only the appropriate instance. Buttons wrap with a 12px gap, retain at least 44px height and use theme-aware surface fill, ink and borders. Hover changes the fill to the secondary tonal layer without underlining the label; keyboard focus retains the common ink outline.
- **Contribution links:** text with decorative arrows follows the desktop contact in the sidebar and links to project GitHub issues. Tool repositories have their own links in the article; there is no standalone source/security link group or contents menu. Inline action groups, repository and contribution links retain at least 44px height. Article sections retain a 100px scroll margin.
- **Funding:** a final ruled article section with smaller body copy explains custom workflows, bots and integrations, their support for open-source maintenance, and the invitation to discuss work by email or Telegram. A text link opens the configured maintainer's Telegram account. Its treatment remains secondary to the project's story and tools.

About text links underline on hover with a 5px underline offset. Keyboard focus uses a 2px ink outline with a 5px offset. Retain semantic main/header/article/section/aside/navigation structure, one h1, meaningful h2s and accessible navigation labels. Decorative arrows and contact icons stay `aria-hidden`; tool documentation and repository links have distinct accessible names. Preserve the shared-shell reduced-motion behavior when extending interactions. These are implementation facts, not a claim of a complete accessibility audit.

## Do's and Don'ts

### Do:

- Do reuse the shared identity, font families and semantic light/dark variables.
- Do preserve clear reading order, natural locale wrapping and visible keyboard focus.
- Do keep About's open-source identity in the introduction and its project story and available tools ahead of secondary funding copy.
- Do use quiet rules and spacing to separate editorial sections, with smaller supporting context in the sidebar.
- Do place direct contact actions after the mobile introduction and the supporting sidebar after the story when columns collapse.
- Do keep tool documentation and GitHub destinations distinct, including the email/notes tool.

### Don't:

- Don't replace the incumbent identity or promote dormant font declarations as current typography.
- Don't turn every section into a card or make funding compete with the project introduction.
- Don't carry About's article composition or smaller title into the homepage as a global redesign.
- Don't hard-code a light-only color into a theme-aware component.
- Don't invent testimonials, counts or decorative imagery to fill the layout.

# Logo sources

Retrieved 2026-10-29. All SVGs checked: no `<script>`, no `href`/`<image>`/`@import`/`url(http…)`, no event handlers (nothing had to be stripped).
Claude files carry an inline `<style>` block (plain CSS fills only). Overview: `_sheet.png`. The untouched downloads (the full Anthropic and Cursor zips) were not committed; fetch them again from the sources below.

"Dark" in a name = works on a dark background. "Derived" = made by me from an official file, not downloaded.

| File | Brand / what | Exact source | Current? | Dark-bg use |
|---|---|---|---|---|
| whatsapp.svg | WhatsApp glyph, #25D366, no background | https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg (the favicon `<link rel=icon>` of https://www.whatsapp.com/) | yes (served on whatsapp.com today) | green glyph works on dark as is |
| whatsapp-dark.svg | same, all-white | derived: `fill:#25d366` replaced by `#FFFFFF` | shape yes, colour is my edit | white; see rules, optional |
| telegram.svg | Telegram paper plane, blue gradient circle | https://telegram.org/img/t_logo.svg | yes | works on dark as is |
| max.svg | MAX messenger (VK) logo, gradient bubble ring, transparent | https://max.ru/favicon.svg | yes (served on max.ru today) | works on dark as is |
| max-apple-touch.png | MAX app icon, 180 px (below the 256 px target, only an extra) | https://max.ru/apple-touch-icon.png | yes | works on dark |
| gmail.svg | Gmail 2020+ multicolour M | https://fonts.gstatic.com/s/i/productlogos/gmail_2020q4/v8/192px.svg (Google's own product-logo CDN, the URL Google products use) | yes (2020q4 set) | works on dark as is |
| google-drive.svg | Google Drive 2020+ triangle | https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v8/192px.svg | yes | works on dark as is |
| google-calendar.svg | Google Calendar 2020+ "31" icon (white page, so it shows as a light tile on dark) | https://fonts.gstatic.com/s/i/productlogos/calendar_2020q4/v8/192px.svg | yes (v8; older v3 differs) | works on dark as is |
| obsidian.svg | Obsidian gem, purple gradient (official "logo" asset) | https://obsidian.md/images/obsidian-logo-gradient.svg (shown on https://obsidian.md/brand) | yes | works on dark as is |
| obsidian-flat.svg | Obsidian flat purple mark (site favicon) | https://obsidian.md/favicon.svg | yes | works on dark |
| zoom-wordmark.png | Zoom wordmark, blue, 1426x321 | https://media.zoom.com/images/assets/zoom-logo-2025.png/Zz04ZjU1ODA4OGM5NjUxMWYwYWQ3NDIyZTYxNWM4NmY4Yg== (the "Download Zoom logo" tile on https://www.zoom.com/en/about/media-kit/) | yes (2025 file) | for light bg |
| zoom-wordmark-dark.png | Zoom wordmark, white, 1426x321 | derived: the file above, RGB set to white, alpha kept (ImageMagick) | shape yes, colour is my edit | white on dark |
| zoom-wordmark-white-official-188px.png | official white wordmark, only 188x43 | https://media.zoom.com/images/assets/logo-zoom-white%402x.png/Zz00MjVhNzc4ZWM2YWUxMWYwOWNhMjEyMGQ4NTViMmE1ZQ== (same media-kit page) | yes | official white, too small for print; use the derived one for the render, or this one to confirm the derived one matches |
| zoom-app-icon-appstore.png | Zoom Workplace app icon (blue square, "zoom"), 1024 px, square corners | App Store artwork of "Zoom Workplace", seller Zoom Communications, Inc.: https://apps.apple.com/us/app/zoom-workplace/id546505307 ; image URL https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/98/69/60/9869606e-7bd2-1fa4-4398-7b079ba8ae57/AppIcon-0-0-1x_U007epad-0-1-0-0-85-220.png/1024x1024bb.png | yes | works on dark |
| claude-spark.svg | Claude spark, Clay #D97757 | Anthropic press kit zip https://www.anthropic.com/press-kit -> https://www-cdn.anthropic.com/ae59ca4ca194dac9c9dc3bc78c5829468cb0e8af.zip, "Claude logos/3 Claude Spark/SVG/Claude Spark - Clay.svg" | yes | works on dark |
| claude-icon.svg | Claude app icon, rounded square | same zip, "4 Claude icon/SVG/ClaudeIcon-Rounded.svg" | yes | works on dark |
| claude-logo.svg | Claude spark + wordmark, Slate text | same zip, "1 Claude logo/SVG/Claude logo - Slate.svg" | yes | for light bg (text is near black) |
| claude-logo-dark.svg | same, Ivory text | same zip, "Claude logo - Ivory.svg" | yes | **use on dark** |
| claude-code.svg | Claude Code logo (spark + "Claude Code"), Slate | same zip, "2 Claude Code logo/SVG/Claude Code logo - Slate.svg" | yes | for light bg |
| claude-code-dark.svg | same, Ivory | same zip, "Claude Code logo - Ivory.svg" | yes | **use on dark** |
| openai-blossom-dark.svg | OpenAI blossom, white. Used for **Codex** (see doubts) | derived: the blossom path of https://developers.openai.com/favicon.svg (OpenAI Developers site, the Codex docs live there), circle removed, fill `#FFFFFF`, viewBox set to the path bounds | blossom is the Feb 2025 mark | white on dark |
| openai-blossom.svg | same, black | derived, fill `#000000` | same | for light bg |
| openai-favicon-developers.svg | untouched official favicon: white blossom on #0080F7 circle | https://developers.openai.com/favicon.svg (identical at https://learn.chatgpt.com/favicon.svg) | yes | works on dark |
| openai-github-avatar.png | OpenAI GitHub org avatar, black blossom on white square, only 200 px | https://avatars.githubusercontent.com/u/14957082?s=1024 (github.com/openai) | yes | no (white square); cross-check only |
| cursor-dark.svg | Cursor cube, 2D, white (file `CUBE_2D_DARK.svg`) | Cursor brand zip https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/cursor-brand-assets.zip (linked from https://cursor.com/brand), "General Logos/Cube/SVG/CUBE_2D_DARK.svg" | yes (Sept 2025 kit; 2D is their default) | **use on dark** |
| cursor.svg | same cube, near black (`CUBE_2D_LIGHT.svg`) | same zip | yes | for light bg |
| cursor-3d.svg | 2.5D grey cube (`CUBE_25D.svg`) | same zip | yes | works on dark, brand says "for larger applications" |
| cursor-app-icon-dark.svg / cursor-app-icon-light.svg | Cursor rounded app icon, dark / light | https://cursor.com/marketing-static/favicon.svg and favicon-light.svg | yes | the -dark one suits dark bg |
| openclaw.svg | OpenClaw mascot (red lobster-bot), no wordmark | https://openclaw.ai/brand/openclaw-mascot.svg (same as https://openclaw.ai/favicon.svg) | yes (used as site logo/hero mark) | works on dark |
| openclaw-horizontal-dark.svg | mascot + white "OpenClaw" wordmark (site file `openclaw-horizontal-light-text.svg`, i.e. "light text") | https://openclaw.ai/brand/openclaw-horizontal-light-text.svg | yes | **use on dark** |
| openclaw-horizontal.svg | mascot + dark wordmark (site file `openclaw-horizontal-dark-text.svg`) | https://openclaw.ai/brand/openclaw-horizontal-dark-text.svg | yes | for light bg |
| openclaw-banner-dark.png | README banner, 1280x358, dark, with tagline | https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-banner-dark.png (github.com/openclaw/openclaw) | yes | cross-check only |

## Brand rules that matter

- **WhatsApp**: Meta Brand Resource Center, https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/ (opened as the es-es page). Rule read there: do not modify the assets, do not change their colours, resizing only, never make the logo the most prominent element. So `whatsapp-dark.svg` (white) is outside what I read; prefer the green glyph. The official logo pack zip sits behind an "I accept the rules" checkbox; I did not accept terms on your behalf and did not download it.
- **Telegram**: no logo guideline page found. https://core.telegram.org/api/terms 2.4 only says third-party apps must not use the official logo. Using it in an illustration of "Telegram" is a trademark question for you.
- **MAX**: no brand or press page found (https://max.ru/brand and /press return 404). Files come from the site's own favicon and touch icon. Treat as unconfirmed against guidelines.
- **Gmail / Drive / Calendar**: Drive page https://developers.google.com/workspace/drive/api/guides/branding says no pre-approval needed to use the logo, API ToS applies, "Google Drive" with the first reference marked ™, your own logo must be larger than the Google one when shown together. I found no equivalent Gmail or Calendar page (the guessed URLs return 404). Assume the same rules; also https://about.google/brand-resource-center/ is Google's general brand centre. Do not recolour or crop.
- **Obsidian**: https://obsidian.md/brand: "do not edit, change, distort, recolor, or reconfigure the Obsidian logo". Single colour use is allowed only as all black or all white of the whole mark. Name, logo and icon are trademarks; commercial use: contact them.
- **Zoom**: brand centre https://brand.zoom.com/ (Frontify, needs JS; I could not read it). Media kit https://www.zoom.com/en/about/media-kit/ points to it for guidelines. Wordmark and app icon are different assets; the app icon is the blue square with the "zoom" word, not a camera. I did not read Zoom's rules on white versions.
- **Claude / Anthropic**: press kit https://www.anthropic.com/press-kit (no guideline text inside the zip; https://www.anthropic.com/brand returns 404). Use Ivory variants on dark; Clay is the spark colour #D97757.
- **OpenAI**: https://openai.com/brand/ returns 403 to scripted requests; I did not try to get around that. Rules not read.
- **Cursor**: https://cursor.com/brand: call it "Cursor", not "Cursor AI" or "Cursor Code"; 2D is the default logo, 2.5D for larger uses; horizontal lockup preferred.
- **OpenClaw**: no brand page; files are the ones the site itself uses. Repo is MIT, the artwork licence is not stated.

## Doubts and gaps

1. **Codex has no mark of its own that I could retrieve.** I found none on developers.openai.com, in github.com/openai/codex, or in the App Store (only third-party "Codex" apps). `openai-blossom*.svg` is the OpenAI blossom, as you allowed. The OpenAI brand page was blocked (403), so the blossom was taken from OpenAI's developer site favicon, not from the brand kit. Cross-check: Wikimedia Commons "OpenAI logo 2025 (symbol).svg" has the same shape, but its description does not cite an official source, so it is not used (not kept).
2. **WhatsApp, Telegram, MAX, Gmail, Drive, Calendar, Obsidian-flat, OpenClaw** came from the sites' favicon or CDN, not from a press kit (WhatsApp's was gated). The art is the real one, but you cannot assume it is the "press kit master".
3. **Zoom**: only a 188 px official white wordmark exists; the white file I made from the 1426 px blue one is a recolour (Zoom's rule on that unread). Wordmark and app icon both present, pick one for consistency.
4. **Zoom app icon** has square corners (App Store artwork); iOS rounds it. Round it yourself if the schematic uses rounded tiles.
5. **Calendar** icon is a white page with "31", so on #0f1412 it reads as a light tile. This is the official design.
6. **OpenClaw**: the GitHub org avatar (github.com/openclaw) is a different red lobster artwork on a red square. The site mark (mascot) is what I used. Owner, 2026-10-29: use the site mascot. The mascot's file `<desc>` says the favicon has "dark eyes with grey highlights instead of green"; I rendered it and it matches openclaw.ai's header.
7. **MAX**: `max.svg` is 72 KB because it contains masks and gradients; renders fine.

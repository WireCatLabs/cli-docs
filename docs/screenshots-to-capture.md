# Installation screenshots

The Telegram and MAX installation guides show screenshots beside the relevant login steps:
`/{en,ru,es}/docs/tg/installation` and `/{en,ru,es}/docs/max/installation`.
The general installation page explains the shared setup and links to these guides.

`lib/installation-screenshots.ts` owns placements, localized descriptions and capture filenames.
`components/screenshot.tsx` renders existing images or a localized dashed placeholder. The same
images and placeholder descriptions appear in the guides' Markdown counterparts.

After saving a reviewed image under `public/screenshots/`, set its slot's `src` in
`lib/installation-screenshots.ts` to its target path. Saving the file alone does not replace a
placeholder. Check all three locales and mobile rendering before publishing.

## Captures and placement

| File | Placement | Status |
| --- | --- | --- |
| `telegram/code-message.jpg` | Code for my.telegram.org, before account QR login | Existing, restored |
| `telegram/terminal-qr.png` | Telegram account-login QR in the terminal | Needed |
| `telegram/add-device.jpg` | Phone Settings → Devices → Add Device | Existing, restored |
| `telegram/my-telegram-login.png` | Browser fallback: phone number and confirmation code | Existing, restored |
| `telegram/my-telegram-api-tools.png` | Browser fallback: API development tools | Existing, restored |
| `telegram/my-telegram-credentials.png` | Browser fallback: App api_id and App api_hash | Existing, restored |
| `max/terminal-qr-current.png` | Current MAX setup's account-login QR | Fresh capture needed |
| `max/devices-scanner.png` | MAX phone Settings → Devices, QR scanner | Needed |

The older `max/terminal-qr.png` remains available as historical material. Its terminal output
uses earlier setup wording and step labels, so the current guide does not present it as the current
setup screen. Capture its replacement from the current supported tool.

## Capture procedure

With authorization to perform a live account login, run `bin/login-screenshot tg` or
`bin/login-screenshot max` from this repository. The script runs setup in throwaway folders,
keeps the existing login/archive/settings separate, and logs the test device out at the end.
Review the script's cleanup, including any application registration retained in the system
keyring, before a live capture. This documentation edit does not itself perform a login.

Before publishing:

- Confirm a QR code is expired or already used; otherwise cover the entire QR.
- Hide phone numbers, names, usernames, app hashes, login codes and private chat titles.
- Crop to the step the image explains, retaining the relevant label or prompt.
- Use PNG/JPG; preserve phone screenshots' proportions and a readable terminal width.
- Check the text against the current tool's supported commands and setup sequence.

Optional later captures: `telegram/phone-prompt.png`, `telegram/logged-in.png` and
`max/logged-in.png`. These are not required to replace the current login placeholders.

# WireCat Desktop walkthrough screenshots

`content/docs/desktop/index{,.ru,.es}.mdx` place each screen with `<DesktopShot shot="…" />`
(`components/desktop-shot.tsx`). The component shows a light/dark pair and falls back to the English
capture for a language that lacks one. It renders nothing until `{shot}-light-en.webp` and
`{shot}-dark-en.webp` exist, so the pages are complete without them and each shot appears by itself once the
files are in `public/screenshots/desktop/`. Nothing else needs editing.

Capture from the browser build of `wirecat-desktop` (`node scripts/capture.mjs out.png "<query>" [--dark]`,
see its CLAUDE.md), with the sample data of `?showcase`. The language comes from the browser's language or
`localStorage["wirecat.language"]` (`en`, `ru`, `es`). Use the size and framing of the existing shots
(1040x650 webp). Each shot needs six files: `{shot}-{light,dark}-{en,ru,es}.webp`.

| Shot (file stem) | Screen | Query for the browser build | Status |
| --- | --- | --- | --- |
| `onboarding-welcome` | Setup, Welcome step | `?state=fresh` | Missing |
| `onboarding-install` | Setup, Install step with the progress bar | `?state=fresh&onboarding=install&install=tg,wa&hold=wa` | Missing |
| `guides` | Guides page | `?showcase&section=guides` | Missing |
| `analytics` | Analytics page, without the Preview parts | `?showcase&section=analytics&analytics=real` | Missing |
| `storage` | Storage page with folders, backups and tables | `?showcase&section=storage` | Missing |
| `settings` | Settings page: language, interface size, a tool's settings | `?showcase&section=settings` | Missing |

Own tools (`own-name`, `own-review`, `own-confirm`, `own-tools-list`, `own-refused`): English only, copied from
wirecat-desktop `docs/images/own-*.webp` (1280 wide, not 16:10). Russian and Spanish pages show the English capture
until `{shot}-{light,dark}-{ru,es}.webp` exist. `own-settings` has all six: `capture.mjs` at `--width 1280 --height 400`
with `?showcase&section=settings&community=1&own=on`, saved as WebP without resizing.

## Landing and download page shots

The home page's Desktop section shows `tools`, `memory` and `digests`. The download page's gallery
(`components/desktop-gallery.tsx`) shows all eight below. Their text is in
`design/homepage-chat-treatments/release-{source,locales}.json` (after a change run `pnpm landing:export`, then `pnpm exec biome format --write lib/editorial/editorial.css`) and in
`lib/download.ts`. All 48 files were captured from Desktop main at `2a6d79d9` (0.6.0) at 1440x900 with
`--lang en|ru|es` and `--dark`, then cropped with `node scripts/crop-desktop-screenshots.mjs <folder>`.

| Shot | Query | Before the capture |
| --- | --- | --- |
| `tools` | `?showcase` | |
| `agents` | `?showcase&section=agents` | |
| `search-hit` | `?showcase&search=tg` | Open the first result, then its messages around it, and scroll the search box to the top |
| `tasks` | `?showcase&view=board` | |
| `memory` | `?showcase&section=memory` | |
| `connect` | `?showcase&connect=called` | Scroll the MCP server heading to about 70 px below the top bar |
| `digests` | `?showcase&section=digests` | |
| `analytics` | `?showcase&section=analytics&analytics=real` | |

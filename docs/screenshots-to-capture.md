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

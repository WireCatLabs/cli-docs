# Screenshots to capture for "Install and log in"

The page `content/docs/installation.mdx` shows a dashed "Screenshot needed" box in each place
below. Save each file under `public/screenshots/` with the exact name given, and the box is replaced
with the image.

## Before you start

- **Take QR screenshots only after the code has expired.** A live QR code is a working login for
  your account. Wait until the terminal shows a new code or the login times out, then capture.
- **Blur** phone numbers, names, usernames, the api_hash and chat titles you don't want public.
- **PNG**. Phone screenshots at the phone's own size; terminal screenshots with a normal-width
  window (about 100 columns), light or dark theme, whichever you use.
- Crop to the part that matters: the prompt, the message, the menu item.

## Telegram

Run `tg setup` with a profile that has never logged in, so you see every step:
`tg shots setup` creates a throwaway profile called `shots`. Afterwards run `tg shots session end`
to log it out.

| # | File | What it must show |
|---|---|---|
| 1 | `telegram/code-message.png` | Telegram on your phone: the message from **Telegram** (the service chat) with the code for my.telegram.org. Phone width. |
| 2 | `telegram/terminal-qr.png` | The terminal during `tg setup`, showing the QR code and the line "scan in Telegram → Settings → Devices → Link Desktop Device". Expired code only. |
| 3 | `telegram/link-desktop-device.png` | Telegram on your phone: **Settings → Devices**, with the **Link Desktop Device** button visible. Phone width. |
| 4 | `telegram/create-app-form.png` | my.telegram.org → API development tools, the "Create new application" form filled in (title, short name, platform Desktop). You only see this if your number has no app yet; skip it if you can't reach it. |

Already have (no action): `telegram/my-telegram-login.png`, `telegram/my-telegram-api-tools.png`,
`telegram/my-telegram-credentials.png`.

## MAX

Run `max shots setup` with a throwaway profile; afterwards `max shots session end`.

| # | File | What it must show |
|---|---|---|
| 5 | `max/terminal-qr.png` | The terminal during `max setup`, showing the QR code. Expired code only. |
| 6 | `max/devices-scanner.png` | MAX on your phone: **Settings → Devices**, with the button that opens the QR scanner. Phone width. |

## Optional

| File | What it must show |
|---|---|
| `telegram/phone-prompt.png` | The terminal asking "phone number, international format:" (number blurred if typed). |
| `telegram/logged-in.png` | The end of `tg setup`: the "Logged in as …" line and the five chats (names blurred). |
| `max/logged-in.png` | The end of `max setup`: the account line and the five chats (names blurred). |

When the files are in place, tell me and I switch each placeholder to its image.

# Screenshots to capture for "Install and log in"

The page `content/docs/installation.mdx` shows a dashed "Screenshot needed" box in each place still
missing. Save each file under `public/screenshots/` with the exact name given; then the box is
replaced with the image.

## How to get a fresh login on screen

Run, from this folder:

```sh
bin/login-screenshot tg
```

or `bin/login-screenshot max`. The script runs `setup` with empty throwaway folders, so the CLI
behaves like a first install and cannot see your real login, archive or settings. Your real login
keeps working. At the end it logs the test device out and deletes the folders.

One thing stays behind on Telegram: if you finish the test login, the app ID and hash are saved in
your system keyring under an entry named after the deleted folder. It is harmless.

## Before you start

- A QR code stops working within a minute, so a screenshot of it is safe to publish later.
- **Blur** phone numbers, names, usernames, the api_hash, login codes and chat titles.
- PNG or JPG. Phone screenshots at the phone's own size; terminal screenshots with a normal-width
  window (about 100 columns).
- Crop to the part that matters: the prompt, the message, the menu item.

## Telegram

| # | File | What it must show | Status |
|---|---|---|---|
| 1 | `telegram/code-message.jpg` | The message from **Telegram** with the code for my.telegram.org | ✅ done |
| 2 | `telegram/terminal-qr.png` | The terminal during `bin/login-screenshot tg`, showing the QR code | needed |
| 3 | `telegram/add-device.jpg` | **Settings → Devices** with the **Add Device** button | ✅ done |

## MAX

| # | File | What it must show | Status |
|---|---|---|---|
| 4 | `max/terminal-qr.png` | The terminal during `bin/login-screenshot max`, showing the QR code | needed |
| 5 | `max/devices-scanner.png` | MAX on your phone: **Settings → Devices**, with the button that opens the QR scanner | needed |

## Optional

| File | What it must show |
|---|---|
| `telegram/phone-prompt.png` | The terminal asking "phone number, international format:" (number blurred if typed) |
| `telegram/logged-in.png` | The end of setup: "Telegram is ready" and the five chats (names blurred) |
| `max/logged-in.png` | The end of `max setup`: the account line and the five chats (names blurred) |

When the files are in place, tell me and I switch each placeholder to its image.

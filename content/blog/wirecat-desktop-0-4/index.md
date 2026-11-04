---
title: "WireCat Desktop 0.4: see what you keep, and change your mind"
description: A new Analytics page shows what WireCat keeps and how you use it. Approved memories can be edited or taken back, installs show real progress, and settings repairs never leave your computer.
date: 2026-11-04
tags: [release-notes, ai-agents, security]
author: viacheslav-ptsarev
draft: true
---

WireCat Desktop is the app that installs the WireCat tools, signs you in and gives your AI agent your chats, mail,
meetings, documents and notes, all kept on your computer. 0.3 was about search holding up on real data. After a few
more days with the app I wanted two things it couldn't give me. I wanted to see what it actually keeps, and I wanted
to change my mind about something I'd already approved. 0.4.0 does both, and it fixes what I found on my first day
with 0.3 in the real app.

The tools moved fast too, and I never wrote about most of it. So the second half of this post catches up: a Google
Calendar tool, a mail tool, a WhatsApp Business bot and more.

## Analytics: what WireCat keeps

There's a new Analytics page under Memory. The top shows what WireCat keeps on your computer: messages, chats,
emails, documents, meetings and attachments, how much space they take, where they come from and how many messages
you have per year.

Below that, the page shows your messages over time with how many you sent yourself, who you hear from most and the
busiest chats. Then come your projects with their open, overdue and closed tasks, and how your memory grows. You
pick the period (7, 30 or 90 days, or all time) and which messengers and accounts to count.

Every number comes from a command of the tool itself, and each panel names that command. The app only adds the
answers up. Names are read from this computer and stay on it, and **Hide names** blanks them when you want to show
the page to someone.

## Change your mind about memory

In 0.3, once you approved something on the Memory page, the row said "Approved" and that was it. Now every kind of
record has a way back.

- A memory can be edited, marked **No longer true**, or erased.
- A decision can be edited, or you can **Undo approval**.
- An approved action opens the task it created, and a reviewed batch shows what it made.

"Correct" is now called **Edit**, because that's what it does. And **Approve** shows how many rows it approves and
approves exactly the rows on your screen, so you always know what you're saying yes to.

## Installs you can follow

Installing a tool used to be a spinner and a wait. Now you see how long it has taken, one plain sentence about what
is happening, and for npm a bar that fills from npm's own count, like "Downloading 35 of 60 packages". After a first
install the app offers to teach your agents the new tool. Before a sign-in starts, it lists the steps, about how long
they take and what happens to what you share.

On Windows, tools now install without administrator rights.

## Settings repair stays on your computer

When a tool's settings file is broken, the Health check now offers **Repair the file**. It runs the tool's own repair command
on your computer, tells you what changed and where the old file is kept, and checks again.

I also tried a button that handed the problem to your AI agent, and dropped it before release. To fix the file, the
agent reads all of it, keys included, and sends it to its AI provider. That's not a trade I want to make for you.

Two more safety changes. The app installs a tool update only when the tool's own GitHub release workflow built it from
its main branch. And bug reports and diagnostics now mask chat titles and contact names, not only tokens and keys.

## New in the tools since the last post

The app installs and updates these tools for you, and your agent can use each of them on its own too.

- **Google Calendar** has its own tool now. Your agent can read your calendar offline, find a free slot, spot
  overlaps, create and answer invitations, and prepare a short brief before a meeting. It can also follow iCalendar
  feeds. ([gcal releases](https://github.com/WireCatLabs/gcal-cli/releases))
- **Mail** has its own tool too. It keeps your mailbox in the same local store over IMAP, signs in to Gmail and
  Outlook, and `review` shows what is new, what you owe and what waits for an answer. Sending has safety limits.
  ([mail releases](https://github.com/WireCatLabs/mail-cli/releases))
- **WhatsApp Business**: the WhatsApp tool can run a bot on a Business number through Meta's Cloud API, with
  templates, files and webhooks. ([wa 0.6.0](https://github.com/WireCatLabs/whatsapp-cli/releases/tag/v0.6.0))
- **Zoom**: `zm review` lists your meetings since a point in time, with what was decided and who talked.
  ([zm 0.37.0](https://github.com/WireCatLabs/zoom-cli/releases/tag/v0.37.0))
- **Telegram**: your agent can leave a message as a draft in the chat for you to check and send, and send up to 10
  photos or files as one album.
- **Google Drive**: a local folder can stay in sync with Google Docs and Sheets in both directions.
- **Memo**: `memo review` puts everything that waits for you in one list, from proposed tasks to invoices.

## In case you missed it

Two things have been in the app since 0.1, and I never showed them properly.

- **Your agent in ChatGPT or Claude on the web.** On the Tools page, the MCP server section starts a tool's server and
  walks you through a Tailscale or Cloudflare address, so ChatGPT or Claude in the browser can reach your messages on
  your computer. You choose what it may do, and sending can stay off.
- **Backups.** The Storage page backs up everything WireCat keeps, with an optional password.

## Smaller fixes in the app

- A tool's panel closes again after an update, and **Remove this copy** cleans up an extra copy of a tool installed by
  another package manager.
- On Linux the scrollbar no longer sits under the window's resize edge.
- Every dialog has a close button and closes when you click outside it.
- When a service limits how fast you sync, the app says so and shows how long it asked you to wait.
- The version number opens a Help menu with your system, Node.js and npm versions.
- Documentation links open wirecat.dev.

## Get it

If you have 0.3, the app offers the update itself. New here? Download WireCat from
[wirecat.dev/download](/en/download) for macOS, Windows or Linux. The full list of changes is in the
[release notes on GitHub](https://github.com/WireCatLabs/wirecat-desktop/releases/tag/v0.4.0).

If something breaks or feels wrong, tell me on [Discord](https://discord.gg/DebENqbRrJ) or open an issue on
[GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues). I read all of it.

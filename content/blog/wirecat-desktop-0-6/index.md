---
title: "WireCat Desktop 0.6: Contacts, Clients, Digests and a Memory that explains itself"
description: Four new or rebuilt pages. See who is who across all your messengers, move CRM deals on a board, get a digest every morning, and decide what your agents remember with the source in front of you.
date: 2026-11-11
tags: [release-notes]
author: viacheslav-ptsarev
draft: false
---

WireCat Desktop is the app that installs the WireCat tools, signs you in and gives your AI agent your chats, mail,
meetings, documents and notes, all kept on your computer. Until now the app was mostly about setting the tools up.
0.6 is the first release where you work with your data in it. There are three new pages, Contacts, Clients and
Digests, and the Memory page is rebuilt. All four are marked beta, with a small β beside the name. They are new, and
I want to hear where they break.

## Contacts: one person, all their accounts

Kai writes to me in Telegram, sends contracts by email and sits in my CRM as a client. Before, that was three people
for my agent. The **Contacts** page puts them together. It shows everyone from Telegram, MAX, WhatsApp, email,
meetings and Bitrix24, sorted into people, companies, newsletters, strangers and unsorted, with phones, emails,
message counts and tasks.

![The Contacts page with six matches waiting and a table of people with their contacts and message counts](./contacts-en.webp "One row per person. Matches that need your eye wait above.")

WireCat joins two accounts by itself only when they share an email, or a phone number no one else has. Anything less
sure waits for you as a match. The card says what matched, for example the same phone or the same company. Open it
to compare the people side by side, with their deals, tasks and latest messages, and join them or keep them apart.
If a join was wrong, you undo it from the person's card. When your agent thinks one person is really two, it asks you
here too.

## Clients: your deals on a board

The **Clients** page shows your CRM deals and leads as a table or as a board by stage. Drag a card to the next stage,
and the change goes to Bitrix24 too. If you have more than one CRM, or a CRM with its own stage names, **Map stages**
puts each of its stages under one of yours, so everything lines up on one board. WireCat suggests where each stage
goes, and you accept with one click.

![The Clients board with deals in columns by stage, Call, Quote, Contract, Won and Lost](./clients-en.webp "Deals from every CRM on one board.")

The sync copies only the deals of the CRM users you choose, not the whole portal. In a team CRM most deals are other
people's, and your agent doesn't need them.

## Digests: one page every morning

A digest is one short summary of what came in and what waits for you, from your chats, mail, meetings and tasks.
The **Digests** page sets them up. Pick a daily or a weekly one, or make your own. Choose when it runs, what it reads,
and where it goes: the app, a Telegram bot or mail. Each digest has a cost limit, so a busy day can't surprise you.
**Get now** makes one at once, and you can edit what it collects and how it looks, with a preview.

![The Digests page with a daily, a weekly and an evening digest, their schedules and last runs](./digests-en.webp "Each digest says when it ran, what it cost and when it runs next.")

Claude Code writes the digests, so you need it installed.

## Memory that explains itself

Agents connected to WireCat save what they learn about you and the people around you. Nothing counts until you
approve it. The old Memory page was a list of rows with Approve and Reject, and it was hard to know what you were
approving. Now a band at the top says how it works: an agent suggests, you check, agents use it. Each row reads as a
sentence. Open one and you see where it came from, what agents will know, and what Approve and Reject change.

![The Memory page with the three steps and suggestions grouped by who they are about](./memory-en.webp "Suggestions grouped by who they are about, each with its source.")

You can also add to memory yourself. **Add to memory** takes pasted text, a link or a file, keeps it as a document you
can search, and suggests facts from it. You keep the ones you tick. When the source of a memory changes or goes
away, the row says so.

## One AI model for all of it

Some of this needs an AI model, for example reading the text in a picture. In **Settings**, **AI model** now holds
one provider, one model and one key for everything: Anthropic, OpenAI or a compatible service, or Ollama on your own
computer. **Check** tells you in plain words if it works. Two search helpers use it too, and both are off until you
agree. One adds other words to your notes and emails so a question in different words finds them, the other reorders
the top results of one search when you press **Search harder**. Each shows what leaves your computer, where it goes
and what it costs before you turn it on.

## Smaller things

- **One sign-in for every tool.** Each sign-in says what to have at hand, shows its steps, and has a Back. A failure
  says what happened and one way to fix it. MAX can sign in with a token, WhatsApp with a phone number and a code, and
  Gmail with Google directly, with no Google Cloud setup of your own.
- **Remove an account** from the account menu, with a choice to keep or delete its data. Telegram accounts are only
  signed out for now.
- **Add your own tool** by its npm name, with a review before it installs.
- **`wirecat://` links** open a chat, a message, a task or a digest in the running app.
- **Check for updates** is in the Help menu.
- **Import records** from a CSV or JSON file in Storage, with a check that lists each refused line.
- **Tasks** is calmer, and shows the tasks Memo found in your chats.
- **Pages open much faster.** A page you opened in the last minute shows at once.

## Get it

If you have 0.5, the app offers the update itself. New here? Download WireCat from
[wirecat.dev/download](/en/download) for macOS, Windows or Linux. The [Desktop guide](/en/docs/desktop) covers each
page, and the full list of changes is in the
[release notes on GitHub](https://github.com/WireCatLabs/wirecat-desktop/releases/tag/v0.6.0).

The four new pages are beta. If Contacts joins the wrong people, or a digest misses something, tell me on
[Discord](https://discord.gg/DebENqbRrJ) or open an issue on
[GitHub](https://github.com/WireCatLabs/wirecat-desktop/issues). I read all of it.

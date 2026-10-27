---
title: Placeholder post for the blog layout
description: A draft that exercises every part of a post page. It is never published; the launch post replaces it.
date: 2026-10-27
tags: [ai-agents, cli]
cover: ./cover.png
coverAlt: A purple placeholder cover with the words "Placeholder cover"
draft: true
---

This post is a placeholder. It exists so the blog pages can be checked with real Markdown before the
first post is written: headings, a list, a quote, an image with a caption, code and a table. Production
builds leave it out because its front matter says `draft: true`.

## What a post page shows

A post opens with its title, date, reading time and tags, then the cover. The body follows in one
readable column. Headings feed the contents list beside the text on wide screens.

- Paragraphs keep a line length that is easy to follow.
- Links such as [the documentation](/en/docs) use the site's link style.
- Inline code like `tg inbox --json` uses the monospace face.

> A quote stands apart from the text around it, without a coloured bar.

## An image with a caption

![A diagram: the agent calls the tool](./diagram.png "The agent calls the tool; the tool answers with one JSON value.")

## Code

```sh
npm install -g @wirecat/tg-cli
tg inbox --json | jq '.chats[0]'
```

```ts
const unread = chats.filter((chat) => chat.unread > 0)
```

## A table

| Command | What it does |
| --- | --- |
| `tg inbox` | Unread chats |
| `tg review --unanswered` | Who still waits for an answer |

## The end of a post

After the body come the discussion links, the follow links and, once the endpoint exists, the
newsletter form.

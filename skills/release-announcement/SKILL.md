---
name: release-announcement
description: Announce a WireCat Desktop release on the wirecat.dev blog, in the Telegram group and on Discord. Use when a desktop version is about to be released or was just tagged, or when asked to write release notes, a release post or a community announcement.
---

Always say it is **WireCat Desktop** (the app), not a tool release. Model: the 0.3 post in
`content/blog/wirecat-desktop-0-3/` and cli-docs PR #508.

## What goes in

1. Desktop changes since the last tag: `git log --oneline --no-merges v<prev>..origin/main` in wirecat-desktop, and the
   PRs behind them. Check every claim against the commit: something added and removed before the release did not ship.
2. Anything that shipped earlier and was never announced: read the earlier posts in `content/blog/`, then the tool
   releases since the last post (`gh release list -R <repo>` for each repo in `tools.json`).
   Add what a user would notice.
3. Lead with the one or two changes that say what the release is for. Smaller fixes go in a list at the end.

## Order

1. Desktop: a `release: X.Y.Z` PR (package.json, src-tauri/Cargo.toml, the `wirecat-desktop` entry in Cargo.lock).
   After merge, `bin/tag-release` on main. The tag publishes the GitHub release.
2. Blog: draft the post while the release builds (`draft: true`). Merge with `draft: false` only after the GitHub
   release is published, then wait for the Deploy run and check that `/en`, `/ru` and `/es` post URLs return 200.
3. Telegram and Discord last, so every link works.

## Blog post

- `content/blog/wirecat-desktop-X-Y/index.md`, `index.ru.md`, `index.es.md`.
  Title `WireCat Desktop X.Y: <what it is for>`.
- Tags: `release-notes` plus one to three more (see the `blog-tags` skill).
- Images like 0.3: a 1600×900 JPG cover per language (~100 KB) and 3 to 4 WebP screenshots per language (under 60 KB).
  Take them from the desktop browser build with made-up data: `pnpm dev` in wirecat-desktop, then
  `?showcase&section=<page>` (the flags are listed in wirecat-desktop CLAUDE.md). Crop out the sidebar version label.
  Check `free -g` first and run one browser at a time.
- Voice: first person, plain words, no `;`, `—`, `–` or hype words. Name MAX only in the Russian post.
- End with how to get it, the GitHub release notes link, and Discord and GitHub issues for feedback.

## Telegram and Discord

Telegram in Russian to the WireCat Community group (`@wirecatdev`, chat id `-1004382826499`), Discord in English to
the announcements channel. Same shape:

1. A headline with an emoji: `🚀 WireCat Desktop X.Y`.
2. One or two sentences on what the release is for and who it helps.
3. 4 to 6 lines, each starting with an emoji, one change each, in the reader's words.
4. How to get it: the app offers the update itself, and the download link for new users.
5. The post link.
6. Engagement: a question to answer in the comments (which feature to do next, what they use most), and an invite to
   the Discord, the Telegram chat and a star on GitHub.

Show both texts to the owner before posting. Telegram goes out from the owner's account with
`tg personal messages send -1004382826499` (text on stdin). Discord goes out with
`bin/post-discord <file>` in cli-docs, which reads the webhook from the keyring.

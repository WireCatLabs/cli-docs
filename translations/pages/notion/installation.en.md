---
title: "Install"
---

Connect your Notion workspace once, and from then on your AI agent finds any page you wrote and answers with its
link. Notion keeps your pages in its cloud and lets a program in only with a token you make in Notion. Making the token,
installing `notion` and signing in take about five minutes.

When you finish, the agent on this computer searches the pages you chose and reads them as context, even without the
internet.

You can do it all in [WireCat Desktop](/en/docs/desktop), an app that installs the tools for you, or in a terminal
with npm. Either way you need one Notion token.

**On this page:**

1. [In short](#in-short)
2. [What you need](#what-you-need)
3. [Make a Notion token](#make-a-notion-token)
4. [In WireCat Desktop](#in-wirecat-desktop)
5. [In a terminal](#in-a-terminal)
6. [Sign in](#sign-in)
7. [Check that it works](#check-that-it-works)
8. [Sign out](#sign-out)

## In short

1. [Make the token](#make-a-notion-token) on Notion's side.
2. In WireCat Desktop: on the **Tools** page, click **Install** on the Notion row, then **Manage** and **Sign in here**,
   and paste the token.
3. Or in a terminal, install the tool, sign in with the token and copy your data:

```sh
npm install -g @wirecat/notion-cli
notion personal session start
notion personal sync
```

## What you need

- A Notion workspace where you are a full member, for a personal access token, or its owner, for an internal
  connection. Guests cannot make a token.
- For the terminal: Node.js 22.16 or a later 22.x, or Node.js 24 or later. Node 23 is not supported. WireCat Desktop
  sets up Node.js itself.

## Make a Notion token

Notion has two kinds of token. Make one of them.

**A personal access token** acts with your own rights and sees what you see
([Notion's guide](https://developers.notion.com/guides/connections-and-tokens/personal-access-tokens)):

1. Open [notion.so/developers/tokens](https://www.notion.so/developers/tokens) and click **New token**.
2. Give it a name, such as `WireCat`, and pick its expiration. If Notion asks for a workspace, pick yours.
3. Click **Create token** and copy it. Notion shows it only once.

On the Free plan only workspace owners can make one. On Business and Enterprise the owners decide who may, under
**Settings → Connections**.

**An internal connection's token** sees only the pages you share with that connection. Choose it to give the tool a
few pages and nothing else. Only a workspace owner can make one
([Notion's guide](https://developers.notion.com/guides/connections-and-tokens/internal-connections)):

1. Open the [developer portal](https://app.notion.com/developers/connections) and click **New connection**.
2. Name it, choose **API token** under **Authentication method**, and click **Create connection**.
3. On the **Configuration** tab, copy the **API token**. Turn on reading content, and "Read user information
   including email addresses" ([Notion's capabilities](https://developers.notion.com/reference/capabilities)). Without
   the user information, sync keeps a page's author by Notion id only and cannot match them to the people you know by
   email. Turn on updating and inserting content too if your agent may write to Notion.
4. Share the pages: on each top page in Notion, open the **•••** menu, choose **Connections**, then
   **+ Add connection**, and pick your connection. Its child pages come with it.

## In WireCat Desktop

1. On the **Tools** page, click **Install** on the Notion row.
2. Click **Manage**, type an account name, such as `personal`, and click **Sign in here**.
3. Paste the token. Then choose the pages and databases to copy. Until you choose one, the tool copies everything the
   token sees.

Desktop also gives your AI agents the tool's skill, so you can skip the rest of this page.

## In a terminal

Install `notion` once on each computer where you or an agent use it:

```sh
npm install -g @wirecat/notion-cli
notion --version
notion doctor
```

`doctor` needs no network and opens no keyring. It shows the version, where settings live, the profiles that exist,
and whether other users of the computer can read the settings.

Give your terminal agent the tool's skill, the short guide to its commands. An app that connects to MCP servers uses
the tool over MCP instead, as [use it](./usage.md#agents) shows.

```sh
notion skill install
```

## Sign in

A profile is a name you choose for one Notion account, such as `personal`. It is the first word of every command
that uses an account. Sign the profile in with your token:

```sh
notion personal session start
```

The command asks for the token without showing it, or reads it from stdin. Notion checks the token first. Then it goes
into the system keyring. Where no keyring works, add `--credential-storage file` to keep it in a private file.

## Check that it works

```sh
notion personal session status --check
notion personal sync
notion personal search "quarterly plan"
```

`session status --check` asks Notion whose token it is. `sync` copies the pages, and `search` finds them in the copy.
To copy only some pages, see [connect and copy your pages](./index.md#connect-and-copy-your-pages).

## Sign out

`notion personal session end` forgets the token on this computer. The token itself stays valid in Notion until you
delete it there, on the same page where you made it.

Next: [use it](./usage.md).

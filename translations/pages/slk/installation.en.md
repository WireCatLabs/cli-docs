---
title: "Install"
---

Connect your Slack workspace once, and from then on your AI agent reads and searches your channels, DMs and threads
as you. Slack lets a program read messages only through an app installed in the workspace, so you make a small app
for `slk` yourself. Making the app, installing `slk` and signing in take about ten minutes.

When you finish, the agent on this computer sees what you see in Slack, finds messages with Slack's own search and
sends only what you ask it to. You need the right to install apps in the workspace, or an admin who approves the app.

**On this page:**

1. [In short](#in-short)
2. [What you need](#what-you-need)
3. [Why an app of your own](#why-an-app-of-your-own)
4. [Make your own Slack app](#make-your-own-slack-app)
5. [Install the app and copy the token](#install-the-app-and-copy-the-token)
6. [Install slk](#install-slk)
7. [Sign in](#sign-in)
8. [Check that it works](#check-that-it-works)
9. [Sign out](#sign-out)

## In short

1. [Make the app](#make-your-own-slack-app) from a link that fills in its settings.
2. [Install it](#install-the-app-and-copy-the-token) in your workspace and copy the **User OAuth Token**.
3. Install the tool, then let `setup` ask for the token:

```sh
npm install -g @wirecat/slack-cli
slk personal setup
```

## What you need

- A Slack workspace where you may install apps. In some workspaces only an admin may. Then Slack lets you send a
  request, and you install the app once the admin approves it.
- Node.js 22.16 or a later 22.x, or Node.js 24 or later. Node 23 is not supported.

## Why an app of your own

Slack gives a program access to messages only through an app, and the app sets how fast the program may read.
Since May 2025 an app that another company publishes outside the Slack Marketplace may read
[one page of 15 messages a minute](https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps)
of a channel's history. An app made in your own workspace keeps the normal limits. It also belongs to you: nobody
else holds its token, and only you use it.

The app asks only for what the commands use: reading channels, DMs, people, files, reactions and pins, searching, and
sending as you.

## Make your own Slack app

1. Sign in to Slack in your browser, in the workspace `slk` should read: [slack.com/signin](https://slack.com/signin).
2. Open [Create the app in Slack](https://api.slack.com/apps?new_app=1&manifest_json=%7B%22_metadata%22%3A%7B%22major_version%22%3A2%2C%22minor_version%22%3A1%7D%2C%22display_information%22%3A%7B%22name%22%3A%22WireCat%20slk%22%2C%22description%22%3A%22Your%20own%20Slack%2C%20read%20and%20written%20as%20you%20by%20the%20slk%20CLI%20on%20your%20computer.%22%7D%2C%22oauth_config%22%3A%7B%22scopes%22%3A%7B%22user%22%3A%5B%22channels%3Ahistory%22%2C%22groups%3Ahistory%22%2C%22im%3Ahistory%22%2C%22mpim%3Ahistory%22%2C%22channels%3Aread%22%2C%22groups%3Aread%22%2C%22im%3Aread%22%2C%22mpim%3Aread%22%2C%22users%3Aread%22%2C%22users%3Aread.email%22%2C%22search%3Aread%22%2C%22reactions%3Aread%22%2C%22files%3Aread%22%2C%22pins%3Aread%22%2C%22usergroups%3Aread%22%2C%22chat%3Awrite%22%2C%22reactions%3Awrite%22%2C%22files%3Awrite%22%2C%22pins%3Awrite%22%2C%22channels%3Awrite%22%2C%22groups%3Awrite%22%2C%22im%3Awrite%22%2C%22mpim%3Awrite%22%5D%7D%7D%2C%22settings%22%3A%7B%22org_deploy_enabled%22%3Afalse%2C%22socket_mode_enabled%22%3Afalse%2C%22token_rotation_enabled%22%3Afalse%7D%7D).
   Slack opens **Create New App** with the settings of `slk` already filled in.
3. Choose your workspace in the list and click **Next** until you see **Create**, then click **Create**. You do not
   need to change anything on the way.
4. Slack opens the app's **Basic Information** page. Its Client ID, Client Secret, Signing Secret and Verification
   Token are not needed. The token you need comes in the next step.

If the link does not open the form, go to [api.slack.com/apps](https://api.slack.com/apps), click
**Create New App**, then **From a manifest**, and choose your workspace. Replace the text there with the
[manifest of slk](https://github.com/WireCatLabs/slack-cli/blob/main/docs/slack-app-manifest.json): on its page,
click **Copy raw file**, the button with two squares above the text, and paste.

## Install the app and copy the token

1. On the app's page, in the menu on the left, click **OAuth & Permissions**. If you lost the page, open
   [api.slack.com/apps](https://api.slack.com/apps) and click **WireCat slk**.
2. Click **Install to Workspace**. Slack may show your workspace's name in place of "Workspace". It lists what the
   app may do as you: read and send messages, see people and files. Click **Allow**.
3. You are back on **OAuth & Permissions**. Under **OAuth Tokens**, find **User OAuth Token**. It starts with
   `xoxp-`. Click **Copy**.

If Slack offers to send a request in place of installing, only an admin may install apps in this workspace. Send the
request. Once the admin approves it, open **OAuth & Permissions** again and click **Install to Workspace**.

Copy only the token that starts with `xoxp-`. A bot token (`xoxb-`) is refused, because a bot sees only the channels
it is added to, while `slk` reads as you.

## Install slk

Install `slk` once on each computer where you or an agent use it:

```sh
npm install -g @wirecat/slack-cli
slk --version
slk doctor
```

The command is `slk`, not `slack`: `slack` is the name of Slack's own developer CLI. `doctor` needs no network and
opens no keyring. It shows the version, where settings live, the profiles that exist, and whether other users of the
computer can read the settings.

Give your terminal agent the tool's skill, the short guide to its commands. An app that connects to MCP servers uses
the tool over MCP instead, as [use it](./usage.md#agents) shows.

```sh
slk skill install
```

## Sign in

A profile is a name you choose for one Slack workspace, such as `personal` or `work`. It is the first word of every
command that uses an account. Sign the profile in with the token:

```sh
slk personal setup
```

`setup` shows the same steps as this page one at a time, then asks for the token. `slk personal session start` asks
for it at once. Both read the token hidden or from stdin, never as an argument, so it does not end up in your shell
history. Slack checks the token first. Then it goes into the system keyring, or into a private file with
`--credential-storage file` where no keyring works.

## Check that it works

```sh
slk personal session status --check
slk personal chats list
slk personal inbox
```

`session status --check` asks Slack whose token it is. `chats list` shows the channels, DMs and group DMs you are in,
and `inbox` shows what is unread.

## Sign out

`slk personal session end` forgets the token on this computer. The token itself stays valid in Slack while the app is
installed. To revoke it, remove the app from the workspace.

Next: [use it](./usage.md).

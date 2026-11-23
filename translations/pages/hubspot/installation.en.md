---
title: "Install"
---

Connect your HubSpot account once, and from then on your AI agent tells you where every deal stands and what
changed, without you opening HubSpot. HubSpot lets a program in only with a key made in the account, a service key,
or the token of a private app you already have. Making the key, installing `hubspot` and signing in take about ten
minutes.

When you finish, the agent on this computer reads a copy of your deals, contacts and companies, even without the
internet, and changes deals only if you give the key the write scopes.

You can do it all in [WireCat Desktop](/en/docs/desktop), an app that installs the tools for you, or in a terminal
with npm. Either way a super admin, or a user with HubSpot's **Developer tools access** permission, makes the key
once.

**On this page:**

1. [In short](#in-short)
2. [Make a key](#make-a-key)
3. [In WireCat Desktop](#in-wirecat-desktop)
4. [In a terminal](#in-a-terminal)
5. [Sign in](#sign-in)
6. [Check that it works](#check-that-it-works)

## In short

1. [Make the key](#make-a-key) on HubSpot's side.
2. In WireCat Desktop: on the **Tools** page, click **Install** on the HubSpot row, then **Manage** and **Sign in here**,
   and paste the key.
3. Or in a terminal, install the tool, sign in with the key and copy your data:

```sh
npm install -g @wirecat/hubspot-cli
hubspot work session start
hubspot work sync
```

## Make a key

`hubspot` signs in with a key that belongs to one HubSpot account. A super admin, or a user with HubSpot's
**Developer tools access** permission, makes it once
([HubSpot's guide](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/account-service-keys)):

1. Open **Development**, then **Keys → Service keys** in the left menu. Some accounts show it under **Settings →
   Integrations → Service keys** instead.
2. Click **Create service key** and name it *WireCat*.
3. Click **Add new scope**, tick each scope in [the read scopes](#read-scopes), and click **Update**. A key gets only the scopes its
   maker has.
4. Click **Create** and confirm.
5. Click the key's name, then **Show** and **Copy**. The key starts with `pat-`.

HubSpot stopped new private apps on 26 October 2026
([HubSpot's notice](https://developers.hubspot.com/changelog/legacy-private-app-creation-sunset)). An existing private
app's access token still works: give the app the same scopes and copy the token from its **Auth** tab.

<a id="read-scopes" />

Give it these read scopes ([HubSpot's list of scopes](https://developers.hubspot.com/docs/apps/legacy-apps/authentication/scopes)):

| Scope | What it reads |
| --- | --- |
| `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.deals.read` | contacts, companies and deals |
| `crm.objects.owners.read` | the owners deals are assigned to |
| `crm.schemas.contacts.read`, `crm.schemas.companies.read`, `crm.schemas.deals.read` | the properties of each |
| `sales-email-read` | logged e-mails. Notes, calls, meetings and tasks need no scope of their own: the contacts scope reads them |
| `crm.objects.leads.read` | leads, on Sales Hub Professional or Enterprise only |
| `tickets` | tickets, through `api` only |

Writes are optional. Add these scopes only if `hubspot` may change records. Without them the key only reads:

| Scope | What it changes |
| --- | --- |
| `crm.objects.deals.write` | deals: create, update, move, close and delete |
| `crm.objects.contacts.write` | contacts. Notes, calls, meetings and tasks written through `api` may ask for their own scope: the error names it |
| `crm.objects.companies.write` | companies |

A scope you leave out fails only the commands that need it, with the scope named in the error.

## In WireCat Desktop

1. On the **Tools** page, click **Install** on the HubSpot row.
2. Click **Manage**, type an account name, such as `work`, and click **Sign in here**.
3. The window lists the scopes and where to click in HubSpot, the same steps as [make a key](#make-a-key). Paste the
   key when it asks. Desktop checks it with HubSpot before it saves it.

Desktop also gives your AI agents the tool's skill, so you can skip the rest of this page.

## In a terminal

Install `hubspot` once on each computer where you or an agent use it. You need Node.js 22.16 or a later 22.x, or 24 or
later. Node 23 is not supported.

```sh
npm install -g @wirecat/hubspot-cli
hubspot --version
hubspot skill install
hubspot doctor
```

`skill install` gives your terminal agent the tool's skill, the short guide to its commands. `doctor` needs no network
and opens no keyring. It shows the version, where settings live, the profiles that exist, and whether other users of
the computer can read the settings.

## Sign in

Pick a profile name for the account, such as `work`, and paste the key when asked:

```sh
hubspot work session start
```

The key is read hidden, or from stdin (`hubspot work session start < key.txt`), never as an argument. `hubspot` asks
HubSpot which account the key belongs to, and keeps the key with the account's id in the system keyring, or in a file
only you can read with `--credential-storage file`. A second profile on the same account is refused.

`hubspot work setup` asks the same questions step by step. WireCat Desktop shows the same steps: it draws them from
one JSON document the CLI prints, `hubspot work setup show --json`, in English, Spanish or Russian.

`WCHUBSPOT_TOKEN` in the environment takes the place of the saved key for every profile, as in CI. Set
`WCHUBSPOT_ACCOUNT` beside it to the account's id: `hubspot work session status --check` with the token alone prints it
as `account`. Every command that reaches HubSpot checks the id against the token first. A command that reads only the
local copy needs one such command, such as `sync`, to have run before. `api` does not learn the account's time zone
this way, so its spent daily allowance says to try again after a time in UTC, the earliest it can be back.

## Check that it works

```sh
hubspot work session status --check
hubspot work sync
```

`session status --check` asks HubSpot whether the key works and which account it reads. `sync` copies the deals,
contacts and companies.

Next: [use it](./usage.md).

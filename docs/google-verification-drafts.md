# Google app verification: texts to review

Drafts for the [owner's checklist](google-verification.md). The legal texts need the owner's review before they go on
the site. English first; the Russian and Spanish pages follow the approved English text.

Most of what Google asks for is already live on wirecat.dev. This page drafts only what is missing or out of date.

## Home page

[wirecat.dev](https://wirecat.dev/) already describes drive and gcal and links the privacy policy in its footer. Google
needs the home page to describe what the app does with Google
([branding](https://support.google.com/cloud/answer/15549049)). Add this block to the landing page, near the tool list,
in `lib/editorial/*.json`, if Gmail joins the shared app:

> **WireCat and your Google account**
>
> WireCat's tools run on your computer. When you connect a Google account, you choose it in Google's own window and
> approve each permission. drive copies the Google Drive folders you choose, so you can search them offline. gcal keeps
> a searchable copy of your Google Calendar and answers questions about free time. mail copies your Gmail so you can
> search it, and sends mail only when you ask. Your Google data stays on your computer and never goes to a WireCat
> server. Read [how WireCat uses Google data](/en/privacy#google-limited-use).

Without Gmail, drop the mail sentence.

## Privacy policy

[The privacy policy](https://wirecat.dev/en/privacy) already has a "Google API Limited Use" section
(`#google-limited-use`) and sections for Drive and Calendar. Two changes, in `lib/privacy.ts`, all three languages.

### 1. The Gmail sentence is out of date

mail-cli main (`5f645b0`, 2026-11-05) signs in to Gmail with WireCat's Google app by default. The policy still says
"WireCat has no Google app for mail". In `#mail-access`, first paragraph, replace:

> Gmail signs in with an app password you make, or with a Google app of your own; WireCat has no Google app for mail.
> The Google permission is Google's one mail permission, which reads, changes and sends your Gmail, plus your account's
> email address.

with:

> Gmail signs in with an app password you make, with WireCat's Google app, or with a Google app of your own. With a
> Google app, mail asks for Google's one permission for mail programs (`https://mail.google.com/`), which reads,
> changes and sends your Gmail, and for your account's email address, to check that you signed in to the right
> mailbox. Until Google has verified WireCat's app for Gmail, Google shows a warning that the app is not verified.

Then, in `#disconnect-delete`, replace "For Gmail with your own Google app, session end with --revoke" with "For Gmail
signed in with a Google app, session end with --revoke". Check first that `--revoke` works with WireCat's app too.

### 2. Name every tool in the Limited Use sentence

In `#sharing-ai`, first paragraph, replace "The use and transfer by WireCat Drive and gcal of information received from
Google APIs" with "The use and transfer by WireCat Drive, gcal and mail of information received from Google APIs".

Then add this paragraph after it. It states the four Limited Use rules in plain words
([Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)):

> In practice: WireCat's tools use Google data only to give you the features you see and ask for. They do not move it
> to anyone else, except to the AI provider or agent you chose, as described here, or when the law requires it. They do
> not use it for advertising, and do not sell it. Nobody at WireCat reads your Google data. The only exceptions are
> when you ask us to and send it to us yourself, for security reasons, or when the law requires it.

Update "Last updated" at the top of the page.

## Terms of service

[The terms](https://wirecat.dev/en/terms) need one change. In `#accounts`, second paragraph, after "Google access
requires your browser consent.", add:

> Gmail access through WireCat's Google app also needs your browser consent, and mail sends or changes mail only when
> you, or an agent you connected, give the command.

## Scope justifications

Paste one per scope in Verification Center. Each says why a narrower scope does not work, as Google requires
([requirements](https://support.google.com/cloud/answer/13464321)). Drop the ones you do not declare.

**Common opening** (paste before each one, or once in the app description):

> WireCat is a set of open-source command-line tools and a desktop app that run on the user's own computer. Each tool
> calls Google's API directly from that computer. Google data is stored only on the user's computer, in a local
> database. No Google data or token goes to a WireCat server. The user chooses the account in Google's own window.

**`https://www.googleapis.com/auth/drive.readonly`**

> drive keeps a local, searchable copy of the Google Drive folders the user chooses (backup and sync). After the user
> adds a folder, drive reads every file in it and in its subfolders, and finds files added later by anyone. `drive.file`
> does not work for this: it covers only files the user picks one by one or files the app created. Files that others
> add to a shared folder would never be synced. drive reads only the folders the user added.

**`https://www.googleapis.com/auth/drive`**

> Asked for only when the user signs in with `--grant write`. It lets the user create and change Google Docs and
> manage files from the command line, for example `documents update` on a document the user already has. `drive.file`
> does not work: it cannot change the user's existing documents. The default sign-in stays read-only. A change runs
> only when the user, or an agent the user connected, gives the command.

**`https://www.googleapis.com/auth/drive.activity.readonly`**

> Asked for only when the user signs in with `--grant activity`. `documents history --activity` shows who changed a
> synced document and when. No narrower scope gives Drive Activity events. The data stays on the user's computer.

**`https://www.googleapis.com/auth/drive.apps.readonly`**

> Asked for only when the user signs in with `--grant apps`. It lists the Drive apps the user installed, so the user
> can see which app opens a file type. No narrower scope gives this list.

**`https://www.googleapis.com/auth/calendar.readonly`**

> gcal keeps a local, searchable copy of the user's calendars and answers questions about free and busy time. It reads
> the calendar list, the events, and free/busy times. `calendar.events.readonly` does not work: it cannot list the
> user's calendars, and gcal needs the list to sync each one.

**`https://www.googleapis.com/auth/calendar.events`**

> Asked for only when the user signs in with `--grant write`. It lets the user create, change and delete events and
> answer invitations. `calendar.events.owned` does not cover events on calendars that others share with the user.
> A change runs only when the user, or an agent the user connected, gives the command.

Check before you submit: that `calendar.events.owned` really fails for these uses. Nobody has tested it.

**`https://www.googleapis.com/auth/calendar.acls`**

> Asked for only when the user signs in with `--grant sharing`. It lets the user see and change who can see a calendar
> the user owns. `calendar.acls.readonly` does not work: it cannot change sharing.

**`https://mail.google.com/`**

> mail is a local mail program. It copies the user's Gmail to the user's computer over IMAP, so the user can search it
> offline, and sends mail over SMTP when the user asks. Google gives IMAP and SMTP only this scope
> (https://developers.google.com/workspace/gmail/imap/xoauth2-protocol). `gmail.readonly`, `gmail.modify` and
> `gmail.send` work only with the Gmail API, not with IMAP and SMTP. Mail is sent or changed only when the user, or an
> agent the user connected, gives the command.

**Data flow note** (for the restricted scopes, and for any question about a security assessment):

> WireCat has no server that receives Google data. Tokens are kept in the operating system's keyring. One user-chosen
> exception: drive can send the text of a document the user picks to an AI provider the user configured, with the
> user's own key, to extract notes. This runs only when the user gives that command.

## Demo video script

One video, about 5 minutes, unlisted on YouTube, in English
([demo video rules](https://support.google.com/cloud/answer/13804565)). Use a test Google account with sample files,
events and mail. Never show a token, the client secret or real data. Narrate each step in one short sentence.

1. **Intro (15 s).** Say: "WireCat is a set of command-line tools that run on this computer. They keep a local copy of
   Google Drive folders, Google Calendar and Gmail. No data goes to a WireCat server."
2. **drive sign-in.** Run `drive demo session start --grant write,activity,apps`. The browser opens. Show the address
   bar with the client ID. Show the account chooser.
3. **Consent screen.** Show the app name `WireCat`, the language set to English (bottom left), and the full list of
   permissions. Scroll if needed. Approve.
4. **`drive.readonly`.** Run `drive demo folders add <folder URL>`, then `drive demo sync`. Add a new file to the folder
   in the Drive web page, run `drive demo sync` again, and show that the new file arrived. Say: "This is why drive needs
   to read the whole folder, not only picked files." Run `drive demo search 'budget'`.
5. **`drive`.** Run `drive demo documents create --title "Demo notes"`, then a `documents update` on an existing
   document. Show both in Google Docs.
6. **`drive.activity.readonly`.** Run `drive demo documents history <doc> --activity`.
7. **`drive.apps.readonly`.** Run `drive demo api drive-apps-list`.
8. **gcal sign-in.** Run `gcal demo session start --grant write,sharing`. Show the consent screen with the three
   Calendar permissions. Approve.
9. **`calendar.readonly`.** Run `gcal demo sync`, then `gcal demo search events planning`.
10. **`calendar.events`.** Run `gcal demo events create ...`. Show the new event in Google Calendar.
11. **`calendar.acls`.** Run `gcal demo api call calendar.acl.list --params '{"calendarId":"primary"}'`.
12. **mail sign-in** (only if Gmail is declared). Run `mail gm config set auth oauth`, then
    `mail gm session start --address <test address>`. Show the consent screen with the Gmail permission. Approve.
13. **`https://mail.google.com/`.** Run `mail gm sync`, then `mail gm search messages invoice`. Send a message to the
    same test address with `messages send`, and show it in Gmail.
14. **Where data lives (20 s).** Run `drive demo status`. Say: "The copies are in a local database on this computer."
15. **Sign out.** Run `drive demo session end`, `gcal demo session end` and `mail gm session end`. Open
    myaccount.google.com/permissions and show how to remove WireCat.

Check every command against the current release before recording. The command names come from the repositories'
README and command pages at the commits named in the checklist.

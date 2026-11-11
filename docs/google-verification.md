# Google app verification: the owner's checklist

WireCat's tools sign in to Google with one shared Desktop app in Google Cloud project `240274586781`. Google shows an
"unverified app" page and allows only 100 users until the app is verified
([Manage App Audience](https://support.google.com/cloud/answer/15549945)). This page lists every step, in order.

Only the owner can do the steps marked **Owner**. Steps marked **Ready** are done by the pages on wirecat.dev or by the
texts in [google-verification-drafts.md](google-verification-drafts.md). Agents never sign in to Google Cloud.

Source: drive-cli `6171e55`, gcal-cli `38228b8`, mail-cli `1464f63` (origin/main, 2026-11-05).

## The scopes the tools ask for

| Tool | Scope | When | Google's class | Narrower option and its cost |
| --- | --- | --- | --- | --- |
| drive | `drive.readonly` | Every sign-in | Restricted | `drive.file` (non-sensitive) sees only files the user picks or the app made. Folder sync and new files in a folder stop working. |
| drive | `drive` | `--grant write` | Restricted | `drive.file` can create files but cannot edit the user's own documents. Or offer write only with the user's own app. |
| drive | `drive.activity.readonly` | `--grant activity` | Restricted | None. Drop the history feature from the shared app. |
| drive | `drive.apps.readonly` | `--grant apps` | Sensitive | None. Drop it: few users need the list of installed Drive apps. |
| gcal | `calendar.readonly` | Every sign-in | Sensitive | `calendar.events.readonly` cannot list calendars. No class gain: both are sensitive. |
| gcal | `calendar.events` | `--grant write` | Sensitive | `calendar.events.owned` covers only calendars the user owns. Not checked whether answering invitations still works. |
| gcal | `calendar.acls` | `--grant sharing` | Sensitive (from the Console) | None for changes. |
| mail | `https://mail.google.com/` | Gmail sign-in with WireCat's app | Restricted | None. IMAP and SMTP accept only this scope. `gmail.readonly` needs the Gmail API, a rewrite, and is restricted too. |
| all | `openid`, `email` | gcal and mail sign-in | Non-sensitive | Not needed. |

Sources: [Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth),
[Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes),
[Gmail IMAP and SMTP scope](https://developers.google.com/workspace/gmail/imap/xoauth2-protocol), and
[sensitive scopes](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification),
which names "reading events stored in Google Calendar" as sensitive. Google's
[Calendar scopes page](https://developers.google.com/workspace/calendar/api/auth) gives no class. Check the class of
each Calendar scope in the Console's **Data Access** list before you submit.

No narrower scope keeps Drive folder sync or Gmail working. So the app needs restricted-scope review either way.
Only dropping Drive and Gmail from the shared app would leave a sensitive-only review (Calendar).

## Steps

### 1. Decide the scope set (Owner)

Choose which scopes the shared app declares. Every scope a tool can ask for must be declared. A scope you do not declare
shows the "unverified app" page when a tool asks for it. See the decisions at the end of this page.

### 2. Check the site pages (Ready, after the drafts are merged)

Google needs a home page and a privacy policy on a domain you own
([verification requirements](https://support.google.com/cloud/answer/13464321)):

- The home page describes the app, is not only a sign-in page, and links the privacy policy.
- The privacy policy is on the same domain, is linked from the home page, and says how the app accesses, uses, stores
  and shares Google user data.

wirecat.dev has these pages now: [home](https://wirecat.dev/), [privacy](https://wirecat.dev/en/privacy) and
[terms](https://wirecat.dev/en/terms). The privacy policy has a Limited Use section. Two gaps remain, both in the drafts:
the Gmail sentence is out of date, and the home page does not name Gmail.

Open all three pages in a signed-out browser before you submit.

### 3. Verify the domain in Search Console (Owner)

1. Open [Search Console](https://search.google.com/search-console) with a Google account that is an Owner or Editor of
   the Cloud project.
2. Add a **Domain** property for `wirecat.dev`.
3. Add the TXT record Google gives you at wirecat.dev's DNS (Cloudflare). Keep the record after verification.
4. Press **Verify**.

Skip this if `wirecat.dev` already shows as verified for this account. Google's steps:
[verify site ownership](https://support.google.com/webmasters/answer/9008080).

### 4. Fill in Branding (Owner, values Ready)

Open [Google Auth Platform → Branding](https://console.cloud.google.com/auth/branding)
([field help](https://support.google.com/cloud/answer/15549049)).

| Field | Value |
| --- | --- |
| App name | `WireCat` (see decision 3) |
| User support email | `hello@wirecat.dev`, only if it is a Google account or a Google Group you manage. Otherwise an address you read. |
| App logo | The WireCat logo, 120×120 px. A new logo starts a new brand review. |
| Application home page | `https://wirecat.dev/` |
| Privacy policy | `https://wirecat.dev/en/privacy` |
| Terms of service | `https://wirecat.dev/en/terms` |
| Authorized domains | `wirecat.dev` (domain only, no `https://`) |
| Developer contact email | An address you read. Google sends review mail there. |

Press **Verify branding**, then publish it. A passed brand check is valid for 7 days
([restricted-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)).

### 5. Enable the APIs (Owner)

In **APIs & Services → Library**, enable Google Drive API, Google Docs API, Google Sheets API, Google Drive Activity API
and Google Calendar API. For Gmail, also enable Gmail API if a sign-in works but mail then fails (mail-cli's
`docs/oauth-google.md` notes Google does not say if IMAP needs it).

### 6. Declare the scopes (Owner)

Open **Data Access → Add or remove scopes**. Add the scopes from step 1. Add `https://mail.google.com/` by hand in the
manual entry field. Save.

### 7. Record the demo video (Owner, script Ready)

Follow the script in [the drafts](google-verification-drafts.md#demo-video-script). Google's rules
([demo video](https://support.google.com/cloud/answer/13804565)):

- Show the whole flow, with the OAuth grant.
- Show the full consent screen, with the exact scopes you declared.
- Set the consent screen's language (bottom left) to English.
- Show the app name, and the OAuth client ID in the browser's address bar.
- Show how the app uses each sensitive and restricted scope.
- Upload to YouTube as **Unlisted**.

The address bar shows the client ID. Google asks for that. A Desktop client ID is not a secret, but do not show the
client secret, a token, or real private data. Use a test Google account with sample files, events and mail.

### 8. Submit in Verification Center (Owner, texts Ready)

Open **Verification Center**. For each scope, paste its justification from
[the drafts](google-verification-drafts.md#scope-justifications). Google rejects a justification that does not say
why a narrower scope does not work ([requirements](https://support.google.com/cloud/answer/13464321)).

For Drive, choose the permitted app type **Backup and sync** (local sync of Drive files)
([Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)). Add up to three
documentation links: [drive](https://wirecat.dev/en/docs/drive), [gcal](https://wirecat.dev/en/docs/gcal) and the
mail Gmail page.

Sensitive scopes take up to 10 days
([sensitive scopes](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification)).
Restricted scopes can take several weeks.

### 9. Security assessment (CASA), only if Google asks (Owner)

Google's pages disagree here:

- The restricted-scope page says an app that stores or sends restricted data on servers needs an assessment
  ([restricted-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)).
  The Drive and Gmail scope pages say the same.
- The security assessment page says every app with restricted scopes needs one every year
  ([Security Assessment](https://support.google.com/cloud/answer/13465431)).

WireCat stores Google data only on the user's computer, so it may be exempt. Only Google's reviewer decides. State the
data flow plainly in the submission. The exceptions to "only on the computer" are four AI features. Each is off until
the user turns it on, and each sends text to the AI provider the user chose, with the user's own key:

| Feature | Command | What it sends | Source |
| --- | --- | --- | --- |
| Search enrichment | `memo models consents set <provider> --yes`, or the Desktop switch | The text of every note, document and email in the store, then each new one at sync | cli-core `src/cli/enrichment-consents-command.ts` |
| Search harder | `memo search all --harder`, or the Desktop button, after `memo models search-consents set` | The question and its first 30 hits | memo `docs/commands.md` |
| Memory extraction | `drive <profile> memories extract` | One document the user names, after a preview | drive `docs/configuration.md` |
| Analysed answers | `memo answers create --analyze --allow-remote` | The sources of one answer | memo `docs/security.md` |

Documents from Drive and mail from Gmail are in the store, so all four can carry Google data. Name each in the
submission and on the privacy page ([drafts](google-verification-drafts.md#data-flow-note)). Google allows a transfer
that powers a feature the user sees and asked for
([User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)). Checked against the main
branches on 2026-11-11.

If Google asks for an assessment: it is done by a lab Google approves ([CASA](https://appdefensealliance.dev/casa)) and
repeats at least every 12 months. Google's pages give no price. Web search results quote TAC Security plans from $540 to
$855 per app. Those figures disagree with each other, and TAC's price page did not open for us, so ask the lab
([TAC CASA](https://tacsecurity.com/google-casa-cloud-application-security-assessment/)).

### 10. Answer Google's mail (Owner)

Google's Trust and Safety team writes to the developer contact. Answer each request. Questions about the data flow can
be answered from the privacy policy.

### 11. Publishing status (Owner)

Keep **Audience → Publishing status** at **In production**. In Testing, refresh tokens expire after 7 days
([token expiration](https://developers.google.com/identity/protocols/oauth2#expiration)). Production status is not
approval: the "unverified app" page stays until Google approves the scopes.

### 12. After approval (Owner, then agents)

1. Sign in with a Google account that was never a test user. Check that no "unverified app" page shows.
2. Tell the agents. They remove the "unverified app" notes from the drive, gcal and mail docs.
3. Put a yearly reminder in the calendar if Google required an assessment.

## Decisions for the owner

Answered on 2026-11-11 (journals: cli-private `2026-11-05-google-verification.md` NEED-2220 to NEED-2222, product
`2026-11-11-product-repo.md` NEED-6, NEED-8 to NEED-11):

1. **Gmail in the same review:** yes. Declare `https://mail.google.com/` now.
2. **CASA budget:** submit with the plain data flow. Pay a lab only if Google asks.
3. **App name:** `WireCat`, home page `https://wirecat.dev/`.
4. **Optional Drive grants:** keep `drive`, `drive.activity.readonly` and `drive.apps.readonly` in the shared app.
5. **Calendar:** stays in the same app as Drive and Gmail, so gcal waits for the whole review.
6. **AI features with Google data:** keep all four as they are, and disclose each in the submission and on the privacy
   page. If Google objects, send Gmail and Drive records only to a local model.
7. **Support email.** Open: confirm `hello@wirecat.dev` can be selected in Branding, or name another address.

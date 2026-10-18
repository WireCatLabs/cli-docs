---
title: "Historial de cambios"
---

Cambios destacados de `@wirecat/cli-memo`, con una sección por versión, de la más reciente a la más
antigua. Se utiliza [versionado semántico](https://semver.org/); antes de `1.0.0`, una versión menor puede cambiar
la API.

Las notas técnicas exactas de las nuevas versiones se conservan en inglés; las instrucciones de uso están traducidas en sus guías.

## Unreleased

## 0.65.2 — 18.10.2026

### Changed — may break scripts

- **memo's MCP tools name accounts as the CLI does.** `actions_add` takes `account` as `provider:account`
  (`telegram:1`) in place of `provider` and a bare `account`; `search_mail` takes `source` (`email:work`, several
  separated by commas) in place of `account`; `person_context` takes `source` (`telegram:1`) in place of `account`.
  An old argument is refused, as any argument a tool does not take.

## 0.65.1 — 18.10.2026

### Documentation

- The command reference lists `--plain-order` on `memo search mail` and `memo search all`; 0.65.0 shipped it
  without, as the reference had not been generated again.
- The command reference's opening says reads take `--source` and writes take `--account provider:account`; it
  still named `--provider` and `--account`.

## 0.65.0 — 18.10.2026

### Fixed

- **A sync step that fails unexpectedly says why.** The timer's log showed only "the command failed; this is a bug";
  it now adds the error's first line, such as `TypeError: fetch failed`, so a dropped network can be told from a
  real fault. `--debug` still shows the whole message.
- **`memo search mail` fills a page past mail it moves down.** It reads 20 more results than asked, so mail from
  senders with signs of fraud gives its place to the next best result instead of only moving to the end.

## 0.64.0 — 18.10.2026

### Changed — may change search results

- **Mail from senders with signs of fraud comes after the rest of the page** in `memo search mail` and
  `memo search all`: a sender whose fraud signals add up to 3 or more, such as a brand name from another domain or a
  domain under 180 days old. Your own are never moved: a domain you wrote to anyone at, your mailbox's domain, a
  sender a protect rule keeps. `--plain-order` keeps the plain order, to find such mail. The sync log says how many
  senders are ranked lower.

### Changed

- **A read names its accounts with `--source`**, as `memo mentions` and `memo search mail` already do:
  `provider:account` (`telegram:1`, `email:personal`), a provider, a kind or `group:<name>`. `memo tasks list`,
  `memo reminders list`, `memo tags list` and `memo ask` read every account named and say which in
  `meta.accounts`. A read bound to one account (`tasks agenda|show`, `stats tasks show`, `relationships suggest`,
  `context`, `meetings actions list|show`, `projects meetings list`) takes a `--source` that names exactly one.
  `memo sync --source email:work,email:personal` names mailboxes.
- **A write names the one account it acts as with `--account provider:account`**: `memo tasks add|close|plan|link`,
  `memo reminders add|poll|ack|cancel|update`, `memo tags add|remove`, `memo notes add --meeting`,
  `memo actions add`, `memo meetings actions add|confirm|reject`, `memo projects meetings link`. A bare
  `--account 1` without `--provider` is refused. No account, or one that names several, is an error listing the
  choices.

### Deprecated

- `--provider` with a bare `--account` keeps working for one release and prints the new spelling on stderr:
  `--source telegram:1` on a read, `--account telegram:1` on a write. Giving both spellings is an error.
  `memo context --account 1` is `--source telegram:1`; `memo sync --account work` is `--source email:work`.

### Changed — may break scripts

- The `search all` step that lists a hit's tasks carries `args.source` (`telegram:1`) instead of `args.provider`
  and `args.account`; `meetings actions list` and `projects meetings list` name `source` in their page args too.
- `memo ask` takes `--source notes` where it took `--provider notes`.

## 0.63.0 — 17.10.2026

### Changed — may change scores and rules

- **A new domain counts most, and a failed DMARC check only beside another sign of fraud.** `young_domain` adds 5
  (was 3); `dmarc_fail` counts only with `brand_spoof`, `young_domain` or `disposable_domain`, since alone it
  more often marks a real sender's broken setup or a forwarded mail; `reply_to_elsewhere` adds 1 (was 2), as many
  companies answer from a help-desk domain. A `score:` rule can match other senders than before. Every sender is
  scored again on the next sync.
- **Each sync's sender scoring looks up the domain ages it lacks**, for senders you never wrote to and heard from in
  the last two years, so `young_domain` works without running `memo mail inspect --domain-age`. Each lookup tells
  that domain's registry its name.

### Fixed

- **A domain registered again after an email came no longer makes that email's sender young.** The registry gives
  the newest registration, so an old sender whose domain lapsed and was taken by someone else looked new.

## 0.62.0 — 17.10.2026

### Changed

- **cli-core 0.323.0.** An address keeps its city in its value, so the same street in two cities is two places; a
  word of a contact's name counts alone only as a first name or a surname, so a contact named like a company no
  longer turns ordinary words into names; the owner's own accounts belong to the owner. After the upgrade,
  `tg <profile> mentions rebuild person-name place` reads the old texts again.
- memo reads `--source` lists and mention queries through cli-core instead of its own copies.

## 0.61.0 — 17.10.2026

The same code as 0.60.0, published again under a new number. Nothing changed for callers.

## 0.60.0 — 17.10.2026

### Fixed

- **The sync timer no longer stops when a sync takes longer than its interval.** The interval counted from when a
  sync started, so a 6-minute sync on a 5-minute timer left no next run. It now counts from when a sync ends.
  The first sync after updating rewrites the timer.
- **`memo tasks show HRB-12` shows a project's task without `--provider` and `--account`** (cli-core 0.320.0),
  with its evidence links — a task made from reviewed meeting findings, for example. A task of a messenger account
  still needs its account; a bare number is never taken for a project task.
- **memo's MCP tools refuse an argument they do not take**, as every other CLI's tools do: all 22 answer
  `validation_error` (reason `input.invalid`, `param` naming the argument) instead of dropping it, so a misspelled
  filter no longer runs unfiltered. Their advertised input schemas now say `additionalProperties: false`.
- **`memo mcp` is listed as `lifetime: "persistent"`** in `memo commands --json`, like `tg mcp` and `max mcp`: it
  serves until stdin closes. No other command's entry changes.

### Documentation

- **How to read a sender score** in the mail guide: which signals point at a forged sender and which bills share
  with newsletters, and why a platform passing on other names is not a spoof.

### Changed — may break scripts

- **cli-core 0.320.0, the version tg and max pin.** `tasks plan --assignee` names who does a task. Tasks open
  only for questions asked of the owner: every unanswered one in a one-to-one chat, in a group only a reply to the
  owner or a mention.
- **`memo mentions` names what it reads with `--source`, as every WireCat tool does.** `memo mentions list kind:phone
  --source email:personal,email:work`; `--source mail` reads every mailbox and the answer lists them in
  `meta.accounts`; `notes`, `documents` and `group:<name>` work too. The kind argument (`email`, `note`, `document`)
  and `--account` are gone: `memo mentions list email --account personal` is now `--source email:personal`.
  `show`, `confirm` and `reject` take `--source email:<account>` for a mail mention.

### Deprecated

- **`memo search mail --account <account>` is now `--source email:<account>`**, which also takes several mailboxes
  and groups. `--account` still works in this version and prints the new spelling.

## 0.59.0 — 17.10.2026

### Added

- **Mail stored before memo kept Reply-To and Gmail's SPF, DKIM and DMARC verdicts gets them.** Each sync reads
  the header lines of up to 2,000 such emails from Gmail, newest first, until none is left; the text is not read
  again. The sender score then sees these signals on all mail: on the owner's mailbox 57,000 of 92,000 emails
  stored in full had none.

## 0.58.0 — 17.10.2026

### Added

- `memo meetings actions` stages cited meeting facts and project tasks for owner review. Confirmation creates selected records atomically, keeps review receipts and prevents exact retries from duplicating accepted work. Missing dates and assignees stay unknown; stale evidence is refused.
- **Every sender gets its spam score in the store, and search shows it.** Each sync scores the account's senders
  from the stored mail, at most once a day, as `memo mail inspect` scores a group; a hit from a scored sender
  carries `sender_score` (score and signals) in `--json`. Results are not reordered by it. On the owner's mailbox:
  5,789 senders in 15 seconds. cli-core 0.311.0 (store version 19).
- **`memo mentions list|show|confirm|reject`: phones, e-mail addresses, links, documents, names and street addresses in
  documents, notes and mail.** `memo mentions list note kind:phone`; mail is read only from the accounts named by
  `--account` (repeatable), never every mailbox by default. `show` names the senders of received mail that may own a
  phone or an address (`candidates`), offered and never linked.

## 0.57.0 — 17.10.2026

### Fixed

- **The sender score counts a failed DMARC check only on mail from 2022 on.** Before that, senders often published a
  policy their own mail did not meet yet; on the owner's mailbox every failure was from 2018 to March 2021, all from
  real senders. Senders at 3 or more on the strong signals: 20 → 2, both look-alike domains.
- **A broken config file is reported in one line** (cli-core 0.304.0, 0.307.0): the first bad key, a fixed reason
  and a count of the rest, never a value — `config.json: updateCheck is an unknown setting; rename it to
  update_check (and 1 more problem)`. An old camelCase key is named with its new name first.
- **`memo mail status` finishes on a large mailbox** (cli-core 0.307.0): the per-folder count read every email
  again for each one, minutes on a few hundred thousand emails; now seconds.

### Changed — may break scripts

- **The daily "a newer memo exists" line now comes from cli-core, shared with tg and max, and is quieter.** It
  needs stdout to be a terminal as well as stderr: `memo … | less` no longer shows it. Any quiet option written
  with `=` silences it (`--help=…`, `--quiet=…`), not only `--json=…`. `MEMO_AUTO` with any value silences it, not
  only `1`. `--json`, `--jsonl` and `--quiet` silence it anywhere in the command, also after `--`. `--jsonl` is new
  among them.
- cli-core 0.307.0.

## 0.56.0 — 17.10.2026

### Fixed

- **The sender score in `memo mail inspect` no longer flags LinkedIn, Coursera, Quora or Dropbox Sign as brand
  spoofs, nor senders whose DMARC failed only because they signed for another domain.** "Google via LinkedIn" from
  LinkedIn's own domain is LinkedIn passing a page on; Coursera and Quora name courses and spaces after companies;
  hellosign, dropboxmail, onedrive and microsoftadvertising are the brands' own domains. A DMARC failure counts only
  without a valid DKIM signature, and not for a sender that passes DMARC on other mail. On the owner's mailbox the
  senders at 3 or more on these signals went from 71 to 20.

### Documentation

- Distinguish read-only imports from explicit Gmail cleanup and restore throughout the guides and README.

## 0.55.0 — 17.10.2026

### Fixed

- **Import, `memo mail inspect` and `memo mail rules apply` find Gmail's All Mail by its role**, as cleanup already
  did: Gmail names it in the account's language (`[Gmail]/Todos` in Spanish), so an account not in English failed
  with a missing folder. A `folders` list in the config still wins.

## 0.54.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note's source in the query: `'budget source:internal'`, not `--type internal`.**
  `source:file` keeps the notes from folders. `--type` is gone, with no alias. The field is named `source:` as in
  `memo notes list` and the note's `source` in `--json`. It works under OR and NOT and in `--filter` too. The
  `--source notes:<folder id>` option still chooses which folders are read. 0.53.0 on npm still has `--type`: it was
  published before this change.
- cli-core 0.303.0.

### Fixed

- **`bin/release` restarts itself once when the release brings a newer `bin/release`**: folding the changelog and
  raising the version both fast-forward `main`, and the shell went on reading the old script from the byte it had
  reached, so the rest of the run was a mix of old and new text. It now starts the new script over with the same
  arguments; a second change during that run stops it with `run it again`. The restart also works when
  `bin/release` was started from another folder by a relative path. Only the repository's own release is affected;
  the published package does not change.

## 0.53.0 — 16.10.2026

### Changed — may break scripts

- **`memo search notes` takes the note type in the query: `'budget type:internal'`, not `--type internal`.**
  `type:file` keeps the notes from folders. `--type` is gone, with no alias. The field works under OR and NOT and
  in `--filter` too.
- cli-core 0.302.0.

### Fixed

- **`memo mail restore` counts the mail it brings back in the store again.** It left the mail marked deleted, so the
  next `memo mail trash` could not see it and picked other mail, and a new protect rule did not apply to it. Restore
  now also counts again a run's mail found back in All Mail, so a run restored by an older memo or by hand in Gmail
  is set right by running restore once more.
- cli-core 0.301.0.

## 0.52.1 — 16.10.2026

### Changed

- **memo starts about a fifth faster after its first run.** It keeps Node's compiled code in a cache, in the
  system's temporary folder (`NODE_COMPILE_CACHE` moves it): `memo --help` went from about 0.70 to 0.54 seconds.
- cli-core 0.299.0.

## 0.52.0 — 16.10.2026

### Added

- **`memo mail trash --since-time <time>` leaves older mail in Gmail, whatever its rule says.** For keeping old
  years while newer junk is cleaned up; such mail is counted as kept `before_since`, and JSON adds `since`.

## 0.51.0 — 16.10.2026

### Fixed

- **`memo mail trash` and `restore` find Gmail's Trash by its role, not its English name.** Gmail names folders in
  the account's language, so in UK English Trash is `[Gmail]/Bin`; every move to `[Gmail]/Trash` failed and nothing
  moved. memo now asks Gmail which folders are All Mail and Trash (RFC 6154 `\All`, `\Trash`).
- **A missing folder is reported as missing, not as Gmail throttling.** Gmail adds `[THROTTLED]` to answers that
  fail for other reasons (`NO [NONEXISTENT] Unknown Mailbox … [THROTTLED]`), so memo said "try again in an hour"
  for a folder that does not exist.

## 0.50.0 — 16.10.2026

### Fixed

- **`memo mail trash` decides from the store and asks Gmail only about the emails it moves.** It re-read every
  header in All Mail first (about 260k emails), which took minutes and twice ran the account into Gmail's IMAP
  throttle before one email moved. Rules and replied-to senders now come from the store (cli-core
  `mail.emailFacts`); the picked emails' labels and stars are read again just before the move, and a batch is
  checked with one `UID SEARCH` instead of one lookup per email.
- **`memo mail restore` brings back a batch Gmail moved without confirming it.** It restored only batches whose
  move was answered OK; a move Gmail made but answered with a throttle could not be undone by memo.

## 0.49.0 — 16.10.2026

### Added

- **`memo messages show` gives each attachment's extracted text**, next to the name the email lists, so a bill's
  amount reads in one call. Each text is cut at the first 4,000 characters; `--full` gives the whole of it. JSON
  adds `text`, `text_chars` and `text_cut` to each attachment, or `extraction` (why there is no text: a scan
  `needs-agent`, `unsupported`, …).

### Fixed

- **`memo search mail` with `mailbox:` or `NOT mailbox:bulk` answers in under a second**: on a 257k-email store
  `London NOT mailbox:bulk` took 67 s and failed with `query.too-large` (cli-core 0.295.0).
- **An email address works unquoted**: `from:alice@example.com`, `to:` and `cc:` failed with
  `query.unsupported-operator`; cli-base 0.40.0 reads `user@host.tld` as one word.

## 0.48.0 — 16.10.2026

### Added

- **`memo mail trash <account>` moves envelope mail to Gmail's Trash**, after deciding each email again with today's
  rules and labels. It keeps mail a protected or keep rule matches, mail from senders you replied to, starred,
  important, sent and labelled mail, and mail under 30 days old. A preview unless `--yes`; a first run moves at most
  100, later runs 5,000; `--yes` needs a store backup under 8 days old (`backups/last.json` beside the store). Every
  moved email's labels go to a restore log first. **`memo mail restore <account> --run <id>`** moves a run back
  within Gmail's 30 days, and **`memo mail runs <account>`** lists runs. `memo doctor` shows the backup, whether a
  Takeout mbox is imported, and runs that stopped or are close to their 30 days.

### Fixed

- **Release scripts report observed lock holders separately from stale release labels.** Shared
  diagnostics no longer attribute a live lock to a previous run; wait for the holders to finish, then
  retry.

## 0.47.0 — 16.10.2026

### Added

- **`memo search mail` finds a letter by its whole link and by a part of a link**, also a tracking link that mail
  keeps only as its site: `url:"https://news.example.com/click?id=1"`, `link:"/click?id=1"`. Quote both: `?`, `/`
  and `=` mean something else in a query. cli-core 0.294.0.

## 0.46.0 — 16.10.2026

### Changed

- **`memo mail probe` is now `memo mail inspect`.** Same command and output; `inspect` is the shared word for
  looking at a source before taking anything from it, as `tg chats inspect` looks at a link before joining.
- **`memo search notes` names folders with `--source`, as `tg search notes` does.** `--source notes:<folder id>`
  (the id a hit shows), `notes:internal` for notes written in Memo, comma-separated for more. `--folder` is gone,
  and a folder path is no longer accepted: use its id from `memo folders list`. An entry naming no notes account
  is reported on stderr and the rest is still searched.
- **`memo search memories` narrows by scope in the query: `memo search memories friday scope:work`.** `--scope` is
  gone. The query is words and at most one `scope:`, joined by AND; `OR`, `NOT` and other fields are refused
  rather than filtered after the search. The MCP `search memories` tool lost its `scope` argument the same way.

### Fixed

- **A failed mail listing says why.** himalaya 2.2 prints its error on stdout, so memo reported "no error text"; the
  failed line now carries himalaya's `Error:` report, and a `[THROTTLED]` in it is `mail.throttled`.
- **A read that fails once is tried again** after 15 s (`MEMO_HIMALAYA_RETRY_MS`); IMAP commands that write are never
  repeated.

## 0.45.0 — 16.10.2026

### Corregido

- **The `memo auto` timer follows only a global install of memo.** A memo run from another tool's own
  `node_modules` (a docs build, a test tool) used to point the timer at that folder, and once the folder was
  deleted every timer run failed with `MODULE_NOT_FOUND`. A checkout and `npx` were already ignored.

## 0.44.0 — 15.10.2026

### Corregido

- **`memo sync --retry-attachments` reads again only the emails it has to.** It finds the stored emails whose
  attachment a missing reader left unread (`engine-missing`), looks them up by Gmail id and reads those, up to
  `--limit`. Before, it listed the whole window and re-read its newest `--limit` emails, so older unread
  attachments were never reached. `--json` reports `retried: {emails, extracted, still_failed, missing}`. Mail
  read from an mbox file or plain IMAP has no Gmail id, so the flag refuses there.
- cli-core 0.293.0 and cli-base 0.35.0.

## 0.43.0 — 15.10.2026

### Cambiado

- **`--json=<field>` is checked on memo's own lists too.** `tags list`, `vocabulary list`, `actions list`,
  `agents log`, `projects meetings list` and `folders list` refuse a field their rows lack
  (`output.unknown-field`, with the fields they have) instead of printing empty rows; known fields project as
  before.
- cli-core 0.292.0.

## 0.42.0 — 15.10.2026

### Documentación

- Correct the Takeout resume guidance: completed, unchanged snapshots are skipped; incomplete imports scan again. Replace the retired `tasks.id` search projection example with supported compact hit fields.

### Añadido

- **Mail rules match more than the sender.** `memo mail rules add|remove --filter <query>` takes `subject:<word>`
  (or bare words), `older:<n>d`, `larger:<size>`, `has:attachment`, `label:<name>`, `is:unread`, `is:bulk` and
  `score:<n>`; `--kind social|newsletters|developer|shopping|alerts` matches a built-in kind of mail. Every
  condition given must hold. `memo mail probe` ends with how much mail each kind would match.
- **`--do protect`** keeps mail whole and out of every cleanup, whatever else matches; `memo mail rules list
  --filter is:protected` lists those rules, and protected rules list first as `PROTECTED`. `rules apply` reports
  `protected_kept`.
- **`--do <action>,tag:<name>`** tags the mail a rule matches; a sync tags what it stores, `rules apply` tags what
  is stored (`tagged`).
- **`memo mail rules import-filters <account> <Filters.json>`** proposes rules from a Takeout export's Gmail
  filters; `--yes` adds them. It reads Takeout's `{"filter": [{query, labelsToAdd, labelsToRemove}]}`: each
  `from:` or `to:` term becomes its own rule, and words become subject words.
- **`--filter` takes `from:<address|domain|word>` and `to:<address>`**: `from:sample` matches a sender whose
  address or display name contains the word.
- **Two more spam signals in the sender score:** `never_opened` (+2, you opened none of a sender's mail) and
  `dkim_not_passed` (+2, Gmail's DKIM check did not pass on most of it). On the owner's mailbox they raised the
  share of Gmail Spam reaching score 3 from 22.9% to 84.2%, with the same 1 of 63 replied-to senders flagged
  ([cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/mail/spam-scoring)).

### Cambios que pueden afectar a scripts

- `memo mail rules add --do` takes a comma list: one of `skip`, `envelope`, `keep`, `protect`, plus any
  `tag:<name>`. A rules file may hold the new conditions; `rules remove` drops the rule with exactly the
  conditions given.
- **Mail sent to many is marked**: import puts mail with a List-Id, List-Unsubscribe or `Precedence: bulk`
  header in the mailbox `memo:bulk` (accounts with rules), so `memo search mail '… NOT mailbox:bulk'`
  leaves newsletters out. Search keeps them by default: bills and bookings carry the same headers.

### Corregido

- **A rule's tag never fails the mail sync.** A Gmail label the store refused as too similar to an existing label
  stopped the whole account's sync ("similar labels exist"). memo now puts the mail under the label the store
  points to and rewrites the rule to it (`tags_reused`), or skips a tag with nothing to reuse (`tags_skipped`,
  also shown by `memo mail rules list`). `memo mail rules import-filters` maps Gmail labels to existing memo labels
  before proposing, and lists the mapping. Labels stored with capitals or a slash need cli-core's matching fix.

- **An HTML page sent as the text part is read as text.** Some senders (airline itineraries among them) put HTML
  in text/plain, and memo stored the markup. The next `memo sync` converts mail already stored, once per account.
- HTML comments no longer leave their text and a stray `-->` in an email's text.
- `memo search mail --account` takes the account's name, as the rules and `memo mail status` do, or its address.

## 0.41.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.288.0 and cli-base 0.33.0**, with no old names kept. Shared commands take the new names:
  `tasks agenda --due` → `--due-within`; `tasks agenda --tag`, `--category` and `--claimed` are gone — write the
  query fields `tag:`, `category:` and `claimed:` instead.
- `memo tasks add --attach <task>` → `--into <id>`, the name cli-core's `tasks add` and `tasks merge` use.
- `memo tags add|remove --chat` shows its value as `<chat>`, as every other `--chat` does; it still takes the
  chat's exact id.

## 0.40.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.287.0 and cli-base 0.32.0**, with no old names kept. Shared commands take the new option names:
  `tasks plan --check` → `--remind-time`; `tasks agenda --within` takes a `<duration>`. Every `--json` answer is an
  envelope (`item`, or `items` and `page`).
- **memo's own option names follow cli-base 0.32.0's vocabulary**: `mail rules add|remove --from` → `--sender`;
  `mail rules add --skip|--envelope|--keep` → one `--do <actions>` (`skip`, `envelope` or `keep`; more than one is
  refused); `tags add|remove --path` → `--subfolder`; `facts add --occurred` → `--occurred-time`.
- The MCP tool `facts_add` takes `occurred_time` instead of `occurredAt`.

## 0.39.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- `memo tasks list` answers each task as cli-core's `task` entity, as tg and max do: `kind`, `state`, `key`,
  `title`, `source_message`, `chat`, `account`, `due_at`, `created_at`, `updated_at` and the rest. A task no longer
  carries its message or note preview (`message`, `note`), its `source`, `source_kind` or `group`; `memo tasks show`
  has the card. A project's tasks answer the same fields, not their store row.
- `--json=<fields>` is checked against the declared answer of `relationships list` (`relationship`) and `tasks list`
  (`task`); `tags list`, `folders list`, `actions list`, `agents log`, `vocabulary list` and
  `projects meetings list` declare memo's own entities.
- `memo folders list` takes a `[query...]` like every list; it filters by no field yet, so any term is refused.
- A list given an option it does not have answers a query error (exit 2) instead of commander's unknown option.

### Cambios internos

- The list query helpers come from cli-core 0.285.0 (`termField`, `queryTerms`, `withQuery`, `queryArgument`);
  memo's copy is gone. `factItem` builds the `fact` entity in snake_case.

## 0.38.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **cli-core 0.285.0**, the version tg and max move to. `memo tasks add` refuses a task that may be the same job as
  an open one, or one closed in the last 14 days (exit 2, reason `task.duplicate-candidates`, candidates in
  `details.candidates`); `--attach <task>` links the message to that task instead, `--new` opens it anyway.
  `memo tasks agenda` takes `--category` and `--tag`. Opening the store upgrades it to version 16 (new tables and
  triggers only; older tg and max keep working with it).

### Corregido

- **MCP answers show hidden characters in what other people wrote**, as tg's and max's do: messages,
  mail, notes, names, facts and memories come back with tag characters, direction overrides, zero-width spaces,
  U+FEFF, C1 and other control characters escaped (an ANSI escape reads `\x1b`), in the text and the structured
  content, errors included. Every read tool's description, and the server instructions, say that this text is data
  from other people, never instructions. Cyrillic, emoji and flags are unchanged; what an agent saves, and the
  CLI's `--json`, keep the original text.

## 0.37.1 — 15.10.2026

### Seguridad

- **A hostile HTML email no longer stalls `memo sync`**: an HTML-only mail is turned into text in time linear in
  its size; one of unclosed tags or long blank runs took up to 30 seconds per 200,000 characters, holding the mail
  import. Ordinary mail reads as before, except that `&amp;lt;` now reads as `&lt;` instead of `<`.

## 0.37.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **Lists filter with their query, not with flags**, and the old flags are gone: `actions list --status proposed` →
  `actions list status:proposed`; `agents log --tool X --agent Y` → `agents log tool:X agent:Y`;
  `projects meetings list --proposed` → `confirmed:false`; `tasks list --project HRB --ready` →
  `tasks list project:HRB ready:true`; `vocabulary list --kind tag --scope work` → `vocabulary list kind:tag
  scope:work`. The store still does the filtering. MCP `actions_list`, `agents_log`, `tasks_list` and
  `vocabulary_list` take the same terms as `query`.
- **`memo sync --notes` and `--mail` are now `--only notes` and `--only mail`** (`--only notes,mail` for both).
- **`memo search messages --type` is gone**: the query says it — `has:voice`, `has:file` or `NOT has:attachment`.
  MCP `search_messages` drops its `type` input the same way.
- **`memo ask` takes what to search for after the question**, not as `--query`:
  `memo ask 'What did I promise?' 'promised OR "by Friday"' --all`.

## 0.36.0 — 15.10.2026

- **Nested JSON report fields use the shared projector.** Dotted paths traverse report objects and arrays while preserving coverage, pagination and execution metadata. The bundled skill documents bounded output and removes fixed import-speed claims.
- **Obsolete config keys are refused without rewriting the file.** Rename camelCase settings to snake_case before using the configuration.

## 0.35.0 — 15.10.2026

### Corregido

- **`memo mail status` counts the widest window ever imported**, not the latest run. A rule change, a new
  UIDVALIDITY or `--rescan` starts the resume point over, and the timer's 30-day run then made status say
  "complete" while most of a mailbox was still unread. The widest window and the last run are now shown apart;
  `--json` gains `folders[].since` and `folders[].last`.

## 0.34.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **Option names follow the shared vocabulary of cli-base 0.31.1**, with no old names kept:
  `notes add --about` → `--subject`; `notes add|edit --file` → `--text-file`; `notes export --to` → `--output-dir`;
  `ask --model` → `--analyze`; `mail probe --limit-groups` → `--limit`; `vocabulary create`, `vocabulary aliases
  add|remove` and `projects meetings link --expected` → `--fingerprint`; `projects meetings link --provenance` →
  `--reason`.
- **The config file is read only in snake_case**: a camelCase setting such as `mail.maxBodyChars` or a rule's
  `decidedAt` is refused, and old folders are no longer moved at start (cli-core 0.283.0).
- `@wirecat/cli-base` 0.31.1, `@wirecat/cli-core` 0.283.0.

## 0.33.0 — 15.10.2026

### Cambios que pueden afectar a scripts

- **`facts list` and `memories list` take a query, not filter flags**: `memo facts list kind:decision
  status:proposed project:HRB`, `memo memories list scope:work subject:"person:42"`. The store filters by the
  terms, joined by AND; `--type`, `--status`, `--kind`, `--scope`, `--project` and `--subject` are unknown options
  there now. MCP `facts_list` and `memories_list` take one `query` string instead of those arguments.
- **Facts and memories answer cli-core's `fact` and `memory` entities**: a fact's `type`, `statement` and `source`
  are `kind`, `text` and `origin`; a memory's `body` is `text`. `facts add` takes `--kind` instead of `--type`,
  and MCP `facts_add` takes `kind` and `text` instead of `type` and `statement`. `--json=<field>` on facts and
  memories refuses a field the entity lacks.
- **`tags list` and `relationships list` take a query**: `memo tags list tag:follow-up type:note`, `memo
  relationships list 'about:"project:1"'` instead of `--tag`, `--type` and `--reference`. `--provider` and
  `--account` stay on `tags list`: they pick the accounts, they do not filter rows.
- **`tasks list` and `notes list` take a query**: `memo tasks list state:done`, `memo tasks list kind:bug --project
  HRB`, `memo notes list source:internal text:budget`, `memo notes list 'about:"telegram:Kai Sample"'` instead of
  `--state`, `--about`, `--source` and `--search`. `about:` stands alone: the notes it finds through links are no
  longer narrowed further. `--project` and `--ready` stay on `tasks list`: they pick which tasks are read. A next
  page of `notes list` carries the query.
- **`notes show`, `notes add` and `notes edit` answer cli-core's `note` entity**: `labels` and `provenance` are
  gone from `notes show` (`tags` keeps the tag names); each of `links` is `{to, target_text, kind, anchor}` and each
  of `backlinks` is `{from, target_text, kind, anchor}`. `--json=<field>` refuses a field a note lacks.
- **`search all` answers cli-core's `hit` items**: `key` is gone (key documents still come first with
  `--project`), and a result's open `tasks` moved into `next`: a `tasks list source:"<ref>"` step for the account
  holding them. The `missing: tasks` entry is gone.
- **`search` over several accounts no longer runs as the first one**: it runs as memo and reads exactly the
  accounts selected. An account error lists the accounts to choose from.
- **cli-core 0.281.0**: a note whose title matches the query ranks first in `search notes` and `search all`, and
  lists `title` in `found_by`.
- **`memo tasks link` is cli-core's, the one tg and max have:** a `task:<id>` target links two project tasks as
  before (`--kind blocked-by`, `follow-up-of` or `related-to`, now `related-to` when not given); a message, chat,
  person or URL target links a messenger account's task to it, with `--provider` and `--account`. The old form
  keeps working: `memo tasks link HRB-2 HRB-1 --kind blocked-by` (a bare id with `blocked-by` or `follow-up-of` is a
  task; with `related-to`, when that task exists — otherwise it is refused with "write task:<id>"). `--json`
  answers `{ item: { relations } }`, the task's relations after the link, where it printed `{ relation, changed }`.
  `tasks unlink` and `tasks relations` are unchanged.

### Añadido

- **`tasks list source:"<ref>"`** keeps an account's tasks from one message, note or document.

### Añadido

- **`memo tasks agenda`, `tasks plan`, `tasks show` and `memo stats tasks show`**, the same commands tg and max
  have: cli-core's builders, mounted with `--provider --account`, so memo's agenda reads any messenger account the
  store holds. Without them a command fails and lists the accounts.

## 0.32.0 — 15.10.2026

### Cambiado

- **Mail rules live in the store**, beside the mail they decide, instead of `config.json`. `memo mail rules list`
  counts every rule's emails in one query (it took minutes with hundreds of rules), and each envelope email
  remembers the rule that recorded it. The first command that reads rules moves them from the config, checks
  they all arrived, then drops them from it; the old config stays as `config.json.<time>.before-rules-in-store`
  (mode 600) and stderr says so once. A keep rule whose reason says "never remove" becomes protected.

### Añadido

- **`memo mail rules export <account>`** prints the rules as JSON; **`memo mail rules import <account> <file>`**
  adds them, replacing a rule with the same match.

### Cambios que pueden afectar a scripts

- **Every `--json` answer, and every MCP answer, is the standard envelope.** One thing comes in `item`, a list in
  `items` with `page` (`mode`, `limit`, `has_more`, and `next_page` where the command takes `--page`), and each
  answer carries `meta` with its `run_id`. Before, most commands printed the bare record. `commands --json` reports
  contract 4.
- **`--offset` is now `--page`** in `notes list`, `search notes` and `projects meetings list`; MCP `search_notes`
  takes `page`. A list that only grows with `--limit` says `has_more` and names no next page.
- **`search notes`** lists its notes in `items`, not `hits`; why meaning was not searched is in `missing`. Its
  `linked` summary is no longer in JSON or MCP (the text view keeps it): ask `memo context <person>` instead.
- **`search all`** carries the open tasks that point at a hit on that hit, as `tasks`; the accounts read are
  `meta.accounts`, and a resource it could not read is a `meta.issues` entry.
- **`folders list`** puts the folders known only from another computer in the same list, with `path: null`;
  **`tags list`** puts labels on notes, people, projects and folders in the same list as source labels, one row
  per label with its `origin`, instead of a separate `knowledge` list.
- **`search all`, `search messages`, `search mail` and `search notes` answer cli-core's entities**, as tg and max
  do: `search all` items are `hit`s (`excerpt`, `sender_name`, `sender_ref`, no `text` or `from`), `search messages`
  and `search mail` items are the `message.hit` view (`ref`, not `locator`; no whole `text` — `messages show` has
  it). `--json=<field>` refuses a field the entity lacks, and a bare `--json` at a terminal asks which fields.
- **`search notes --tag` is gone**: `tag:work` goes in the query or in `--filter`; MCP `search_notes` takes
  `filter` instead of `tag`.
- **`notes add` and `notes edit`** answer the note itself as `item`, so `--json=id` works; with `--export` the
  file written is the note's `export_path`.
- **Search by meaning, when its model is missing,** says tg or max downloads it, not a `tg` command as memo's
  own.
- **`mail rules remove`** answers the rules left as `rules`; `relationships suggest` answers a list and no
  longer names its scope; `reminders list` and `reminders poll` answer lists.

## 0.31.0 — 14.10.2026

### Añadido

- **`memo doctor`** says where memo keeps its files and what needs attention, and connects to nothing: the settings
  file, the store and its schema, the notes folders and their ids, the mail accounts and Himalaya's version, the
  search model, the timer (including a program it runs that is gone, and its failing streak) and the agent skill's
  version. Each problem names the command that fixes it; the exit code is 1 while one is left. `--json` answers
  `{item, meta}`.
- **`memo upgrade`** updates memo with the package manager that installed it; `--check` only looks. Once a day memo
  asks npm for a newer version and says so in one stderr line, only to a person at a terminal — never with
  `--json`, in a pipe or on a timer run. `"update_check": false` or `MEMO_NO_UPDATE_CHECK=1` turns it off.
- **`memo mail probe` scores each sender group** for spam, scams and robots, with the signals behind it: Gmail's
  DMARC verdict, a brand in the display name sent from another domain, Reply-To on another domain, a
  throwaway-mail domain, bulk mail never replied to, Gmail's Spam, and replies from the owner (−5).
  `--domain-age` adds the sender domain's age from its registry (RDAP), asked once per domain and kept.
- **Gmail's SPF, DKIM and DMARC verdicts and Reply-To are kept** on new mail: in the headers of mail stored in
  full, and in the metadata of envelopes. Listing reads two more header fields, about 1 KB an email instead of
  300 bytes.

### Cambiado

- **Config settings are named in snake_case:** `mail.max_body_chars`, `mail.max_attachment_chars`, and `list_id`
  and `decided_at` in `mail.accounts[].rules[]`, which `memo mail rules` writes and prints that way. The camelCase
  names older versions wrote are still read, and the file is saved in snake_case; both spellings with different
  values are an error. Renaming inside `rules` needs the cli-core release carrying PR #1224.

### Corregido

- **A himalaya that exits before reading its input no longer crashes memo** with an unhandled `write EPIPE`; the
  failure is reported with how himalaya ended, as for any other himalaya error.
- **The timer follows the memo you run.** After a Node.js switch and an install under the new version, the next
  memo command points the `memo auto` unit at it, so removing the old Node.js no longer breaks the timer silently.
  A checkout or `npx` never moves it.
- **The timer keeps the places memo was started with.** `memo auto start` records `MEMO_CONFIG_DIR`,
  `MEMO_STATE_DIR`, `MEMO_CACHE_DIR`, `MESSAGING_STORE` and `WIRECAT_STATE_DIR` in `auto.places` and passes them to
  every timer run, which used the default places before.
- **A failed Himalaya call says why.** The message names the exit code or signal and Himalaya's last line, instead
  of repeating the command; `exit_code`, `signal` and the last five stderr lines, with passwords and tokens cut,
  are in the error's details. Gmail's `[THROTTLED]` is its own reason, `mail.throttled` (`rate_limited`), with the
  advice to wait an hour or more.

## 0.30.0 — 14.10.2026

### Añadido

- **A mail sync goes on where the last one stopped, without listing the mailbox again.** Each run keeps, in the
  store, the mailbox's UIDVALIDITY and the UIDs whose outcome is final (stored, recorded or skipped by a rule), so a
  rerun reads metadata only for mail not done: a 305,000-email mailbox no longer costs 15–25 minutes of listing
  per run. A whole listing — the only kind that marks deleted mail and refreshes labels and read state — still runs
  at least daily, whenever the rules change, when UIDVALIDITY changes, and with the new `memo sync --rescan`. A
  window under 5,000 emails, like the timer's 30 days, is listed whole every run. An mbox file read to the end is
  not read again until its size or time changes. `memo sync --json` adds `pass` (`full` or `resumed`) to each
  account.
- **`memo mail status <account>`** says how far an account's import is, from the store: stored in full, recorded
  as envelopes, and done of the mail in the widest window searched, as cli-core's progress line;
  `--json` answers the shared progress shape.
- **Mail stored in full keeps List-Id, List-Unsubscribe and Precedence** in its headers (`list-id`,
  `list-unsubscribe`, `precedence`), so a rule can later be matched from the store.

- **`--json=id,title` keeps only those fields** of an answer's item or items, read the way tg and max read it
  (cli-core 0.277.0's `liftJson` and `checkJson`). Adopts cli-core 0.277.0 and cli-base 0.28.2.

## 0.29.0 — 14.10.2026

### Añadido

- **A failing timer run is said on every command.** While the last `memo auto` run failed, every memo command
  writes one line to stderr — `memo: scheduled sync failing since 2026-10-14 00:58 (12 runs): notes … has no
  folder id — memo auto status` — until a timer run passes. `memo auto status` shows `failing` (`since`, `runs`,
  `reason`). Runs are kept in `<state>/auto/last.json` with cli-core's `recordRun`; the timer run itself and a sync
  started by hand do not print or count.
- **Mail stored in full keeps its size at the source** (RFC822.SIZE), as envelopes already did.

### Cambiado

- **On cli-core 0.274.0 and cli-base 0.28.1.** Every answer's `meta` has
  `complete`; `memo sync` answers `complete: false` with `issues` (`{ code, source }`) when a source failed, and
  each entry of its `failed` list carries `code`. Errors carry `retry: { safe, after_ms? }`.
- **Every command declares its effects** in `commands --json`, now contract 3: what it reads or writes on the mail
  server or a model, and on this machine. A failed read is marked safe to retry (`memo sync` while another sync
  runs, for one); before, nothing was, because a command with no effects counts as a write.

## 0.28.0 — 14.10.2026

### Añadido

- **`memo mail rules apply <account>`** cuts mail stored in full that an envelope rule matches down to its
  envelope: text, attachments and search entries go, sender, date, size, labels and the subject in metadata stay.
  A dry run by default that says per rule how many emails and how much text it would cut; `--yes` cuts them.
  Matching reads the headers from the mailbox, as `memo sync` does. Mail only a skip rule matches stays as
  stored. It takes the sync lock and refuses with `sync.running` while a sync runs.

## 0.27.0 — 14.10.2026

### Cambiado

- **Every JSON key memo prints is snake_case**, on the CLI and in MCP: `has_more`, `next_offset`, `key_documents`,
  `your_notes`, `not_read`, `from_them`, `proposed_by`, `creation_fingerprint`, `already_stored`,
  `deletions_skipped`, and the rest. A note's front matter, an email's headers and metadata keep their own keys.
  `memo commands --json` says contract 2.
- **`memo sync --json` prints the shared envelope:** `{"item": {"notes", "mail", "failed", …}, "meta": {"run_id",
  "duration_ms", "accounts"?}}`. What was the whole answer is now `item`.
- **Notes search uses cli-core's names:** a hit's line is `excerpt`, and `found_by`, `has_more`, `next_offset`,
  `meaning_skipped`, `links[].target_text`.
- **More registered reasons:** `folder.unbound` (with `path`), `folder.not-found`, `note.not-imported`,
  `mail.account-unknown` (with `account`), `mail.rule-not-found`, `mail.source-failed`, `mail.invalid-imap`,
  `project.not-found`, `person.not-found`, `identity.no-messenger`, `auto.systemctl-failed`.
- A missing embedding model is recognised by its reason, `model.not-downloaded`, not by its text.
- Moves to `@wirecat/cli-core` 0.268.0 and `@wirecat/cli-base` 0.27.2.

## 0.26.0 — 14.10.2026

### Cambiado

- **Errors are one object, the same on the CLI and in MCP:** `{"error": {"code", "reason", "message", "param"?,
  "details"?}}`. The CLI prints it as one JSON line on stderr in machine mode and `✗ message` at a terminal; MCP
  returns it as `structuredContent` with `isError`. A failure that is not memo's own is `internal_error` /
  `command.crashed` and its text is hidden. A bad option is `validation_error` with Commander's words, exit 2.
- **New global `--debug`** prints the whole error record after the object: the thrown text, cause and stack.
- **memo registers its own reasons** in `APP.errors`: `sync.running` (with `pid`) for a sync refused by the lock.
- A source that fails during `memo sync` shows its registered message; a crash's text shows only with `--debug`.

### Añadido

- **`memo mail rules add --envelope`** records matching mail without its text: sender, date, size, labels and
  the Gmail id, with the subject in metadata and out of search. `memo mail rules list` shows how many emails
  each envelope rule recorded and their size. A keep wins over an envelope, an envelope over a skip; removing
  an envelope rule or changing it to keep reads those emails in full on the next sync. `memo sync --json`
  reports `envelopes` beside `skipped`.

### Corregido

- **The `memo auto` timer no longer fails when a sync is still running.** A timer run that finds the lock held
  exits 0 and writes `memo sync skipped: …` to stderr (`skipped` in `--json`). A sync started by hand still
  refuses with `rate_limited` / `sync.running`.
- **The missing-model hint names the CLIs that download it** — memo has no `models` command: `tg or max
  downloads it: tg models text download e5-small`. MCP `search_notes` no longer suggests `memo models …`.

## 0.25.0 — 14.10.2026

### Añadido

- **`memo mail probe <account>`** groups an account's mail by sender and List-Id from headers only (about 300
  bytes an email): emails, size, unread and bulk shares, years, whether the owner ever wrote to the sender,
  and a `skip` suggestion for large, bulk, never-answered groups. `--json` for agents.
- **`memo mail rules list|add|remove <account>`** keep the owner's skip/keep decisions by sender, domain or
  List-Id in `mail.accounts[].rules`; a keep wins over a skip. `memo sync` never reads or stores an email a
  skip rule matches and reports it as `skipped`; mail stored before stays.
- **Google Takeout mbox accounts** (`"mode": "mbox", "path": "…"`, with the Gmail address) import old mail by
  Gmail's message and thread ids, so it joins the IMAP account's mail. The file is read in one streaming
  pass; it only adds mail, never marks any deleted, and syncs only when named with `--account`.

### Corregido

- **`memo sync` imports a mailbox of more than ~120,000 emails.** A long `--since-time` window failed with
  "Maximum call stack size exceeded" before saving anything.
- **`memo sync --mail` reads mail about ten times faster.** Emails are fetched raw, up to 50 (or 20 MB) per
  IMAP call instead of one himalaya call each, and parsed in-process with `postal-mime`. An email that cannot
  be read or parsed is listed under `unreadable` and tried again next run instead of failing the account.
- **Listing a mailbox of several hundred thousand emails no longer reads one huge answer.** All Mail is listed
  10,000 emails per himalaya call.
- **A whole-mailbox `memo sync` no longer loads every stored email's text.** The deletion check and the "already
  stored" check read only Message-IDs and mailboxes, in one query each, instead of every body and one lookup per
  listed email.
- **A mail marked deleted by mistake is saved again when IMAP lists it again.** It used to count as already
  stored and stayed without its text. An mbox archive still leaves mail that IMAP proved deleted alone.

### Cambiado

- **Depends on `@wirecat/cli-core` 0.265.0 and `@wirecat/cli-base` 0.27.1.** `@wirecat/cli-core` is the new name
  of `@wirecat/cli-messaging`; opening the store with it runs store migrations up to version 7. `memo commands
  <path> --json` says `inherited_options` instead of `inheritedOptions`, and its `contract` is 1.
- **`attachments[].part` and an attachment's `providerRef.part` count the email's attachments from 0** instead
  of being himalaya's MIME part index. Attachments stored earlier keep theirs.
- **Mail bodies are read from the raw message.** Text matches the old reader once whitespace is collapsed; blank
  lines, spaces at line ends and joined flowed lines may differ. HTML parts that the old reader filed as attachments are now the body, and attachments the old reader
  named `attachment-N` keep their real file names.
- **`memo sync --help` and the agent skill say how long a large first mail import takes**, and that Gmail caps
  IMAP downloads per day.

## 0.24.0 — 13.10.2026

### Añadido

- **An agent skill, as tg has.** `memo skill show` prints it and `memo skill install --for claude|agents|all`
  writes it where Claude Code, Codex and Gemini CLI look; a global npm install does that too, unless
  `MEMO_INSTALL_AGENT=none`. It starts with the traps agents fell into: choosing an account, `content:` and
  answer keys, starting project work with `memo projects context`, `--as-owner`, accepting their own proposals,
  writing message text to files, old versions and zsh word splitting.

- **Key documents of a project.** `memo projects key-documents add <project> <note:|document:|msg:> --reason
  <text>` marks what to read first about one project; `remove` and `list` go with it. `memo projects context`
  starts with them — title, path, why, who marked it — and keeps a mark whose source is gone as
  `available: false`. `memo search all` and `search notes` with `--project <project>` put the project's key
  documents first, labelled `key`, and leave nothing out. An agent's mark waits unconfirmed and names the agent.

- **Every command shows one to three examples** at the end of its `--help` and in `memo commands --json`
  (`examples`). A test runs each through memo's own parser, so an example never names a command, option or value
  memo does not take.

### Cambios que pueden afectar a scripts

- **The local store and the search models move to one WireCat folder** (cli-messaging 0.258.0):
  `~/.local/share/WireCat/` on Linux and macOS, `%LOCALAPPDATA%\WireCat\Data\` on Windows. The first start of
  memo, tg or max after the update moves `wirecat.db` and the models there, once; the old folders stay.
  `WIRECAT_STATE_DIR` moves the whole folder and replaces `CLI_COMMON_CACHE_DIR`.
- **An MCP tool failure that is not a memo error is `internal_error`**, the shared name; it was `generic_failure`.
- **`memo notes about` is gone; `memo notes list --about <subject>` returns what it did.** The list now holds the
  notes about the subject and the notes linking it, a note about it, or a name two people share, each with `via`
  (`about`, `link`, `through`, `name`), the headings it links under (`anchors`) and, for `name`, the name as written
  (`linkText`). It still pages and combines with `--source` and `--search`. A person's
  notes include those about any of their messenger identities.

- `memo context` tells you to run `messages sync <chat>` for chats not read in full; the hint said `store fetch <chat>`, which cli-messaging 0.256.0 renamed. Text read from a CSV attachment or note now comes as rows (`name: Bravo; value: 200`), not raw comma separated lines.
- **`memo commands --json` prints cli-base's commands document**, the shape tg and max print: `cli`, `version`,
  `contract`, `description`, `globalOptions`, `commands`, `exitCodes`. `items` is gone; `memo commands <path> --json`
  puts the one command under `commands` with `scope` and `inheritedOptions`.
- `memo import` is now `memo sync` (owner, 2026-10-12; WireCat glossary in cli-messaging). `memo import` stops working. `memo auto start` writes `memo sync` into the unit; a timer installed before runs `memo import` and fails until `memo auto start` is run.
- **A write from an agent's terminal is the agent's.** `memo facts add`, `memories add`, `relationships add`
  and `actions add` run with `AI_AGENT` or `CLAUDECODE` set record the agent as author (`claude-code`, the
  name before the version in `AI_AGENT`), as the MCP server does: the fact or memory waits as `proposed`, the
  relationship unconfirmed with `provenance: agent:<name>`. They were recorded as the owner's and accepted.
  `--as-owner` keeps a write yours inside an agent's terminal.

- **One meaning per flag (WireCat command standard).** A flag that takes several values is given once per value:
  `memo notes add --about a --about b`, `sync` and `search notes` `--folder a --folder b`.
  `reminders add` and `update` take `--at-time` instead of `--at`. `relationships add` takes `--reason <text>`
  instead of `--evidence`, which in `facts` and `memories` names references. `--project` takes a key or
  `project:<id>` in `facts add`, `facts list` and `tags add|remove`, as it does in `tasks`; `tags --folder` takes a
  folder's path as well as its id; `projects add --organization` takes a bare id as well as `organization:<id>`.

- **One way to bring notes and mail in: `memo sync` (WireCat command standard, no two commands overlap).**
  `memo notes import` and `memo mail <account> import` are gone. `memo sync --notes` and `--mail` take one side;
  `--folder` and `--ignore` narrow the notes, `--account <name>`, `--since-time <time>` (a date, ISO 8601 or
  `30d` ago), `--limit <n>` and `--retry-attachments` narrow the mail. Without `--account` it reads every account
  and names each. `memo mail <account> show <reference>` is `memo messages show <reference>`.
- **Verbs from the shared list.** `facts accept` and `actions approve` are `confirm`; `actions propose` is
  `actions add`; `tasks readiness` is `tasks status`; `tasks ready` is `tasks list --ready --project <project>`;
  `auto on` / `off` are `auto start` / `stop`; `reminders schedule` / `snooze` are `reminders add` / `update`;
  `vocabulary resolve` is `vocabulary show`; `vocabulary preflight <name>` and `vocabulary audit` are one
  `vocabulary check [name]`; `memories search` is `search memories`. The old names stop working.
- **MCP tools follow their commands:** `actions_add`, `search_memories`, `tasks_relations`, `tasks_status`,
  `tasks_list` (with `ready`), `vocabulary_check` (with or without `name`) and `vocabulary_show` replace
  `actions_propose`, `memories_search`, `task_relations`, `task_readiness`, `tasks_ready`, `vocabulary_audit`,
  `vocabulary_preflight` and `vocabulary_resolve`.

### Corregido

- **Mail hints name `memo sync --mail`.** `memo search mail` and its MCP tool named `memo mail <account> import`,
  which is gone.
- **`memo sync` keeps `mail.maxBodyChars` and `mail.maxAttachmentChars`.** Only `memo mail <account> import`
  read them; the timer stored mail with the defaults.
- **Every argument and option of memo is described in its help**, and every summary is lower case, at most 80
  characters.
- **A command path given as one argument is refused with the words to type.** `memo "projects add" --help` — what
  a zsh loop over `"$c"` passes — printed the root help; it now says `"projects add" was given as one argument;
  run: memo projects add`.
- **Search help says where file text and references are.** `search messages`, `search mail` and `search all` say
  `content:`, `transcript:` and `filename:` narrow a search to the text of files, voice transcripts or file names, and each search's `--help` and MCP
  tool names the list (`items` or `hits`) and the reference (`locator` or `ref`) of its `--json` answer. The usage and
  troubleshooting guides say the same, and to compare `memo --version` with npm before reporting a bug.
- **The search guide names `content:` for messages.** It narrows a search to the text of files, in
  `memo search messages` and `memo search all` as in tg; the guide listed it for mail only.
- **`memo projects context` and `memo organizations context` refuse what the store does not hold** with
  `not_found` instead of an empty answer, and `organizations context` takes `organization:<id>` as well as
  its id.
- **`memo folders attach` refuses drive-cli's `google-drive:` folder**, and `memo folders list` marks it "kept by
  drive" (`keptBy: "drive"` in JSON) instead of offering to attach it. Bound to a disk folder, the next import
  would have deleted the Drive documents missing from it.
- **`memo search all` no longer runs as the first stored account.** It searched every account before too, but
  picked one as its own; now it runs as memo's notes and its answer names every account it read, as `accounts`
  (`{ resource, provider, account }`) in JSON and a `searched:` line on stderr. `memo search messages` and
  `memo search mail` stop picking one as well.

## 0.23.0 — 12.10.2026

### Corregido

- **An MCP answer over 4 MiB is refused with `invalid_response`**, as cli-messaging's tools refuse one, instead of
  reaching the agent whole.
- **Memory, fact, action and agent-log lists say whether there are more** (`hasMore`, CLI and MCP), as the other
  lists do; asked for the whole 500, a full answer says it may have more. `tasks list` (of an account), `tasks
  ready` and `tasks_ready` give each task its `task:` reference.
- **Terminal answers name things by the references memo's commands take.** `notes list` and `context` printed a
  bare note id that `notes show` refuses; they print `note:`/`document:` references. `notes show` printed only the
  text; it starts with the reference, path or title, update time and tags, and ends with what it links and what
  links it. `context` names the person as `person:<id>` and each message by its `msg:` locator, and tasks as
  `task:<id>`. `tags list` names a chat as `chat:…`, a contact as `<messenger>:<id>` and every other label's
  target as `<type>:<id>`, not as JSON. `context --json` gives each of your notes its `ref`.

## 0.22.0 — 12.10.2026

### Cambiado

- **Built on `@wirecat/cli-base` 0.21.0, the framework's new name, and the shared library 0.254.0.** Nothing
  changes in memo's commands; `memo search` answers carry `nextOffset` where the shared search gives it, and
  `memo context person:<id>` takes the `person:` references search answers give.

### Añadido

- **`memo mail <account> show <reference>` opens one stored email whole**, by the `msg:email/…` reference search
  answers give: time, sender, To, Cc, labels, subject and the whole body; `--before-n`/`--after-n` add the emails
  of its thread either side, `--json` the same as data. The reference must be of the named account.
- **The MCP server searches every source.** `search_all`, `search_messages`, `search_mail`, `search_notes` and
  `person_context` read the same store as `memo search` and `memo context`. memo is where an agent searches across
  messengers, mail and notes; tg and max will search only their own messages
  ([which tool owns which command](https://github.com/WireCatLabs/cli-messaging/blob/main/docs/dev/TOOL-BOUNDARIES.md)).

### Corregido

- **`memo ask` gives coverage as counts per account, and its 64 KiB limit covers the whole answer.** Each
  messenger account had one row per chat, up to 500, which made 95% of an answer (64 KB of 68 KB on one real
  store); now `chats` counts `checked`, `complete`, `partial`, `neverFetched`, `behind` and `withGaps`, and `more`
  says the 500-chat check was cut short. The size check measured the evidence only; it now measures what is printed.

## 0.21.0 — 11.10.2026

### Correcciones

- La indicación tras una búsqueda sin el modelo de búsqueda por significado nombra el comando que lo descarga,
  `tg models text download e5-small`; antes nombraba un comando `memo models` que no existe.
- `memo projects context` encuentra un proyecto por su clave (`HRB`) o por `project:<id>`, además de por su id;
  con la clave la respuesta salía vacía.

### Cambios — pueden romper scripts

- **`memo search mail` y `memo search messages` muestran cada resultado como una referencia, luego quién y
  cuándo, y luego un extracto.** En un correo, la segunda línea nombra To, Cc y sus etiquetas de Gmail, y la
  tercera su asunto; el cuerpo completo vuelve con `--full`. `--json` da a cada correo `email` (from, to, cc, bcc
  y reply-to con sus referencias `person:`, etiquetas, cadena, leído y destacado) y un `excerpt` en lugar del
  `text` completo; `--brief` deja solo referencia, título, hora, remitente, extracto y puntuación. La búsqueda de
  correo ya no devuelve `coverage`. Basado en la biblioteca compartida 0.251.0.

### Correcciones

- **La importación de correo ya no archiva las direcciones Cc en To.** El correo importado antes las conserva en
  ambos campos; la búsqueda las muestra solo en Cc.

## 0.20.0 — 11.10.2026

### Novedades

- Las guías de `docs/` siguen la estructura de herramientas de wirecat.dev: una introducción, el uso diario, cómo
  funciona memo, recetas, solución de problemas, recuerdos y una referencia de comandos generada (`pnpm generate`),
  escritas para lectores que no usan un terminal a diario.
- `memo commands [path] --json` enumera el árbol de comandos y sus opciones, como hacen tg, max y drive, para que
  la documentación y los agentes puedan comprobar un comando antes de ejecutarlo.
- Todos los comandos tienen una descripción en `--help`, incluidos organizaciones, proyectos, relaciones,
  recordatorios y el listado de tareas.

## 0.19.0 — 11.10.2026

### Novedades

- `memo mcp` indica al agente que se conecta cuándo guardar: lo que pasó es un hecho (`facts_add`), lo que
  concluyó es un recuerdo (`memories_add`), lo que hay que hacer es `actions_propose`, cada uno con su evidencia,
  y solo lo que importará más adelante. `memo search …` y `memo notes show` terminan su `--help` con la misma
  indicación para `memo facts add` y `memo memories add`.

### Cambios

- **La búsqueda por significado en el correo encuentra el correo que contiene la respuesta.** El correo vuelve a
  dividirse en partes correo a correo; el texto citado de nuevo, los saludos y las firmas se siguen descartando.
  Antes, una parte abarcaba varios correos de una cadena y el resultado nombraba el más reciente. La primera
  indexación tras la actualización vuelve a dividir una vez el correo guardado y lo vectoriza de nuevo. Basado en
  la biblioteca compartida 0.249.0.

### Correcciones

- La preparación de una versión se detiene si otra sesión hace avanzar main mientras se ejecutan su PR de versión
  o las comprobaciones locales. Revisa el nuevo main antes de reintentarlo; una preparación obsoleta no puede
  fusionar un encabezado de versión redundante ni lanzar una fuente no verificada.

## 0.18.0 — 11.10.2026

### Correcciones

- El historial de cambios de origen tiene un solo encabezado 0.17.0 después de que la preparación de la versión
  coincidiera con la fusión de su funcionalidad. Los comandos de vocabulario y la versión fijada del almacén
  compartido siguen igual que en 0.17.0.

## 0.17.0 — 11.10.2026

### Novedades

- **Creación de etiquetas revisada por el propietario:** `memo vocabulary create` exige la huella de creación
  actual de la comprobación previa. Las etiquetas parecidas se comprueban en el almacén compartido, incluido el
  etiquetado implícito; las aprobaciones obsoletas fallan. Los alias exactos siguen reutilizando su etiqueta
  canónica. `vocabulary audit` descubre sinónimos léxicos existentes con presupuestos explícitos de trabajo y de
  salida e informa de los análisis incompletos; nunca los acepta ni los fusiona.

- **La búsqueda de correo filtra por estado de leído y destacado, y admite `label:`.** `memo search mail` admite
  `is:unread`, `is:read`, `is:starred` y `label:` (igual que `mailbox:`), y `date:>=2026-01-01` además de
  `date>=2026-01-01`. Funciona con la biblioteca compartida 0.246.0.

## 0.16.0 — 11.10.2026

### Novedades

- **Reuniones de proyecto y dependencias entre tareas.** `projects meetings list|link` exige el proveedor y la
  cuenta exactos de la reunión y admite una clave de proyecto canónica o un alias explícito. `tasks link|unlink`
  gestiona relaciones revisadas de tipo bloqueada-por/continuación-de/relacionada-con; `relations`, `readiness` y
  `ready` exponen el grafo de tareas compartido. Descubrir tareas listas no reclama ninguna. Las herramientas MCP
  `task_relations`, `task_readiness` y `tasks_ready` son de solo lectura. Funciona con la biblioteca compartida
  0.242.0 realmente publicada; las nuevas claves de proyecto usan 3–4 caracteres y las existentes siguen siendo
  válidas.

- **Descubrimiento del vocabulario canónico y alias revisados.** `vocabulary list|resolve|preflight` muestra los
  ID estables de proyectos, etiquetas y temas, los alias explícitos y las etiquetas probablemente duplicadas por
  su forma. `vocabulary aliases add|remove`, reservado al propietario, exige la huella actual de la vista previa.
  Las herramientas MCP de solo lectura `vocabulary_list`, `vocabulary_resolve` y `vocabulary_preflight` permiten
  a un agente reutilizar el catálogo; no pueden aceptar ni cambiar alias. `facts_add` puede asociar su hecho
  propuesto a un proyecto canónico.



## 0.15.0 — 11.10.2026

### Cambios — pueden romper scripts

- **`memo mail <account> import` sustituye a `memo mail import --account <name>`; la forma antigua ya no existe.**
  `<account>` es el nombre en `mail.accounts` y es obligatorio aunque solo haya una cuenta configurada: memo ya no
  recurre a la primera. Un nombre ausente o desconocido es un error que enumera los configurados. Una importación
  de correo toma ahora el bloqueo que toman `memo import` y el temporizador, así que nunca se ejecutan a la vez.
  `memo import` sigue importando todas las cuentas.
- **`bin/mail-password <account>` exige la cuenta**; sin ella, el script imprime su uso y los nombres
  configurados en lugar de suponer `gmail`.

### Novedades

- **`memo search mail --account <address>`** busca en una cuenta de correo; sin él, en todas. Una dirección que
  el almacén no tiene da `not_found` y enumera las que sí tiene.

## 0.14.1 — 11.10.2026

### Correcciones

- **npm vuelve a instalar los paquetes uno al lado del otro.** Funciona con `@wirecat/cli-messaging` 0.241.0,
  cuyo `@wirecat/cli-meetings` 0.4.2 acepta cli-core 0.20.0. Con 0.240.0, npm ponía cli-messaging en una carpeta
  anidada con una segunda copia de cli-core.

## 0.14.0 — 11.10.2026

### Cambios — pueden romper scripts

- **En macOS, memo guarda sus archivos donde lo hace en Linux**: `~/.config/cli-memo`, `~/.local/share/cli-memo` y
  `~/.cache/cli-memo` en lugar de `~/Library/…`. La primera ejecución mueve allí las carpetas antiguas, junto con
  el almacén compartido. Si se está ejecutando un `serve` de un mensajero o un servidor MCP, imprime un aviso,
  sigue usando las carpetas antiguas en esa ejecución y lo vuelve a intentar la próxima vez. Linux y Windows no
  cambian. Funciona con `@wirecat/cli-messaging` 0.240.0.

## 0.13.0 — 11.10.2026

### Novedades

- **`mail.maxBodyChars` y `mail.maxAttachmentChars`** en la configuración fijan cuánto guarda `memo mail import`
  del cuerpo de un correo (por defecto 1.000.000 de caracteres) y del texto de un adjunto (por defecto 200.000).
- **`memo facts add|list|show|accept|reverse`: lo que ocurrió, con su evidencia.** Un hecho es un hecho, una
  afirmación, una pregunta, una decisión o una promesa. Los tuyos se aceptan al momento; los de un agente esperan
  como propuestos. Una decisión con `--supersedes` termina la que sustituye cuando se acepta; `reverse` termina
  una decisión aceptada. `memo mcp` ofrece `facts_add`, `facts_list` y `facts_show`.
- **Tareas propias en un proyecto.** `memo tasks add --project <key> --title <title> --type bug|feature|chore`
  crea una sin fuente. `--priority`, `--parent`, `--description` y `--assignee` funcionan en cualquier tarea;
  `memo tasks update <id>` los cambia, `memo tasks list --project <key>` enumera las tareas de un proyecto y
  `memo tasks close` cierra una.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.238.0**, versión 2 del almacén: al actualizar un almacén, sus
  recuerdos de tipo hecho pasan a ser hechos y se copian las asignaciones de tareas; las versiones anteriores de
  memo aún lo abren.
- **El correo se busca por significado cadena a cadena**, sin el texto citado de nuevo: la primera
  `memo mail import` tras la actualización vuelve a dividir cada cadena y vectoriza el correo otra vez. La
  búsqueda por palabras no cambia.
- **El tipo `fact` de los recuerdos desaparece**: lo que ocurrió ahora es un hecho (`memo facts`). El almacén
  ha movido los recuerdos existentes de tipo hecho a hechos, con sus evidencias y enlaces.
- **`memo tasks assign` admite `--role` (assignee, reviewer o watcher) y ya no `--provider`/`--account`.**
  Escribe los responsables de la tarea, que lee `memo context`, en lugar de una relación `assigned-to`.

## 0.12.0 — 11.10.2026

### Novedades

- **`memo notes add --meeting <id> --provider <provider> --account <account>` escribe una nota sobre una
  reunión.** Toma el id de la reunión en el almacén, como hace `memo tags add --meeting`, y añade el mismo sujeto
  `meeting:<account id>/<meeting id>` junto a cualquier `--about`. Una reunión que la cuenta no tiene da
  `not_found`.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.235.0.**
- **Leído y destacado se mantienen al día.** `memo mail import` actualiza leído y destacado en el correo que
  guardó antes, tal como los muestra ahora el buzón, sin volver a leer el correo.
- **Las cuentas IMAP genéricas reciben marcas.** Sus mensajes registran leído y marcado, y uno marcado lleva la
  etiqueta `Starred`, como un mensaje destacado de Gmail, así que `search mail mailbox:starred` encuentra ambos.
- **Los correos largos se guardan enteros.** El cuerpo se cortaba a los 20.000 caracteres; ahora se guarda hasta
  1.000.000, y el almacén lo divide en fragmentos para la búsqueda.

## 0.11.0 — 11.10.2026

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.233.0.** Los adjuntos de un correo importado ahora también se
  encuentran por significado: su texto se divide en fragmentos y se vectoriza tras la importación, y
  `search conversations` de tg/max responde a una coincidencia en un adjunto con su correo.

## 0.10.0 — 11.10.2026

### Novedades

- **Las etiquetas y los destacados de Gmail llegan al almacén.** `memo mail import` lee las etiquetas
  (`X-GM-LABELS`) y las marcas de cada mensaje: cada etiqueta, incluidas Inbox, Important y Sent, se convierte en
  un buzón de etiqueta con un nombre sencillo, un mensaje destacado recibe además `Starred`, y el correo nuevo
  registra leído y destacado. `search mail mailbox:important` los encuentra. Las etiquetas se sustituyen en cada
  ejecución, porque la lista de Gmail es completa; las carpetas mantienen la regla por análisis, y solo las
  carpetas deciden si un correo que falta se ha borrado. Una línea de etiquetas que la importación no puede leer
  deja las etiquetas de ese mensaje como estaban.

## 0.9.0 — 11.10.2026

### Novedades

- **Una reunión se puede etiquetar y se puede escribir sobre ella.** `memo tags add|remove --meeting <id>` con
  `--provider` y `--account` etiqueta una reunión guardada, `memo tags list --type meeting` las enumera y `memo notes add --about
  meeting:<account id>/<meeting id>` escribe una nota sobre una.
- **`memo memories`**: `add`, `list`, `show`, `search`, `confirm` y `stale` para lo que tú y los agentes
  habéis concluido, cada uno con su evidencia y un ámbito `personal` o `work`. Los tuyos se confirman al momento;
  los de un agente esperan como propuestos.
- **`memo actions`**: `propose`, `list`, `show`, `approve` y `reject`. Aprobar convierte la acción en una tarea
  en la cuenta que actuaría; no se envía nada.
- **`memo agents log`**: lo que hicieron los agentes a través de los servidores MCP, por herramienta y agente,
  nunca los argumentos.
- **`memo mcp`**: un servidor MCP por stdio con `memories_add|list|show|search`, `actions_propose|list|show` y
  `agents_log`. Lo que escribe un agente tiene como autor `memo-mcp` y te espera; cada llamada se registra.

### Cambios — pueden romper scripts

- **memo funciona con `@wirecat/cli-messaging` 0.232.0.** `search mail` admite `to:`, `cc:`, `bcc:` (una
  persona, como `from:`), `subject:` (solo palabras del asunto) y `mailbox:` (una carpeta o una etiqueta de Gmail).
- **La ayuda de `search` y `search all` indica lo que `search all` no lee** —personas, recuerdos, proyectos,
  organizaciones y decisiones— y remite cada tipo conocido a su propia búsqueda.
## 0.8.0 — 11.10.2026

### Cambios — pueden romper scripts

- **El correo va a las tablas de correo del almacén.** `memo mail import` guarda cada correo mediante
  `store.mail` de cli-messaging (0.231.0): cadenas, correos, To/CC/BCC, carpetas como buzones y el texto de los
  adjuntos en su correo. Los id no cambian, así que una referencia `msg:email/…`, una etiqueta o una nota creadas
  antes siguen resolviéndose. El correo guardado como mensajes por importaciones anteriores sigue pudiendo
  buscarse y mantiene su antigua regla de borrado; se vuelve a leer en las tablas de correo a medida que la
  ventana lo cubre. Mientras existen ambos, `deleted` cuenta filas guardadas: un correo borrado en el origen
  cuenta su correo, su mensaje antiguo y cualquier entrada antigua de adjunto. Un adjunto ya no es una entrada
  propia: el informe de importación elimina `attachments[].locatorId`, y una nota sobre una entrada de adjunto se
  queda en esa entrada antigua.
- **Las etiquetas, las tareas y el contexto de una persona leen las tablas de correo.** `tags list` mantiene una
  etiqueta en un correo, `tasks add` admite como fuente el `msg:email/…` de un correo, y las tareas y el contexto
  de una persona incluyen su correo.
- **El correo se vectoriza desde las tablas de correo.** Tras guardar, `memo mail import` vectoriza los
  fragmentos del correo nuevo (`embedMail` de cli-messaging), así que `search conversations` de tg y max sigue
  encontrando el correo por significado. `--no-embed` y la falta del modelo se comportan como antes.

## 0.7.1 — 11.10.2026

### Correcciones

- La búsqueda de correo, los paquetes de evidencias y el contexto de una persona también leen el correo guardado
  en las tablas de correo dedicadas. Las importaciones de correo anteriores siguen siendo compatibles; los
  resultados de búsqueda muestran cada referencia de correo una sola vez.

## 0.7.0 — 11.10.2026

### Cambios

- **memo funciona con `@wirecat/cli-messaging` 0.226.0.** El almacén recorta sus registros crecientes al
  abrirse, como mucho una vez al día: se borran las llamadas a herramientas de agentes de más de 90 días, y una
  actualización de bot procesada de más de 30 días pierde su contenido. Actualiza primero tg-cli y max-cli,
  porque los tres comparten el almacén.
- **`organizations add --kind`, `projects add --type` y `--scope` toman sus valores permitidos del almacén** y
  rechazan cualquier otro valor antes de abrir el almacén, indicando los permitidos.

### Correcciones

- **`memo --version` imprime la versión del paquete.** Imprimía 0.4.0 desde 0.5.0: el número estaba en un
  archivo que la publicación no actualizaba. Ahora una prueba falla cuando ese archivo y `package.json` no
  coinciden.
- Las referencias a paquetes, la documentación y los datos de prueba usan el espacio de nombres WireCat en todas
  partes.

### Seguridad

- **Se borra el antiguo `messages.db`** cuando el almacén se abre en su ruta predeterminada: el archivo sin
  cifrar que se usaba antes de `wirecat.db`, con sus `-wal` y `-shm`. Una línea en stderr lo nombra. Se conserva
  cuando `MESSAGING_STORE` está definido y mientras otro proceso aún lo tenga abierto.

## 0.6.1 — 11.10.2026

### Fixed

- Package references, documentation and fixtures use the WireCat namespace throughout.
- The printed Memo version matches the published package version.

### Changed

- **memo runs on `@wirecat/cli-messaging` 0.221.0.** The store prunes its growing logs on open, at most once a
  day: agent tool calls older than 90 days are deleted, and a handled bot update older than 30 days loses its
  payload. Upgrade tg-cli and max-cli first, as all three share the store.
- **`organizations add --kind`, `projects add --type` and `--scope` take their allowed values from the store**
  and refuse any other value before the store is opened, naming the allowed ones.

### Fixed

- **`memo --version` prints the package's version.** It printed 0.4.0 since 0.5.0: the number lived in a file the
  release did not update. A test now fails when that file and `package.json` disagree.

## 0.6.0 — 10.10.2026

### Cambios — pueden romper integraciones

- **memo funciona con `@wirecat/cli-messaging` 0.218.0 y `@wirecat/cli-core` 0.19.3**, con el almacén en
  `wirecat.db`. El antiguo `messages.db` se deja como está y no se lee: vuelve a importar las notas y el correo,
  y ejecuta `memo folders add <path>` para cada carpeta, ya que un id de carpeta del almacén antiguo no está en el
  nuevo.
- **`memo entities` se sustituye por `memo organizations` y `memo projects`** (`add`, `list`, `context`), ya
  que el almacén ahora los guarda por separado; `tags --entity` pasa a ser `--organization` o `--project`, y las
  referencias `entity:` no se encuentran. Una organización es una empresa, un equipo, una familia o una
  comunidad; un proyecto tiene una clave.
- **Un archivo de una carpeta de notas es `document:<id>`, y una nota escrita en memo, `note:<id>`.**
  `notes show`, `tags --note`, `tasks add` y `--about` admiten cualquiera de los dos; un id sin prefijo es de una
  nota escrita. La evidencia y los enlaces de la búsqueda nombran la nota de un archivo con `document:`.

### Seguridad

- Las comprobaciones rápidas de secretos siguen en las PR; las comprobaciones de seguridad del código fuente, de
  las dependencias de producción y de los flujos de trabajo se ejecutan antes de la publicación. Las
  comprobaciones automáticas de Socket están desactivadas.

## 0.5.1 — 10.10.2026

### Cambios

- **El proyecto tiene ahora licencia Apache License 2.0.** Consulta `LICENSE` para ver los términos.

## 0.5.0 — 10.10.2026

### Cambios — pueden romper integraciones

- **El paquete es `@wirecat/cli-memo` y su repositorio pertenece a WireCatLabs.** Usa este paquete para
  instalaciones y actualizaciones.


## 0.4.0 — 09.10.2026

### Cambios — pueden romper scripts

- El almacén compartido elimina las copias que guardaba para versiones anteriores (versión 28 del almacén,
  cli-messaging 0.212.0). Las notas, relaciones y entidades escritas antes de la reestructuración de las notas se
  copian una vez a sus nuevas tablas, durante la actualización. Después, una versión anterior de tg, max o memo
  rechaza el almacén con "upgrade this tool": actualiza los tres a la vez.

## 0.3.0 — 09.10.2026

### Cambios — pueden romper scripts

- Los comandos de búsqueda están ahora en `search all|messages|mail|notes`, con los servicios y la clasificación
  compartidos. `search all` devuelve resultados de fuentes con tipo y una lista `tasks` aparte con el trabajo
  abierto vinculado. Las antiguas rutas `memo search <query>` y `memo notes search` se eliminan sin alias. Usa
  `search notes --type` en lugar de `notes search --source`; `--all` y `--note-text` ya no hacen falta.

- Fija el SDK compartido 0.211.0 junto con Telegram/MAX. Las fuentes de tareas de notas copiadas antiguas pasan a
  ID de notas nativos sin cambiar los ID de las tareas, el ámbito de cuenta ni los estados de cerrada. Actualiza
  juntas las herramientas coordinadas antes de abrir el almacén compartido del propietario.

### Correcciones

- `search all` encuentra mensajes en un almacén que aún no ha registrado la cuenta con la que se ejecuta, y
  consulta al servidor del mensajero como hace `search messages`. `search mail` sin correo importado responde con
  un resultado vacío y una nota. Las notas encontradas por significado deben ser tan parecidas como ya tenían que
  serlo las conversaciones, así que una palabra poco frecuente ya no devuelve todas las notas.

### Novedades

- `tasks add note:<id> --provider <provider> --account <account>` crea tareas a partir de notas de archivo
  nativas o internas. Los listados resuelven la vista previa actual de la nota; las notas borradas dejan las
  tareas intactas. Los enlaces confirmados de nota sobre una persona y las asignaciones explícitas se suman al
  contexto de la persona. La búsqueda unificada incluye las tareas cuya nota coincide. Crear de nuevo la misma
  tarea reutiliza la tarea existente del mismo tipo, incluidas las cerradas.

## 0.2.1 — 08.10.2026

- Fija cli-messaging 0.205.0 para coincidir con la versión coordinada de Telegram/MAX. Las notas nativas, los
  enlaces y las referencias de fuente mantienen el mismo esquema y comportamiento.

## 0.2.0 — 08.10.2026

Las notas son registros propios en el almacén compartido (cli-messaging 0.202.0, versiones 25–27 del almacén), y
ya no mensajes de un proveedor `notes`.

- `memo folders add|attach|list`: una carpeta de notas recibe su id del almacén, y la configuración de cada
  ordenador la vincula a la ruta y el formato de ese ordenador (`obsidian` o `markdown`). `list` muestra las
  carpetas que el almacén tiene de otro ordenador. Una carpeta importada antes de la versión 25 del almacén mueve
  su ruta a la configuración en la primera ejecución. La importación rechaza una carpeta sin id en lugar de
  inventarse uno.
- La importación escribe las notas, sus enlaces y sus etiquetas de archivo. Un enlace a una nota que la carpeta
  tiene una sola vez se guarda por el id de la nota; un nombre que ninguna nota tiene se queda tal como está
  escrito y se resuelve a una persona en cuanto existe una con ese nombre, alias o nombre de usuario. Un archivo
  movido conserva su id, sus enlaces y sus etiquetas. Una etiqueta que añadiste se mantiene cuando el archivo deja
  de indicarla. Lo último que vio un ordenador de cada archivo se guarda en la carpeta de estado de memo, y solo
  se abre un archivo cambiado, también para buscar `memo-id`, que marca un archivo que memo exportó y lo deja
  fuera de la importación.
- `memo notes add|edit|remove|list|show|export` para notas escritas aquí sobre mensajes, chats, contactos,
  personas, entidades, tareas y otras notas; `--export [dir]` y `notes.export` las escriben como archivos que
  llevan `memo-id` y nunca se sobrescriben una vez editados.
- `memo notes about`, `memo context` y `memo note` leen los enlaces guardados: notas sobre una persona, notas
  que la enlazan y notas que enlazan una nota sobre ella. Un nombre completo encontrado en el texto plano de una
  nota ya no se muestra como suposición. El antiguo `people-notes.json` pasa al almacén como enlaces `about`, una
  sola vez.
- `memo notes search` funciona sobre el índice de notas compartido: palabras y raíces, el lenguaje de consulta
  de los mensajes, `--exact`, `--source`, `--folder` por ruta o id, y por significado cuando e5-small está
  descargado (`memo
  import` y `memo notes import` vectorizan las notas; `--no-embed`, `notes.embed: false`). Cada resultado indica
  qué lo encontró (`foundBy`), y se nombra a la persona que enlaza una nota encontrada. `memo search --all` cubre
  las notas; `--note-text` también recupera el texto de las notas escritas.
- Las entidades y las relaciones son del propietario: `entities` y `relationships add|list|remove|confirm`
  ya no admiten `--provider`/`--account`. `memo tags add --note <id>` etiqueta una nota; `--person`,
  `--entity` y `--task` no necesitan cuenta. `--folder <id> [--path <subfolder>]` etiqueta todas las notas de una
  carpeta o subcarpeta y sustituye a `--chat` con `--provider notes`. `tags list` indica si la etiqueta de una
  nota procede de su archivo.
- Las notas se leen a través de un formato: `obsidian` añade `#tags` en línea y lee enlaces `[label](path.md)`
  además de `[[wiki links]]`; `markdown` lee enlaces Markdown simples. Los enlaces a referencias `person:`,
  `msg:`, `note:`, `entity:`, `task:`, `chat:` y `contact:` se reconocen en ambos.

- Tareas abiertas y asignaciones explícitas de tareas de documentos en el contexto de una persona; tasks
  add/list/close reutilizan el servicio de tareas compartido. Si coinciden varias cuentas, hay que elegir una
  explícitamente.
- Ingesta de CSV/TSV, PDF, DOCX, XLSX, ODT/ODS, PPTX y EPUB mediante la extracción compartida, con informe de
  motores opcionales y formatos no compatibles, límites de archivo y de texto, hashes de contenido y procedencia
  por página, fila y celda.
- Cobertura configurable de carpetas de Gmail/IMAP, identidades estables por Message-ID, fuentes de texto de los
  adjuntos e indexación de correo limitada y reanudable. Los listados parciales nunca demuestran un borrado;
  cuando cambia el alcance de las carpetas, se omite el borrado.
- Etiquetas de persona, tarea y entidad canónicas, relaciones manuales de organización, familia y proyecto,
  recuperación unificada de las fuentes seleccionadas, y paquetes de evidencias con citas y propuestas del modelo
  con consentimiento remoto explícito.
- Recordatorios de tareas locales y duraderos con recibos de concesión, confirmación de recepción, comprobación de
  ediciones obsoletas, posponer/cancelar y cancelación automática cuando se cierra una tarea. Sin envíos al
  exterior ni cambios en el sistema de origen.

- `memo tags add|remove|list`: etiquetas locales en notas, correos, mensajes y carpetas/cadenas importados,
  identificados por ID de nota o de carpeta, localizadores de mensaje o un proveedor/cuenta/chat exacto. Las
  etiquetas no distinguen mayúsculas de minúsculas, se comparten con tg/MAX y conservan los archivos y buzones de
  origen; las fuentes borradas no aparecen en el listado.
- `memo notes search --tag <tag>` filtra los resultados por palabras y semánticos con la elegibilidad de
  etiquetas compartida, incluidas las etiquetas de la carpeta de la nota.

## 0.1.2 — 07.10.2026

- cli-messaging 0.166.0, a juego con las versiones fijadas definitivas de tg y max, incluida la preparación
  protegida de conversaciones durante la búsqueda y la descarga del historial.

## 0.1.1 — 07.10.2026

- cli-messaging 0.164.0, a juego con el código de tg y max: el contexto de una persona ahora encuentra los
  diálogos privados sin miembros registrados y recupera el último mensaje en cada sentido y los mensajes directos
  en los almacenes de Telegram existentes.

- El flujo de publicación puede hacer una prueba en seco de una versión que ya está en npm, para comprobar el
  empaquetado entre versiones. La publicación sigue rechazando una versión existente.

## 0.1.0 — 06.10.2026

- El comando `memo`, con `--version` y `--help`.
- `memo notes about <name>` (antes `memo notes <name>`): notas sobre una persona, notas que la enlazan y
  menciones débiles de su nombre en texto plano, de las carpetas Markdown indicadas con `--folder` o
  `notes.folders` en la configuración.
- `memo mail import`: todo el correo (All Mail) de una cuenta de Gmail al almacén de mensajes compartido mediante
  Himalaya, en solo lectura; con los id de cadena y de mensaje de Gmail, reanudable con `--max`, y los borrados en
  el origen eliminan el texto guardado.
- `memo note`: la nota sobre una persona, guardada por cada persona del almacén compartido. Vincular identidades
  se hace con `tg|max contacts link`, no con un comando de memo.
- `memo notes import`: notas Markdown y de texto al almacén compartido como proveedor `notes`; las ediciones se
  guardan como revisiones y las notas borradas pierden su texto. `memo notes search <text>`: notas por sus
  palabras, con las personas que enlazan y las personas conocidas cuyo nombre completo mencionan (una suposición).
- `notes.ignore` en la configuración y `--ignore`: archivos, carpetas o patrones glob que nunca se leen ni se
  guardan.
- `memo import`: notas y correo en una sola ejecución, de forma incremental. Las notas guardan en el almacén un
  manifiesto de tamaño, hora de modificación y hash del contenido, así que los archivos sin cambios no se leen y
  los idénticos no se guardan. Un bloqueo impide dos ejecuciones a la vez; una fuente que falla no detiene las
  demás.
- `memo auto on [--every 5m] | off | status`: un temporizador de usuario de systemd para `memo import`. El
  `auto: { enabled, every }` de la configuración es la referencia; el temporizador sigue una edición manual en su
  siguiente ejecución.
- `memo context <messenger>:<person>`: una sola respuesta sobre una persona: el contexto de persona de
  cli-messaging en todas las identidades vinculadas (incluido el correo), la nota sobre ella y las notas que la
  nombran, con lo que no se leyó y por qué. Necesita cli-messaging 0.150.0, que fijan tg y max.
- Las notas se vectorizan para la búsqueda por significado: `memo import` y `memo notes import` procesan cada
  carpeta cambiada y vectorizan los fragmentos nuevos con el modelo local e5-small, como máximo 600 por ejecución,
  y continúan en la siguiente; `--no-embed` y `notes.embed: false` lo omiten. `memo notes search` ordena por
  significado y por palabras a la vez (`by` en cada resultado) y recurre a las palabras cuando falta el modelo.
- cli-messaging 0.153.0, como fijan tg y max: una nota o un correo largos se vectorizan enteros, en fragmentos
  que se solapan.

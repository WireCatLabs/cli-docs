# Scenario improvements — 3 October 2026

## Delivered locally

- Replaced learning-command copy with shared-store benefits: search both Telegram and MAX and bring agreements/files together from saved history. Native logins remain separate.
- Reordered eight scenarios: context, recommendations across chats/messengers, group management, inbox, commitments, scheduled sends, files, customer bot.
- Course-search examples use fictional participant reviews, not verified real-world course endorsements. Mixed Telegram/MAX results preserve their original provider and source locator.
- Added Telegram/MAX switching inside the scenario window. Stable scenario IDs survive switching and are shareable in the URL. Legacy numeric links still resolve.
- Every request has a copy button and a platform-matched setup link. Delegated event handling works after switching and replay; clipboard failure selects the request text.
- Evidence links expand demo message excerpts with chat, messenger, date and message ID. They are clearly identified as illustrative messages rather than live account links. Citations quote actual prior results in the demonstration.
- Group management previews saved-rule violations with dry-run, then deletes only the two messages explicitly approved. It does not remove members or execute the whole proposed moderation batch.
- Actual MAX differences are explicit: personal `chats check`, `--output` for downloads, local-model transcription, and MAX bot message ID shape. Bot-local examples use offline reads.

## Calibration decision

The owner chose to keep editable assumptions until paired real manual/agent task timings are available. No account messages were read and no live moderation/sends were performed. Existing technical offline fixtures are not human-time benchmarks and were not used to claim measured savings or improved accuracy.

## Validation

Local lint, types, 32 tests and static production build pass. Internal links pass. Browser checks cover eight scenarios in EN/RU/ES, MAX syntax, mixed-provider locators, clipboard/setup links, evidence expansion, retained selection, and five widths from 320 to 1440px. No horizontal overflow or JavaScript errors. Existing calculator assumptions remain unchanged.

Remote CI and deployment were not run. Local preview is http://localhost:4317/ru.

# MAX documentation review — Spanish

Reviewed usage, MCP, security and the changelog against released v0.23.0 pages on 2026-10-03. Translations preserve examples, inline literals, destinations and heading hierarchy. No external model or translation services were used. The changelog preserves historical statements at their release versions; those statements do not override current guidance.

## Important facts retained

- MAX personal sessions and bot profiles are separate identities. Read-only profiles and owner-configured action permissions constrain both CLI and MCP actions.
- The default personal MCP server reads only; sending and account management must be enabled explicitly. Bot MCP has its own token, read-only setting and consent controls.
- Account message reads do not mark chats as read. Search and stored bot messages use local data, whose completeness depends on prior fetching or received updates.
- MAX has no Telegram-style forum topics. The shared `--topic` argument is rejected without sending anything.
- The shared local message archive contains plaintext messages and transcripts. Keychain fallback, environment-variable precedence, local tokens and personal-account access risks remain explicit.
- MAX uses an unofficial personal-account protocol; upstream warns about protocol changes, blocking and privacy consequences. The bot API is a distinct integration.
- Confirmed and unknown send outcomes differ; scripts must not assume that a timeout proves a message was not sent.

## Findings and verified resolutions

1. Scheduled-send limits: corrected usage after checking v0.23 client code and send-guard tests. Restrictions are checked when queuing; the hourly reservation belongs to the scheduled send hour.
2. Local deletion: verified v0.23 `src/commands/cache.ts` and `src/record.ts`. Without `--left`, `max cache clear` removes the profile's legacy cache and records for this MAX personal account from the shared database. Other accounts remain; exports, attachments and backups are separate. The safety guide now states this scope and avoids promising full reconstruction.
3. File permissions: replaced universal 0600 claims with specific state/configuration/redirected-output behavior.
4. Message search: updated usage to describe short queries, typo correction and fallback matching while keeping the distinct name-filter limit.
5. Group flags: **no defect in the examples**. Frozen v0.23 `src/commands/chats.ts` and current reference still support personal `--event` and `--since`; they were retained.
6. Shell error handling: corrected the inverted `if !` example after translation validation. Stub-only checks cover status 0, 4 and 14 without sending real messages.
7. MCP formatting: **no defect in the table**. Frozen v0.23 `src/mcp/tools.ts` still defines and forwards the `markdown` parameter; it was retained.
8. Legal wording: replaced blanket legal assurances with documented storage/export behavior without asserting a legal exemption.

Reviewed errata are applied from `scripts/docs-corrections.json` after validating immutable translation examples; each before-text must match exactly once. Future release changes require review instead of silently applying old corrections. Remote-access service availability and end-to-end proxy setup remain explicitly unverified, as stated in the guide.

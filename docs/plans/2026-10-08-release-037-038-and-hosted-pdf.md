# Release 0.37/0.38 and hosted PDF check

Owner approved continuing the prepared MAX0.37/TG0.38 release, documentation refresh and real hosted-client PDF test. They selected ChatGPT Work / Codex web.

1. Verify prepared release reports, publication workflows, GitHub tags and npm versions. Avoid duplicate publication if another release process is already running. MAX's signed report pins 3d94fcb3de09fa9941df4ac904369f6e57c63aa8; Telegram0.38 is already published.
2. Refresh portal pins from current main e70b784. Review changed native sources and English/Russian/Spanish translations, retained errata, command references and shared version statements. Retire immutable guide overrides when the release itself contains the reviewed prose. Validate and deploy.
3. Prepare an isolated four-page PDF fixture behind native HTTP MCP and a temporary authenticated HTTPS route. The client's connector must expose the tools to this hosted ChatGPT session; do not equate a scripted HTTP client with an actual hosted-client pass. Use fixture-only text/index writes, no messenger sends or OCR gateway calls. Keep OAuth enabled and message writes denied. Document exactly which host/tool calls succeed and remove only owned temporary processes/routes after the test.

The current chat offers no MAX/TG MCP tools, plugin search found no WireCat listing, and Funnel has no active routes. Prepare the concrete endpoint and connection instructions before requesting the missing hosted-client attachment.

Recovery update: Tailscale refused serve configuration and sudo remains denied. Use an owned Cloudflare Quick Tunnel without privileged configuration. Quick Tunnels do not support SSE; a fixture-only loopback adapter buffers finite MCP POST responses as JSON and rejects optional GET event streams. OAuth and the native tool handlers remain in the installed MAX0.37 server. This test route is not a production transport recommendation.

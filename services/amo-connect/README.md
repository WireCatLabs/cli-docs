# amo-connect

The server side of amo's one-click amoCRM sign-in. amoCRM's consent for an external integration creates a WireCat
integration in the chosen account and posts the integration's ID and secret key to this service. `amo` on the person's computer then claims
them once. It runs on neirox (Selectel, Saint Petersburg) as `https://connect.wirecat.dev`, because amoCRM's servers
are in Russia and cannot reach Cloudflare, which serves wirecat.dev.

- [What it serves](#what-it-serves)
- [Run it locally](#run-it-locally)
- [Deploy to neirox](#deploy-to-neirox)
- [Security notes](#security-notes)

## What it serves

| Path | What |
| --- | --- |
| `GET /connect/amo.html` | The page with the button that opens amoCRM's consent. `amo` opens it with `#state=<port>.<random>`. |
| `GET /connect/amo.js`, `/connect/wirecat-amo-logo.png` | Its script and the logo amoCRM shows. |
| `GET /webhooks/apps/amo-callback` | The new integration's Redirect URI. It forwards `code` and `state` to `http://127.0.0.1:<port>`. |
| `POST /api/amo/secrets` | amoCRM's webhook: JSON or a form with `client_id`, `client_secret`, `state`. Empty 200. |
| `POST /api/amo/claim` | `{"state": …}` returns the pair once, then forgets it. `404 {"error":"not_ready"}` before. |

The pair is kept in memory for 600 seconds, under sha256 of the state, at most 1000 at a time. A restart loses
pending sign-ins; the person then clicks the button again.

The `--client-id` sign-in still uses the static `https://wirecat.dev/webhooks/apps/amo-callback`, which the owner
types into their own integration.

## Run it locally

```sh
node services/amo-connect/server.mjs
```

It listens on `PORT` (8080 by default). The tests are `scripts/amo-connect.test.ts` (`pnpm exec vitest run
scripts/amo-connect.test.ts`).

## Deploy to neirox

Caddy on neirox (container `caddy`, network `kamal`) serves `connect.wirecat.dev` from
`/etc/caddy/conf.d/connect.wirecat.caddyfile`:

```caddyfile
connect.wirecat.dev {
  reverse_proxy amo-connect:8080
  header -Server
}
```

It has no `log` block on purpose: a Caddy access log keeps the query string, and the callback's query holds the
sign-in code and state.

To build and restart, from the repository root:

```sh
rsync -a --delete -e "ssh -p 25222" services/amo-connect/ kulibin@139.100.204.107:amo-connect/
ssh -p 25222 kulibin@139.100.204.107 '
  docker build -q -t amo-connect:latest ~/amo-connect &&
  (docker rm -f amo-connect >/dev/null 2>&1; true) &&
  docker run -d --name amo-connect --network kamal --restart unless-stopped \
    --memory 64m --memory-swap 64m --pids-limit 64 --read-only --tmpfs /tmp:size=1m \
    --cap-drop ALL --security-opt no-new-privileges --user node amo-connect:latest &&
  docker exec caddy wget -qO- http://amo-connect:8080/connect/amo.html | head -3'
```

DNS: `connect.wirecat.dev` is an A record to `139.100.204.107`, DNS only (not proxied by Cloudflare). Caddy gets
its certificate from Let's Encrypt once the record resolves.

## Security notes

- The connect page draws its own button and opens amoCRM's consent URL itself, the same URL amoCRM's button script
  (`www.amocrm.ru/auth/button.min.js`) builds. That script waited for `window.onload` and did not draw its button in
  every browser, and it moves the window to any `url` posted to it. No outside script runs on either page.
- The consent opens with `mode=post_message`: amoCRM sends the consent window itself to the callback, which hands the
  code to `amo`. With `mode=popup` amoCRM closes that window and posts the callback address to this page instead,
  which the page would have to trust; in a live run nothing arrived and `amo` kept waiting.
- The connect page removes the `#state` fragment first: `location.href` goes to amoCRM as the origin.
- Both pages load their script from a file, so the CSP is `script-src 'self'` with no `'unsafe-inline'`.
- Every answer carries HSTS, `nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` and `noindex`.
- Bodies over 4 KB are refused. A refused webhook logs only its content type and field names, never a value.
  Nothing else is logged.
- Files are read into memory at start; a request path never reaches the file system.

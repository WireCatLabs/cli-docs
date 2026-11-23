# Russian copy of wirecat.dev

Russian providers throttle Cloudflare: a page from Cloudflare Pages stalls after about 16 KB for a reader in Russia
([Cloudflare's report](https://blog.cloudflare.com/russian-internet-users-are-unable-to-access-the-open-internet/)).
So wirecat.dev has a second copy on neirox (Selectel, Saint Petersburg, `139.100.204.107`), and geo DNS sends readers
in Russia there. Everyone else keeps Cloudflare Pages.

- [How it fits together](#how-it-fits-together)
- [Deploys](#deploys)
- [Certificates](#certificates)
- [Set up or rebuild on neirox](#set-up-or-rebuild-on-neirox)
- [Geo DNS](#geo-dns)
- [Check it](#check-it)

## How it fits together

| Part | Where | What it does |
|---|---|---|
| `caddy` | neirox, network `kamal`, ports 80 and 443 | The shared web server of every site on neirox. Built from [`../caddy/Dockerfile`](../caddy/Dockerfile) with the Cloudflare DNS module. |
| `/etc/caddy/conf.d/wirecat.dev.caddyfile` | neirox | [`wirecat.dev.caddyfile`](wirecat.dev.caddyfile): TLS for wirecat.dev, proxied to `wirecat-site`. |
| `wirecat-site` | neirox, network `kamal`, no published port | A second Caddy that serves `/home/kulibin/wirecat-site/public` the way Pages does: [`Caddyfile`](Caddyfile). |
| `/home/kulibin/wirecat-site/public` | neirox | The built site (`out/` plus `registry/v1`), about 1.9 GB. |

The headers in [`Caddyfile`](Caddyfile) repeat [`public/_headers`](../../public/_headers). Change both together.

## Deploys

The deploy job in [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) publishes to Pages and then
rsyncs the same `out/` to neirox. The copy has to follow every deploy: the signed WireCat Desktop tools list
(`registry/v1/desktop-tools.json`) expires, and Desktop refuses an expired list.

- The secret `NEIROX_DEPLOY_KEY` (environment `production`) is an ed25519 key. In `~kulibin/.ssh/authorized_keys` it
  is limited to `command="/usr/bin/rrsync /home/kulibin/wirecat-site/public",restrict`: it can only rsync into that
  folder. Its comment is `wirecat-site deploy (GitHub Actions)`.
- The host key is pinned in the workflow.
- No `--delay-updates`: the disk has a few GB free and a second copy of the changed files does not fit.

To replace the key: make a new one, put its public half in `authorized_keys` with the same restriction (remove the old
line), and `gh secret set NEIROX_DEPLOY_KEY --env production -R WireCatLabs/cli-docs < key`.

## Certificates

Let's Encrypt checks a domain from outside Russia. With geo DNS it would see Pages, not neirox, so the usual HTTP check
fails. Caddy proves the domain with a DNS record instead (`tls { dns cloudflare … }`).

- `/home/kulibin/caddy-cloudflare.env` (mode 600) holds `CF_API_TOKEN`, a Cloudflare token named
  `caddy neirox: DNS-01 for wirecat.dev`. It may only read the zone and edit DNS records of wirecat.dev, and only from
  `139.100.204.107`.
- `caddy` gets it with `--env-file`. Caddy renews on its own.

## Set up or rebuild on neirox

Build Caddy on a bigger machine (neirox has 2 GB of memory), then load it:

```sh
docker build -t caddy-cloudflare:2.11.4 services/caddy
docker save caddy-cloudflare:2.11.4 | gzip -1 | ssh -p 25222 kulibin@139.100.204.107 docker load
```

Validate the configuration with the new image, then swap the container (other sites on neirox pause for seconds):

```sh
docker run --rm -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile:ro -v /etc/caddy/conf.d:/etc/caddy/conf.d:ro \
  caddy-cloudflare:2.11.4 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker rename caddy caddy-old && docker stop caddy-old
docker run -d --name caddy --restart unless-stopped --network kamal -p 80:80 -p 443:443 -p 443:443/udp \
  -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile:ro -v /etc/caddy/conf.d:/etc/caddy/conf.d:ro \
  -v /var/log/caddy:/var/log/caddy -v caddy_data:/data -v caddy_config:/config \
  --log-opt max-size=50m --log-opt max-file=5 --env-file /home/kulibin/caddy-cloudflare.env caddy-cloudflare:2.11.4
```

The site container. Caddy's binary carries the bind capability, so it needs `NET_BIND_SERVICE` in the set even on
port 8080:

```sh
docker run -d --name wirecat-site --network kamal --restart unless-stopped --read-only \
  --memory 96m --memory-swap 96m --pids-limit 64 --cap-drop ALL --cap-add NET_BIND_SERVICE \
  --security-opt no-new-privileges --user 1000:1000 --tmpfs /data:size=1m --tmpfs /config:size=1m \
  -v /home/kulibin/wirecat-site/public:/srv:ro -v /home/kulibin/wirecat-site/conf/Caddyfile:/etc/caddy/Caddyfile:ro \
  caddy:2-alpine
```

`/etc/caddy/conf.d` belongs to root: write files there with `sudo tee`, then
`docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force`.

## Geo DNS

A Cloudflare load balancer in DNS-only mode answers `139.100.204.107` to resolvers in Russia and Pages to everyone
else. It is in the account `ModelRow leemour` (`95adf467c9937e5fdca37a0cb07fa70a`), which holds the zone, and needs
Load Balancing with Traffic Steering ($5 + $10 a month). A load balancer takes precedence over a DNS record with the
same name, so the apex CNAME to `cli-docs.pages.dev` stays, and so do the MX and TXT records.

| Part | Id | Setting |
|---|---|---|
| Monitor `wirecat.dev /ru` | `5fdc3ee6bfc62cc2325cb5a4f1df9fc4` | HTTPS `GET /ru`, `Host: wirecat.dev`, expects 200, every 60 s |
| Pool `wirecat-ru` | `11afb551b2a386077c41f1cd889f449c` | `139.100.204.107`, checked from Eastern Europe |
| Pool `wirecat-world` | `fa4300c2df5fb87774731327006b5538` | `cli-docs.pages.dev` with `Host: cli-docs.pages.dev` ([Pages as an origin](https://developers.cloudflare.com/load-balancing/pools/cloudflare-pages-origin/)) |
| Load balancer `wirecat.dev` | `339b010e22b3723d1ebcfebdf2d181db` | `steering_policy: geo`, `RU: [ru, world]`, default `[world, ru]`, fallback world, TTL 60 |
| Load balancer `geo-test.wirecat.dev` | `7a3eed63df2990402cf9db8f2cc8194c` | The same, for trying a change first |

If neirox fails its monitor, Russia falls back to Pages. To undo geo DNS, delete the `wirecat.dev` load balancer:
the CNAME answers again.

## Check it

From here, through neirox's address, with no DNS change:

```sh
curl -sI --resolve wirecat.dev:443:139.100.204.107 https://wirecat.dev/ru
```

What a reader in Russia gets, from a server in Russia (neirox uses Selectel's resolvers):

```sh
dig +short wirecat.dev
dig +short wirecat.dev @77.88.8.8
```

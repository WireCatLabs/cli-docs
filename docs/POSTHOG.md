# PostHog setup for wirecat.dev

The site sends analytics to PostHog Cloud EU only when `analytics.posthogKey` in `site.config.json`
is set. Until then nothing loads and no banner appears. Do these steps once, in this order.

Each step is marked **[docs]** when PostHog's documentation describes it (link given), or
**[inferred]** when the menu path comes from experience and may be named differently in the UI.

## 1. Create the project in the EU region

1. Sign up or log in at <https://eu.posthog.com>, not `us.posthog.com`. PostHog Cloud EU is
   hosted in Frankfurt. **[docs]** ([data storage](https://posthog.com/docs/privacy/data-storage))
   As far as I know the region cannot be changed later. **[inferred]**
2. Create a project named `wirecat.dev`. **[inferred]**

## 2. Turn on cookieless counting

Without this, every event from a visitor who declined or did not answer is dropped.

1. **Settings → Web analytics → Cookieless tracking** (older docs: "Cookieless server hash mode"):
   turn it on. **[docs]** ([ingestion warnings](https://posthog.com/docs/data/ingestion-warnings))
   With the switch off, PostHog answers `200 {"status":"Ok"}` and then discards the event, so the
   site looks healthy while the dashboard stays empty. Through the API it is
   `cookieless_server_hash_mode: 2`.

GeoIP and bot detection do not enrich events while this mode is on; the world map stays empty.

## 3. Stop storing IP addresses

1. **Project settings → IP data capture configuration → Discard client IP data**: turn it on.
   **[docs]** ([data storage](https://posthog.com/docs/privacy/data-storage))

## 4. Session replay

The site already masks all text and inputs in code (`maskTextSelector: "*"`, `maskAllInputs`) and
starts recording only after Accept. The project switch must still be on.

1. **Project settings → Session replay → Record user sessions**: turn it on. **[inferred]**
2. In the same page, turn on masking of all inputs and all text if offered, so the project setting
   matches the code. **[inferred]**
3. **Session replay settings → Data retention**: choose **30 days** (the free-plan maximum). The
   privacy page promises 30 days. **[docs]**
   ([replay retention](https://posthog.com/docs/session-replay/data-retention))
4. Leave network-request and console-log capture off. **[inferred]**

## 5. Turn off what the site does not use

The code already disables autocapture, heatmaps, dead clicks, exceptions and surveys. Turning the
project switches off as well keeps a future code change from silently enabling them.

1. **Project settings → Autocapture**: off; **Heatmaps**: off; **Web vitals**: off;
   **Surveys**: off. **[inferred]**

## 6. Allow only wirecat.dev

1. **Toolbar → Authorized URLs** (also used by web analytics): add `https://wirecat.dev` and
   remove anything else. **[docs]** ([toolbar](https://posthog.com/docs/toolbar))

## 7. Filter internal traffic

1. **Project settings → Product analytics → Filter out internal and test users**: add a filter,
   for example `$host` equals `localhost`, then turn on the filter by default. **[inferred]**

The site already refuses to load analytics anywhere except `wirecat.dev`, so this is a safety net.

## 8. Event retention

PostHog sets event retention by plan, and it cannot be shortened: 1 year on the free plan, 7 years on
paid plans ([events retention](https://posthog.com/docs/data/events-retention)). The privacy page in
`lib/privacy.ts` promises "up to 12 months", which matches the free plan. Moving to a paid plan means
rewriting that line in all three languages, or exporting and deleting events after 12 months yourself.

## 9. Sign the DPA

1. Open <https://app.posthog.com/legal>; it sends you to your region.
2. **+ New → Data Processing Agreement (DPA)**, fill in the details, **Send for signature**, sign the
   email from PandaDoc. It is free on every plan. **[docs]**
   ([how to get a signed DPA](https://posthog.com/docs/privacy#how-do-i-get-a-signed-dpa))

## 10. Paste the key

1. **Project settings → Project API key** (starts with `phc_`): copy it. It is the public key the
   browser sends with every event, not a secret. **[inferred]**
2. Put it in `site.config.json` as `analytics.posthogKey` and open a pull request. The keyed
   browser checks in `tests/mobile-delivery.spec.ts` run once the key is set.

## 11. Remove the old providers

Delete the Google Analytics 4 property `G-GKZ1KFCJ0E` and the Yandex Metrika counter `113377132`
in their own consoles once PostHog shows traffic.

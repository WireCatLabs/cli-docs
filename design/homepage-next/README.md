# WireCat homepage: second exploration

Three implemented English homepages based on the compact visual mockups the owner liked at port 38999. Broad project positioning covers conversations, email and notes; current messaging tools are Telegram and MAX, email uses third-party Himalaya, notes use Obsidian, and additional messengers are future direction.

```sh
node design/homepage-next/build.mjs
node design/homepage-next/serve.mjs 4326
```

Routes: `/` comparison, `/guided`, `/workspace`, `/connections`, `/references` preserved original mockups. Original raster files are copied unchanged from `cli-docs-wt-user-docs-service-home-20261007/.impeccable/mocks/decision/about-*.png`; they remain reference artifacts, not the new pages. The earlier six-page exploration remains at port4325.

Running user services: `wirecat-homepage-preview.service` (4325), `wirecat-homepage-next.service` (4326). Restart with `systemctl --user restart <unit>`. Stop with `systemctl --user stop <unit>`. These transient services outlive the chat session and are not enabled at boot.

Build source: `build.mjs`; behavior: `interactions.js`; design: `styles.css`. Source disclosures, four example tabs, feature-to-example links, copy requests/installation, messenger choice, and persisted theme work locally. Examples do not invoke live messaging actions. Setup links lead to public docs. Pages and server responses are noindex.

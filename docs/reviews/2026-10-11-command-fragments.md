# Command reference navigation

Reader: someone opening an existing Telegram or MAX command link who should reach the
matching command in the personal, bot or administration reference.

Base: `a44326c`. The earlier deployment and local browser traces showed a race: a fragment
navigation could arrive before hydration, then Next.js restored the index URL without its
fragment before the redirect effect ran. This left the reader on the reference index.

The index now remembers fragments while its initial HTML is parsed. The client redirect
consumes that value and uses a browser replacement to reach the existing partition and anchor.
Command-name links keep their text and monospace appearance with fewer nested elements.
Generated command sources, release pins, routes and Markdown remain unchanged.

| Pages and locales | Reader task | Review and evidence |
| --- | --- | --- |
| tg/commands, en/ru/es | Open an older command link | Existing administration and bot anchors checked against the unchanged browser suite; early-fragment trace identifies the hydration race |
| max/commands, en/ru/es | Same task | Same shared rendering and redirect; owning command-group mapping remains unchanged |
| Both command indexes | Choose a reference or find a command | Links, localized labels and full Markdown destination retained; existing DOM-size guard retained |

The bootstrap is static source with no interpolated data. Redirect destinations retain the
fixed locale/tool path and the original fragment. No messenger account or personal data is used.

Checks: lint/browser structure, type checking, 275 unit tests and production export pass.
All six unchanged command-reference browser cases pass against the export, including both
legacy destinations, the index size guard and full Markdown. The timing guard passes with
20% timeout headroom. Full deployment checks and public-route verification follow publication.

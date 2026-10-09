<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Documentation work

Before writing or reviewing documentation, read [docs/AUTHORING.md](docs/AUTHORING.md). Also read [docs/TERMINOLOGY.md](docs/TERMINOLOGY.md) and follow [docs/REVIEWING.md](docs/REVIEWING.md) for every documentation PR or release update. Every user guide opens with its use case and the result the reader will get. Keep titles short, preserve reviewed release facts, and give every sidebar page a relevant decorative icon. Read [docs/STRUCTURE.md](docs/STRUCTURE.md) for source ownership; generated messenger pages are not edited directly.

For routine local documentation edits, follow [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md):
use the browser smoke suite and targeted checks. Full export and browser coverage run in CI.

import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const dist = resolve(dirname(require.resolve("@leemour/cli-messaging/services")), "..")
const core = resolve(dirname(require.resolve("@leemour/cli-core")), "errors.js")
const sanitize = resolve(dirname(core), "sanitize.js")
const files = ["parser", "registry", "dates", "automaton", "types"]
const inputs = [
  ...files.map((name) => resolve(dist, `search/lucene/${name}.js`)),
  resolve(dist, "store/normalize.js"),
  core,
  sanitize,
]
const fingerprint = createHash("sha256")
  .update(inputs.map((file) => readFileSync(file)).join("\n"))
  .digest("hex")
const input = `${files
  .filter((name) => name !== "types")
  .map((name) => `export * from ${JSON.stringify(resolve(dist, `search/lucene/${name}.js`))};`)
  .join("\n")}\nexport { normalize } from ${JSON.stringify(resolve(dist, "store/normalize.js"))};`
const result = await build({
  stdin: { contents: input, resolveDir: dist },
  bundle: true,
  platform: "browser",
  format: "esm",
  minify: true,
  write: false,
  // The parser needs only cli-core's browser-safe parts: CliError, and singleLine for tag names.
  plugins: [
    {
      name: "cli-core-browser",
      setup(build) {
        build.onResolve({ filter: /^@leemour\/cli-core$/ }, () => ({ path: "cli-core", namespace: "cli-core" }))
        build.onLoad({ filter: /.*/, namespace: "cli-core" }, () => ({
          contents: `export * from ${JSON.stringify(core)}; export * from ${JSON.stringify(sanitize)};`,
          resolveDir: dirname(core),
        }))
      },
    },
  ],
  legalComments: "inline",
})
const header = `// Generated from pinned @leemour/cli-messaging. Source SHA-256: ${fingerprint}\n// Apache Lucene notices: /search-language-notices.txt\n`
const outputs = {
  "lib/search-language.generated.js": header + result.outputFiles[0].text,
  "lib/search-language.generated.d.ts": `import type { QueryAst, QueryNode } from '@leemour/cli-messaging/services';\nexport type { QueryAst, QueryNode };\nexport declare function parseLucene(text: string): QueryAst;\nexport declare function validateFields(ast: QueryAst): QueryAst;\nexport declare function normalize(text: string): string;\nexport declare function compileAutomaton(pattern: string): { test(text: string): boolean };\nexport declare function wildcardPattern(value: string): string;\nexport declare function dateRange(lower: string, upper: string, lowerInclusive: boolean, upperInclusive: boolean, zone: string, span: {start: number; end: number}): { lower?: number; upper?: number; lowerInclusive: boolean; upperInclusive: boolean };\nexport declare const QUERY_FIELDS: readonly {name: string; support: string; type: string; operators: readonly string[]; values?: readonly string[]; example: string}[];\n`,
  "public/search-language-notices.txt":
    readFileSync(resolve(dist, "../THIRD_PARTY_NOTICES"), "utf8") +
    "\nBrowser error adapter: CliError from @leemour/cli-core (MIT).\n" +
    readFileSync(resolve(dirname(core), "../LICENSE"), "utf8"),
}
for (const [file, content] of Object.entries(outputs)) {
  if (process.argv.includes("--check")) {
    if (readFileSync(file, "utf8") !== content) throw new Error(`Regenerate ${file}: pnpm search:generate`)
  } else writeFileSync(file, content)
}
console.log(
  `search language: ${fingerprint.slice(0, 12)}, ${result.outputFiles[0].text.length} bytes, browser bundle verified`,
)

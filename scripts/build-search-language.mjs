import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const dist = resolve(dirname(require.resolve("@wirecat/cli-core/services")), "..")
const core = resolve(dirname(require.resolve("@wirecat/cli-base")), "errors.js")
const sanitize = resolve(dirname(core), "sanitize.js")
const query = resolve(dirname(require.resolve("@wirecat/cli-base/query")))
const lucene = (name) => resolve(dist, `search/lucene/${name}.js`)
const entries = [
  ["parseLucene", resolve(query, "parser.js")],
  ["dateRange", resolve(query, "dates.js")],
  ["QUERY_FIELDS, validateFields", lucene("registry")],
  ["compileAutomaton, wildcardPattern", lucene("automaton")],
  ["normalize", resolve(dist, "store/normalize.js")],
]
const inputs = [
  ...["parser", "dates", "types", "validate", "fields", "registry"].map((name) => resolve(query, `${name}.js`)),
  ...["registry", "automaton", "types"].map(lucene),
  resolve(dist, "store/normalize.js"),
  resolve(dist, "domain/tags.js"),
  core,
  sanitize,
]
const fingerprint = createHash("sha256")
  .update(inputs.map((file) => readFileSync(file)).join("\n"))
  .digest("hex")
const input = entries.map(([names, file]) => `export { ${names} } from ${JSON.stringify(file)};`).join("\n")
const result = await build({
  stdin: { contents: input, resolveDir: dist },
  bundle: true,
  platform: "browser",
  format: "esm",
  minify: true,
  write: false,
  // The parser needs only cli-base's browser-safe parts: CliError, and singleLine for tag names.
  plugins: [
    {
      name: "cli-base-browser",
      setup(build) {
        build.onResolve({ filter: /^@wirecat\/cli-base$/ }, () => ({ path: "cli-base", namespace: "cli-base" }))
        build.onLoad({ filter: /.*/, namespace: "cli-base" }, () => ({
          contents: `export * from ${JSON.stringify(core)}; export * from ${JSON.stringify(sanitize)};`,
          resolveDir: dirname(core),
        }))
      },
    },
  ],
  legalComments: "inline",
})
const header = `// Generated from pinned @wirecat/cli-core. Source SHA-256: ${fingerprint}\n// Apache Lucene notices: /search-language-notices.txt\n`
const outputs = {
  "lib/search-language.generated.js": header + result.outputFiles[0].text,
  "lib/search-language.generated.d.ts": `import type { QueryAst, QueryNode } from '@wirecat/cli-base/query';\nexport type { QueryAst, QueryNode };\nexport declare function parseLucene(text: string): QueryAst;\nexport declare function validateFields(ast: QueryAst): QueryAst;\nexport declare function normalize(text: string): string;\nexport declare function compileAutomaton(pattern: string): { test(text: string): boolean };\nexport declare function wildcardPattern(value: string): string;\nexport declare function dateRange(lower: string, upper: string, lowerInclusive: boolean, upperInclusive: boolean, zone: string, span: {start: number; end: number}): { lower?: number; upper?: number; lower_inclusive: boolean; upper_inclusive: boolean };\nexport declare const QUERY_FIELDS: readonly {name: string; support: string; type: string; operators: readonly string[]; values?: readonly string[]; example: string}[];\n`,
  "public/search-language-notices.txt":
    readFileSync(resolve(dist, "../THIRD_PARTY_NOTICES"), "utf8") +
    "\nBrowser error adapter: CliError from @wirecat/cli-base (MIT).\n" +
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

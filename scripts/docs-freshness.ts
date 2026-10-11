/**
 * Which tool docs lag the newest npm release: `docsRef` in tools.json (synced tools) and
 * authored-docs.json (guides written in this repository). Needs the network, so it stays out of
 * ci:quick and vitest runs it only with a stubbed registry.
 *
 *   pnpm docs:freshness    exits 1 when any tool's docs describe an older release
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { newerVersion, requestJson } from "./docs-updates.ts"

export type VersionRecord = { name: string; package: string; docsRef: string; pages?: string[] }
export type Freshness = VersionRecord & { source: string; latest: string; lagging: boolean }

type JsonRequest = (url: string) => Promise<unknown>

export async function checkFreshness(
  records: (VersionRecord & { source: string })[],
  getJson: JsonRequest = requestJson,
): Promise<Freshness[]> {
  return Promise.all(
    records.map(async (record) => {
      const { version } = (await getJson(
        `https://registry.npmjs.org/${encodeURIComponent(record.package)}/latest`,
      )) as { version: string }
      return { ...record, latest: version, lagging: newerVersion(version, record.docsRef) }
    }),
  )
}

export function freshnessReport(rows: Freshness[]): string {
  const lines = rows.map(
    (row) =>
      `${row.lagging ? "LAGS   " : "current"}  ${row.name.padEnd(5)} docs ${row.docsRef.padEnd(8)} npm ${row.latest.padEnd(8)} (${row.source})`,
  )
  const lagging = rows.filter((row) => row.lagging)
  if (!lagging.length) return `${lines.join("\n")}\n\nAll tool docs describe the newest npm release.`
  const next = lagging.map((row) =>
    row.source === "tools.json"
      ? `- ${row.name}: pnpm docs:updates --prepare, then review per docs/REVIEWING.md`
      : `- ${row.name}: read the changelog since ${row.docsRef}, update content/docs/{${(row.pages ?? []).join(",")}}*.mdx in every locale, then raise docsRef in authored-docs.json`,
  )
  return `${lines.join("\n")}\n\nDocs to update:\n${next.join("\n")}`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const read = (file: string, source: string) =>
    (JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), "utf8")) as VersionRecord[]).map((record) => ({
      ...record,
      source,
    }))
  const rows = await checkFreshness([
    ...read("tools.json", "tools.json"),
    ...read("authored-docs.json", "authored-docs.json"),
  ])
  console.log(freshnessReport(rows))
  if (rows.some((row) => row.lagging)) process.exitCode = 1
}

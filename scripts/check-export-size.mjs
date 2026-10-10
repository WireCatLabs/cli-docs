import { readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

export const pagesAssetLimit = 25 * 1024 * 1024

export function oversizedAssets(directory, limit = pagesAssetLimit) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return oversizedAssets(path, limit)
    const bytes = statSync(path).size
    return bytes > limit ? [{ path, bytes }] : []
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const problems = oversizedAssets(process.argv[2] ?? "out")
  for (const { path, bytes } of problems)
    console.error(`${path}: ${(bytes / 1024 / 1024).toFixed(2)} MiB exceeds Pages' 25 MiB limit`)
  if (problems.length) process.exit(1)
  console.log("Export assets: every file fits the Pages 25 MiB limit")
}

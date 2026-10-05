import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { serveExport } from "./serve-export.mjs"

it("serves rebuilt HTML and CSS instead of stale compressed responses", async () => {
  const directory = mkdtempSync(join(tmpdir(), "wirecat-export-cache-"))
  const server = await serveExport(directory)
  try {
    for (const [file, path] of [
      ["en.html", "/en"],
      ["asset.css", "/asset.css"],
    ]) {
      writeFileSync(join(directory, file), "before")
      const before = await fetch(server.url + path, { headers: { "Accept-Encoding": "gzip" } })
      expect(before.headers.get("Content-Encoding")).toBe("gzip")
      expect(await before.text()).toBe("before")
      writeFileSync(join(directory, file), "after!")
      expect(await (await fetch(server.url + path, { headers: { "Accept-Encoding": "gzip" } })).text()).toBe("after!")
    }
  } finally {
    await server.close()
    rmSync(directory, { recursive: true, force: true })
  }
})

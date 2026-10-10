import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { gzipSync } from "node:zlib"
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

it("serves precompressed search assets as JSON without compressing them twice", async () => {
  const directory = mkdtempSync(join(tmpdir(), "wirecat-search-export-"))
  const data = { type: "i18n", data: { es: { content: "café y mensajes" } } }
  mkdirSync(join(directory, "api/search"), { recursive: true })
  writeFileSync(join(directory, "api/search/es"), gzipSync(JSON.stringify(data)))
  const server = await serveExport(directory)
  try {
    const response = await fetch(`${server.url}/api/search/es`)
    expect(response.headers.get("Content-Encoding")).toBe("gzip")
    expect(response.headers.get("Content-Type")).toContain("application/json")
    expect(await response.json()).toEqual(data)
  } finally {
    await server.close()
    rmSync(directory, { recursive: true, force: true })
  }
})

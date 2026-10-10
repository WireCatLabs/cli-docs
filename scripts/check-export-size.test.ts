import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { oversizedAssets } from "./check-export-size.mjs"

it("catches oversized nested assets while accepting the exact limit", () => {
  const directory = mkdtempSync(join(tmpdir(), "wirecat-asset-limit-"))
  try {
    mkdirSync(join(directory, "api"))
    writeFileSync(join(directory, "at-limit"), "12345")
    const path = join(directory, "api/search")
    writeFileSync(path, "123456")
    expect(oversizedAssets(directory, 5)).toEqual([{ path, bytes: 6 }])
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

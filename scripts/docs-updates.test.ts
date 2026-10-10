import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it, vi } from "vitest"
import {
  checkToolRelease,
  newerVersion,
  notifyUpdates,
  prepareUpdates,
  publishedTogether,
  type ReleaseUpdate,
  releaseChanges,
  stableVersion,
  updateReport,
} from "./docs-updates.ts"

const tool = {
  name: "tg",
  repo: "WireCatLabs/tg-cli",
  package: "@wirecat/tg-cli",
  lang: "en",
  docsRef: "v0.24.0",
  summary: {},
}
const release = { tag_name: "v0.25.0", draft: false, prerelease: false, published_at: "2026-10-03T00:00:00Z" }
const fixture: ReleaseUpdate = {
  tool: "tg",
  repo: tool.repo,
  current: "v0.24.0",
  latest: "v0.25.0",
  npm: "0.25.0",
  published: true,
  releaseUrl: "https://github.com/WireCatLabs/tg-cli/releases/tag/v0.25.0",
  compareUrl: "https://github.com/WireCatLabs/tg-cli/compare/v0.24.0...v0.25.0",
  pages: ["docs/search.md"],
  changesComplete: true,
  review: ["Review translations"],
}
describe("published docs release updates", () => {
  it("compares stable versions numerically without accepting prereleases or unsafe refs", () => {
    expect(newerVersion("v0.10.0", "v0.9.9")).toBe(true)
    expect(newerVersion("v0.24.0", "v0.24.0")).toBe(false)
    expect(publishedTogether("v0.24.0", "0.24.0")).toBe(true)
    expect(publishedTogether("v0.25.0", "0.24.0")).toBe(false)
    for (const value of ["main", "v1.0.0-beta", "v1.0.0/../../x"]) expect(() => stableVersion(value)).toThrow()
  })
  it("includes renamed/removed public pages but excludes upstream internal development docs", () => {
    expect(
      releaseChanges([
        { filename: "docs/search.md", status: "renamed", previous_filename: "docs/archive.md" },
        { filename: "docs/dev/secrets.md", status: "added" },
        { filename: "CHANGELOG.md", status: "modified" },
      ]),
    ).toEqual(["CHANGELOG.md", "docs/archive.md", "docs/search.md"])
  })
  it("reports release deltas and limits preparation when npm publication is incomplete", async () => {
    const get = vi.fn(async (url: string) =>
      url.includes("/releases/")
        ? release
        : url.includes("registry.npmjs.org")
          ? { version: "0.24.0" }
          : { files: [{ filename: "docs/search.md", status: "added" }] },
    )
    const result = await checkToolRelease(tool, get)
    expect(result).toMatchObject({ latest: "v0.25.0", published: false, pages: ["docs/search.md"] })
    expect(updateReport([result as ReleaseUpdate])).toContain("wait for publication")
  })
  it("makes no comparison call when released source and npm already match reviewed pins", async () => {
    const get = vi.fn(async (url: string) =>
      url.includes("/releases/") ? { ...release, tag_name: tool.docsRef } : { version: "0.24.0" },
    )
    expect(await checkToolRelease(tool, get)).toBeNull()
    expect(get).toHaveBeenCalledTimes(2)
  })
  it("rejects draft releases and a downgrade", async () => {
    for (const candidate of [
      { ...release, draft: true },
      { ...release, tag_name: "v0.23.0" },
    ]) {
      await expect(
        checkToolRelease(tool, async (url) => (url.includes("/releases/") ? candidate : { version: "0.25.0" })),
      ).rejects.toThrow()
    }
  })
  it("marks potentially truncated comparisons for full review", async () => {
    const result = await checkToolRelease(tool, async (url) =>
      url.includes("/releases/")
        ? release
        : url.includes("registry.npmjs.org")
          ? { version: "0.25.0" }
          : { files: Array.from({ length: 300 }, () => ({ filename: "docs/search.md", status: "modified" })) },
    )
    expect(result?.changesComplete).toBe(false)
    expect(result?.review[0]).toContain("truncated")
  })
})
describe("deduplicated release notifications", () => {
  it("does not create an issue when up to date or modify an unrelated issue", async () => {
    const get = vi.fn(async (_url: string, _init?: RequestInit) => [
      { number: 5, title: "[Docs] Review released CLI updates", body: "Owner-written issue" },
    ])
    await notifyUpdates("WireCatLabs/cli-docs", [], get)
    expect(get).toHaveBeenCalledTimes(1)
  })
  it("creates one tracking issue and updates it only when the report changes", async () => {
    const marker = "<!-- wirecat-docs-release-check -->"
    const get = vi.fn(async (_url: string, _init?: RequestInit) => [])
    await notifyUpdates("WireCatLabs/cli-docs", [fixture], get)
    expect(get.mock.calls).toHaveLength(2)
    const body = `${marker}\n\n${updateReport([fixture])}`
    const unchanged = vi.fn(async (_url: string, _init?: RequestInit) => [
      { number: 12, title: "[Docs] Review released CLI updates", body },
    ])
    await notifyUpdates("WireCatLabs/cli-docs", [fixture], unchanged)
    expect(unchanged).toHaveBeenCalledTimes(1)
    const changed = vi.fn(async (_url: string, _init?: RequestInit) => [
      { number: 12, title: "[Docs] Review released CLI updates", body: marker },
    ])
    await notifyUpdates("WireCatLabs/cli-docs", [fixture], changed)
    expect(changed.mock.calls).toHaveLength(2)
    expect(changed.mock.calls[1][0].endsWith("/12")).toBe(true)
  })
  it("closes only the marked automation issue once published pins catch up", async () => {
    const get = vi.fn(async (_url: string, _init?: RequestInit) => [
      { number: 12, title: "[Docs] Review released CLI updates", body: "<!-- wirecat-docs-release-check -->" },
    ])
    await notifyUpdates("WireCatLabs/cli-docs", [], get)
    expect(get.mock.calls).toHaveLength(2)
  })
})

describe("source preparation keeps review gates intact", () => {
  it("preserves fingerprints and correction rules while advancing a checked proposal", () => {
    const root = mkdtempSync(join(tmpdir(), "wirecat-docs-update-test-"))
    try {
      mkdirSync(join(root, "translations"))
      mkdirSync(join(root, "scripts"))
      writeFileSync(join(root, "translations/sources.json"), "reviewed fingerprint")
      writeFileSync(join(root, "scripts/docs-corrections.json"), "reviewed errata")
      const capture = vi.fn()
      const withGuide = { ...tool, guideRefs: { attachments: "a".repeat(40) } }
      prepareUpdates(root, [withGuide], [fixture], capture)
      expect(capture).toHaveBeenCalledWith(expect.objectContaining({ docsRef: "v0.25.0" }), root, undefined, true)
      const prepared = JSON.parse(readFileSync(join(root, "tools.json"), "utf8"))[0]
      expect(prepared.docsRef).toBe("v0.25.0")
      expect(prepared).not.toHaveProperty("guideRefs")
      expect(capture.mock.calls[0][0]).not.toHaveProperty("guideRefs")
      expect(withGuide.guideRefs.attachments).toBe("a".repeat(40))
      expect(readFileSync(join(root, "translations/sources.json"), "utf8")).toBe("reviewed fingerprint")
      expect(readFileSync(join(root, "scripts/docs-corrections.json"), "utf8")).toBe("reviewed errata")
      expect(tool.docsRef).toBe("v0.24.0")
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
  it("refuses incomplete publication and stale proposals before writing pins", () => {
    const capture = vi.fn()
    expect(() => prepareUpdates("/unused", [tool], [{ ...fixture, published: false }], capture)).toThrow("publication")
    expect(() => prepareUpdates("/unused", [tool], [{ ...fixture, current: "v0.23.0" }], capture)).toThrow("stale")
    expect(capture).not.toHaveBeenCalled()
  })
})

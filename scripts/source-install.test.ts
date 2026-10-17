import { execFileSync } from "node:child_process"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { checkoutCommit, checkoutSource, sourceInstallation } from "./source-install.ts"

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }))
beforeEach(() => vi.clearAllMocks())

describe("reviewed source distributions", () => {
  it("requires an explicit source mode and immutable valid repository ref", () => {
    expect(sourceInstallation({ repo: "WireCatLabs/drive-cli", docsRef: "v1.0.0" })).toBe(false)
    expect(sourceInstallation({ distribution: "source", repo: "WireCatLabs/drive-cli", docsRef: "a".repeat(40) })).toBe(
      true,
    )
    for (const docsRef of ["main", "v1.0.0", "../unsafe", "a".repeat(39)])
      expect(() => sourceInstallation({ distribution: "source", repo: "WireCatLabs/drive-cli", docsRef })).toThrow()
  })
})

describe("immutable checkout", () => {
  it("fetches and detaches at the requested object instead of treating it as a branch", () => {
    const commit = "a".repeat(40)
    checkoutCommit("WireCatLabs/zoom-cli", commit, "/synthetic/preview")
    const calls = vi.mocked(execFileSync).mock.calls
    expect(calls.some(([, args]) => args?.includes("--branch"))).toBe(false)
    expect(calls.find(([, args]) => args?.[0] === "fetch")?.[1]?.at(-1)).toBe(commit)
    const checkout = calls.find(([, args]) => args?.includes("checkout"))
    expect(checkout?.[1]?.slice(-2)).toEqual(["--detach", commit])
    expect(checkout?.[2]).toMatchObject({ cwd: "/synthetic/preview" })
  })

  it("refuses mutable or malformed selections before any git operation", () => {
    for (const ref of ["main", "v1.0.0", "../unsafe", "a".repeat(39)])
      expect(() => checkoutCommit("WireCatLabs/zoom-cli", ref, "/synthetic/preview")).toThrow("immutable")
    expect(() => checkoutCommit("../unsafe/repo", "a".repeat(40), "/synthetic/preview")).toThrow("repository")
    expect(execFileSync).not.toHaveBeenCalled()
  })

  it("keeps source-distribution checkout behind explicit source validation", () => {
    expect(() =>
      checkoutSource(
        {
          name: "zm",
          repo: "WireCatLabs/zoom-cli",
          package: "@wirecat/zoom-cli",
          lang: "en",
          summary: {},
          docsRef: "a".repeat(40),
        },
        "/synthetic/preview",
      ),
    ).toThrow("Not a source distribution")
    expect(execFileSync).not.toHaveBeenCalled()
  })
})

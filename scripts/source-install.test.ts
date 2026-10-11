import { describe, expect, it } from "vitest"
import { sourceInstallation } from "./source-install.ts"

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

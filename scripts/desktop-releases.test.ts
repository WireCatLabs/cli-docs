import { describe, expect, it } from "vitest"
import { classify, detectOs, toReleases } from "../lib/desktop-releases"

const asset = (name: string, size = 1) => ({
  name,
  size,
  browser_download_url: `https://github.com/WireCatLabs/wirecat-desktop/releases/download/x/${name}`,
})
const release = (tag: string, date: string, names: string[], extra = {}) => ({
  tag_name: tag,
  published_at: date,
  html_url: `https://github.com/WireCatLabs/wirecat-desktop/releases/tag/${tag}`,
  draft: false,
  prerelease: false,
  assets: names.map((name) => asset(name)),
  ...extra,
})
const v010 = [
  "latest.json",
  "WireCat-0.1.0-1.x86_64.rpm",
  "WireCat-0.1.0-1.x86_64.rpm.sig",
  "WireCat_0.1.0_amd64.AppImage",
  "WireCat_0.1.0_amd64.AppImage.sig",
  "WireCat_0.1.0_amd64.deb",
  "WireCat_0.1.0_universal.app.tar.gz",
  "WireCat_0.1.0_universal.app.tar.gz.sig",
  "WireCat_0.1.0_universal.dmg",
  "WireCat_0.1.0_x64-setup.exe",
  "WireCat_0.1.0_x64-setup.exe.sig",
]
const v011 = [
  "latest.json",
  "wirecat-0.1.1-1.x86_64.rpm",
  "wirecat_0.1.1_amd64.AppImage",
  "wirecat_0.1.1_amd64.AppImage.sig",
  "wirecat_0.1.1_amd64.deb",
  "WireCat_0.1.1_universal.dmg",
  "WireCat_0.1.1_x64-setup.exe",
]

describe("desktop release files", () => {
  it("keeps only the files a person installs, whatever their case", () => {
    expect(v010.map(classify).filter(Boolean)).toHaveLength(5)
    expect(classify("wirecat_0.1.1_amd64.AppImage")).toEqual({ format: "appimage", platform: "linux" })
    expect(classify("WireCat_0.1.0_amd64.AppImage.sig")).toBeUndefined()
    expect(classify("WireCat_0.1.0_universal.app.tar.gz")).toBeUndefined()
  })

  it("orders releases newest first and skips drafts, prereleases and releases without installers", () => {
    const releases = toReleases([
      release("v0.1.0", "2026-10-29T17:46:19Z", v010),
      release("v0.1.1", "2026-10-29T21:00:00Z", v011),
      release("v0.2.0", "2026-11-01T00:00:00Z", v011, { draft: true }),
      release("v0.2.0-beta", "2026-11-01T00:00:00Z", v011, { prerelease: true }),
      release("v0.0.9", "2026-10-01T00:00:00Z", ["latest.json"]),
    ])
    expect(releases.map((r) => r.version)).toEqual(["0.1.1", "0.1.0"])
    expect(releases[0].files.map((file) => file.format)).toEqual(["dmg", "exe", "appimage", "deb", "rpm"])
  })
})

describe("operating system detection", () => {
  const ua = {
    mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
    windows:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
    linux: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
    android:
      "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36",
    iphone:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  }

  it("prefers the client hint over the user agent string", () => {
    expect(detectOs({ userAgent: ua.linux, userAgentData: { platform: "Windows", mobile: false } })).toBe("windows")
    expect(detectOs({ userAgent: ua.windows, userAgentData: { platform: "macOS" } })).toBe("macos")
  })

  it("reads the user agent when there is no client hint", () => {
    expect(detectOs({ userAgent: ua.mac })).toBe("macos")
    expect(detectOs({ userAgent: ua.windows })).toBe("windows")
    expect(detectOs({ userAgent: ua.linux })).toBe("linux")
    expect(detectOs({ userAgent: "curl/8.0" })).toBe("unknown")
    expect(detectOs({ userAgent: "Mozilla/5.0 (X11; FreeBSD amd64; rv:144.0) Gecko/20100101 Firefox/144.0" })).toBe(
      "unknown",
    )
  })

  it("treats phones and an iPad that reports a Mac as mobile", () => {
    expect(detectOs({ userAgent: ua.android })).toBe("mobile")
    expect(detectOs({ userAgent: ua.iphone })).toBe("mobile")
    expect(detectOs({ userAgent: ua.mac, maxTouchPoints: 5 })).toBe("mobile")
  })
})

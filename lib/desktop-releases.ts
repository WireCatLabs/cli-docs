export const desktopRepository = "WireCatLabs/wirecat-desktop"
export const releasesPage = `https://github.com/${desktopRepository}/releases`
export const releasesApi = `https://api.github.com/repos/${desktopRepository}/releases?per_page=100`

export type Platform = "macos" | "windows" | "linux"
export type Format = "dmg" | "exe" | "appimage" | "deb" | "rpm"
export type DesktopFile = { format: Format; platform: Platform; name: string; url: string; size: number }
export type DesktopRelease = { version: string; date: string; notes: string; files: DesktopFile[] }

type ApiAsset = { name: string; size: number; browser_download_url: string }
type ApiRelease = {
  tag_name: string
  published_at: string | null
  html_url: string
  draft: boolean
  prerelease: boolean
  assets: ApiAsset[]
}

// File names change between releases (0.1.1 lowercased the Linux ones), so only the suffix is trusted.
const formats: { suffix: string; format: Format; platform: Platform }[] = [
  { suffix: ".dmg", format: "dmg", platform: "macos" },
  { suffix: "-setup.exe", format: "exe", platform: "windows" },
  { suffix: ".appimage", format: "appimage", platform: "linux" },
  { suffix: ".deb", format: "deb", platform: "linux" },
  { suffix: ".rpm", format: "rpm", platform: "linux" },
]
const order: Format[] = ["dmg", "exe", "appimage", "deb", "rpm"]

export function classify(name: string): Omit<DesktopFile, "name" | "url" | "size"> | undefined {
  const lower = name.toLowerCase()
  const match = formats.find(({ suffix }) => lower.endsWith(suffix))
  return match && { format: match.format, platform: match.platform }
}

export function toReleases(data: unknown): DesktopRelease[] {
  if (!Array.isArray(data)) throw new Error("GitHub returned no release list")
  return (data as ApiRelease[])
    .filter((release) => !release.draft && !release.prerelease && release.published_at)
    .map((release) => ({
      version: release.tag_name.replace(/^v/, ""),
      date: release.published_at as string,
      notes: release.html_url,
      files: release.assets
        .flatMap((asset) => {
          const kind = classify(asset.name)
          return kind ? [{ ...kind, name: asset.name, url: asset.browser_download_url, size: asset.size }] : []
        })
        .sort((a, b) => order.indexOf(a.format) - order.indexOf(b.format)),
    }))
    .filter((release) => release.files.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function fetchReleases(init: RequestInit = {}): Promise<DesktopRelease[] | null> {
  try {
    const response = await fetch(releasesApi, {
      ...init,
      headers: { Accept: "application/vnd.github+json", ...init.headers },
      signal: init.signal ?? AbortSignal.timeout(10_000),
    })
    if (!response.ok) return null
    return toReleases(await response.json())
  } catch {
    return null
  }
}

let snapshot: Promise<DesktopRelease[] | null> | undefined
/** One request per build for all three languages; a failed one leaves the page with its GitHub link. */
export function buildSnapshot() {
  const token = process.env.GITHUB_TOKEN
  snapshot ??= fetchReleases(token ? { headers: { Authorization: `Bearer ${token}` } } : {})
  return snapshot
}

export type DetectedOs = Platform | "mobile" | "unknown"
type NavigatorLike = {
  userAgent: string
  maxTouchPoints?: number
  userAgentData?: { platform?: string; mobile?: boolean }
}

export function detectOs(nav: NavigatorLike): DetectedOs {
  const hint = nav.userAgentData
  if (hint?.mobile) return "mobile"
  const platform = hint?.platform?.toLowerCase() ?? ""
  if (platform === "macos") return "macos"
  if (platform === "windows") return "windows"
  if (platform === "linux") return "linux"
  if (platform === "chrome os") return "unknown"
  if (platform === "android" || platform === "ios") return "mobile"
  const ua = nav.userAgent
  if (/android|iphone|ipad|ipod|mobile/i.test(ua)) return "mobile"
  // iPadOS Safari reports itself as a Mac; a touch screen gives it away.
  if (/macintosh|mac os x/i.test(ua)) return (nav.maxTouchPoints ?? 0) > 1 ? "mobile" : "macos"
  if (/windows/i.test(ua)) return "windows"
  if (/cros/i.test(ua)) return "unknown"
  if (/linux/i.test(ua)) return "linux"
  return "unknown"
}

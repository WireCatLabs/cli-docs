import { readFileSync } from "node:fs"
import { extname, join } from "node:path"
import { ImageResponse } from "next/og"
import type { ReactNode } from "react"

const fonts = [
  {
    name: "Unbounded Latin",
    data: readFileSync(join(process.cwd(), "lib/social-fonts/latin.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Unbounded Cyrillic",
    data: readFileSync(join(process.cwd(), "lib/social-fonts/cyrillic.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
]

// Satori draws an image only from data it already holds, so a logo from public/ goes in as a data URL.
const logos = new Map<string, string>()
export function logoDataUrl(file: string): string {
  const cached = logos.get(file)
  if (cached) return cached
  const type = extname(file) === ".svg" ? "image/svg+xml" : "image/png"
  const url = `data:${type};base64,${readFileSync(join(process.cwd(), "public/logos", file)).toString("base64")}`
  logos.set(file, url)
  return url
}

export function shorten(text: string, limit: number): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.:;]+$/, "")}…`
}

/** The 1200×630 card every page shares as its link preview. */
export function socialCard({
  kicker,
  headline,
  footer,
}: {
  kicker?: { label: string; logo?: string }
  headline: ReactNode
  footer: string
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 56px",
        background: "#101617",
        color: "#ffffff",
        fontFamily: "Unbounded Latin, Unbounded Cyrillic",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#4b53f0" />
            <path d="M9 21V11l4 4 3-4 3 4 4-4v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          WireCat
        </div>
        <span style={{ fontSize: 28, color: "#d3d9db" }}>wirecat.dev</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {kicker ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, color: "#b8afff" }}>
            {/* biome-ignore lint/performance/noImgElement: the card is drawn by Satori, not rendered by Next. */}
            {kicker.logo ? <img src={kicker.logo} width={48} height={48} alt="" /> : null}
            {kicker.label}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 56, lineHeight: 1.2, gap: 8 }}>
          {headline}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: "#d3d9db" }}>{footer}</div>
    </div>,
    { width: 1200, height: 630, fonts },
  )
}

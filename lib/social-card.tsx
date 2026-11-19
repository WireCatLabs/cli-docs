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
  // A whole first sentence reads better than a cut one.
  const sentence = /^.+?[.!?](?=\s)/.exec(text)?.[0]
  if (sentence && sentence.length <= limit && sentence.length >= limit / 4) return sentence
  const cut = text.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.:;]+$/, "")}…`
}

const frame = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#101617",
  color: "#ffffff",
  fontFamily: "Unbounded Latin, Unbounded Cyrillic",
} as const

function brand(scale: number) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 * scale, fontSize: 40 * scale }}>
        <svg width={64 * scale} height={64 * scale} viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#4b53f0" />
          <path d="M9 21V11l4 4 3-4 3 4 4-4v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
        WireCat
      </div>
      <span style={{ fontSize: 28 * scale, color: "#d3d9db" }}>wirecat.dev</span>
    </div>
  )
}

/** The site's own card: the homepage and the blog. */
export function socialCard({ headline, footer }: { headline: ReactNode; footer: string }) {
  return new ImageResponse(
    <div style={{ ...frame, justifyContent: "space-between", padding: "56px 56px" }}>
      {brand(1)}
      <div style={{ display: "flex", flexDirection: "column", fontSize: 56, lineHeight: 1.2, gap: 8 }}>{headline}</div>
      <div style={{ display: "flex", fontSize: 28, color: "#d3d9db" }}>{footer}</div>
    </div>,
    { width: 1200, height: 630, fonts },
  )
}

/** A docs page's card: the title on the left, the site's mark on the right, the description across the width. */
export function pageCard({
  title,
  description,
  logo,
  label,
}: {
  title: string
  description: string
  logo?: string
  label?: string
}) {
  const size = title.length > 44 ? 52 : title.length > 28 ? 66 : 88
  // About two lines of description; a short title leaves room for a little more.
  const text = shorten(description, title.length > 28 ? 80 : 100)
  return new ImageResponse(
    <div style={{ ...frame, justifyContent: "center", gap: 44, padding: "56px 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flexShrink: 1 }}>
          {logo || label ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#b8afff" }}>
              {/* biome-ignore lint/performance/noImgElement: the card is drawn by Satori, not rendered by Next. */}
              {logo ? <img src={logo} width={52} height={52} alt="" /> : null}
              {label}
            </div>
          ) : null}
          <span style={{ fontSize: size, lineHeight: 1.1 }}>{title}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#4b53f0" />
            <path d="M9 21V11l4 4 3-4 3 4 4-4v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 22, color: "#d3d9db" }}>wirecat.dev</span>
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 36, lineHeight: 1.35, color: "#d3d9db" }}>{text}</div>
    </div>,
    { width: 1200, height: 630, fonts },
  )
}

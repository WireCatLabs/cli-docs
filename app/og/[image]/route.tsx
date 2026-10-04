import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { localeOf, seoLocales, seoWords } from "@/lib/seo"

export const dynamic = "force-static"

export function generateStaticParams() {
  return seoLocales.map((lang) => ({ image: `${lang}.png` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params
  const lang = localeOf(image.replace(/\.png$/, ""))
  const words = seoWords(lang)
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
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#101617",
        color: "#ffffff",
        fontFamily: "Unbounded Latin, Unbounded Cyrillic",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36 }}>
        <svg width="60" height="60" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#4b53f0" />
          <path d="M9 21V11l4 4 3-4 3 4 4-4v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
        WireCat
      </div>
      <div style={{ display: "flex", fontSize: 64, lineHeight: 1.25, color: "#dddfff" }}>{words.socialTitle}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#d3d9db" }}>
        <span>{words.socialDescription}</span>
        <span>wirecat.dev</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  )
}

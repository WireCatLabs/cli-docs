import { preload } from "react-dom"
import { HomeProvider } from "@/components/home-provider"
import { landingFonts } from "@/lib/landing-fonts"
import "@/lib/landing/fonts.css"
import "@/lib/editorial/editorial.css"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  for (const font of landingFonts(lang)) preload(font, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  return <HomeProvider>{children}</HomeProvider>
}

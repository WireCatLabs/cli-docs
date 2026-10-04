import { preload } from "react-dom"
import { HomeProvider } from "@/components/home-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import en from "@/lib/landing/en.json"
import es from "@/lib/landing/es.json"
import ru from "@/lib/landing/ru.json"
import { landingFonts } from "@/lib/landing-fonts"
import "@/lib/landing/fonts.css"
import "@/lib/landing/oswald.css"
import "@/lib/landing/fira.css"
import "@/lib/landing/landing.css"
import "@/lib/landing/connect.css"
import "@/lib/landing/day.css"
import "@/lib/landing/savings.css"
import "@/lib/landing/scenarios.css"
import "@/lib/landing/about.css"
import "@/lib/landing/theme.css"
import "@/lib/landing/install.css"
import "@/lib/landing/footer.css"
import "@/lib/landing/header.css"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  for (const font of landingFonts(lang)) preload(font, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  const content = { en, es, ru }[lang as "en" | "es" | "ru"] ?? en
  return (
    <HomeProvider>
      <div className="wirecat-landing">
        <SiteHeader lang={lang} />
        {children}
        <SiteFooter html={content.footerHtml} />
      </div>
    </HomeProvider>
  )
}

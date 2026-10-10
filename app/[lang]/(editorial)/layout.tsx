import { preload } from "react-dom"
import { HomeProvider } from "@/components/home-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import en from "@/lib/editorial/en.json"
import es from "@/lib/editorial/es.json"
import ru from "@/lib/editorial/ru.json"
import "@/lib/landing/about.css"
import { landingFonts } from "@/lib/landing-fonts"
import "@/lib/landing/fonts.css"
import "@/lib/editorial/editorial.css"
import "@/components/public-site.css"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  for (const font of landingFonts(lang)) preload(font, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  const content = { en, ru, es }[lang as "en" | "ru" | "es"] ?? en
  return (
    <HomeProvider>
      <div className="wirecat-editorial public-site">
        <a className="skip" href="#main">
          {lang === "ru" ? "Перейти к содержимому" : lang === "es" ? "Ir al contenido" : "Skip to content"}
        </a>
        <SiteHeader lang={lang} html={content.header} />
        {children}
        <div className="wirecat-landing footer-host">
          <SiteFooter html={content.footer} />
        </div>
      </div>
    </HomeProvider>
  )
}

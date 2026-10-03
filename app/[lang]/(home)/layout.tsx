import { SiteFooter } from "@/components/site-footer"
import en from "@/lib/landing/en.json"
import es from "@/lib/landing/es.json"
import ru from "@/lib/landing/ru.json"
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

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const content = { en, es, ru }[lang as "en" | "es" | "ru"] ?? en
  return (
    <div className="wirecat-landing">
      {children}
      <SiteFooter html={content.footerHtml} />
    </div>
  )
}

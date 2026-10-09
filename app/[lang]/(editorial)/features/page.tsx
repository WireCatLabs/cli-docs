import { Editorial } from "@/components/landing/editorial"
import { StructuredData } from "@/components/structured-data"
import en from "@/lib/editorial/en.json"
import es from "@/lib/editorial/es.json"
import ru from "@/lib/editorial/ru.json"
import { pageMetadata, pageStructuredData } from "@/lib/seo"

const titles = { en: "Features · WireCat", ru: "Возможности · WireCat", es: "Funciones · WireCat" }
const descriptions = {
  en: "Search, catch up, draft replies and manage bots and groups with your AI agent.",
  ru: "Ищите, узнавайте о важном, готовьте ответы и управляйте ботами и группами с ИИ-агентом.",
  es: "Busca, ponte al día, redacta respuestas y gestiona bots y grupos con tu agente de IA.",
}
type Props = { params: Promise<{ lang: string }> }
export default async function Page({ params }: Props) {
  const { lang } = await params
  const locale = lang === "ru" ? "ru" : lang === "es" ? "es" : "en"
  const content = { en, ru, es }[locale]
  return (
    <>
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}/features`,
          title: titles[locale],
          description: descriptions[locale],
        })}
      />
      <Editorial html={content.features} lang={lang} />
    </>
  )
}
export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const locale = lang === "ru" ? "ru" : lang === "es" ? "es" : "en"
  return pageMetadata({ lang, suffix: "/features", title: titles[locale], description: descriptions[locale] })
}

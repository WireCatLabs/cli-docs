import { Editorial } from "@/components/landing/editorial"
import { StructuredData } from "@/components/structured-data"
import en from "@/lib/editorial/en.json"
import es from "@/lib/editorial/es.json"
import ru from "@/lib/editorial/ru.json"
import { pageMetadata, pageStructuredData } from "@/lib/seo"

const titles = { en: "Examples · WireCat", ru: "Примеры · WireCat", es: "Ejemplos · WireCat" }
const descriptions = {
  en: "Worked conversations showing how your agent uses messages, tools and context.",
  ru: "Диалоги, показывающие, как агент использует сообщения, инструменты и контекст.",
  es: "Conversaciones que muestran cómo tu agente usa mensajes, herramientas y contexto.",
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
          pathname: `/${lang}/examples`,
          title: titles[locale],
          description: descriptions[locale],
        })}
      />
      <Editorial html={content.examples} lang={lang} />
    </>
  )
}
export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const locale = lang === "ru" ? "ru" : lang === "es" ? "es" : "en"
  return pageMetadata({ lang, suffix: "/examples", title: titles[locale], description: descriptions[locale] })
}

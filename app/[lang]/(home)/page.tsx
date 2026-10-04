import { Landing } from "@/components/landing"
import { StructuredData } from "@/components/structured-data"
import { i18n } from "@/lib/i18n"
import en from "@/lib/landing/en.json"
import es from "@/lib/landing/es.json"
import ru from "@/lib/landing/ru.json"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const content = lang === "ru" ? ru : lang === "es" ? es : en
  const words = seoWords(lang)
  return (
    <>
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}`,
          title: words.homeTitle,
          description: words.homeDescription,
        })}
      />
      <Landing {...content} lang={lang} />
    </>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const words = seoWords(lang)
  return pageMetadata({ lang, title: words.homeTitle, description: words.homeDescription })
}

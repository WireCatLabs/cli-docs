import { Editorial } from "@/components/landing/editorial"
import { StructuredData } from "@/components/structured-data"
import en from "@/lib/editorial/en.json"
import es from "@/lib/editorial/es.json"
import ru from "@/lib/editorial/ru.json"
import { i18n } from "@/lib/i18n"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  if (lang === "en")
    return (
      <>
        <meta httpEquiv="refresh" content="0;url=/" />
        <main id="main">
          <p>
            <a href="/">WireCat — English homepage</a>
          </p>
        </main>
      </>
    )
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
      <Editorial html={content.home} lang={lang} />
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

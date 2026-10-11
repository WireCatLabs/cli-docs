import type { Metadata } from "next"
import { StructuredData } from "@/components/structured-data"
import { i18n } from "@/lib/i18n"
import { privacyCopy } from "@/lib/privacy"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
import siteConfig from "@/site.config.json"

type Props = { params: Promise<{ lang: string }> }
const copyFor = (lang: string) => privacyCopy[lang as keyof typeof privacyCopy] ?? privacyCopy.en

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const words = copyFor(lang)
  return pageMetadata({ lang, suffix: "/privacy", title: `${words.title} · WireCat`, description: words.intro })
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  const words = copyFor(lang)
  const { email } = siteConfig.contacts
  return (
    <div className="wirecat-about">
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}/privacy`,
          title: words.title,
          description: words.intro,
          breadcrumbs: [
            { name: seoWords(lang).homeLabel, pathname: homePath(lang) },
            { name: words.title, pathname: `/${lang}/privacy` },
          ],
        })}
      />
      <main id="main" className="wrap about-page">
        <header className="about-intro">
          <h1>{words.title}</h1>
          <p className="intro">{words.intro}</p>
          <p>{words.updated}</p>
        </header>
        <article className="about-story" aria-label={words.title}>
          {words.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}
          <p>
            {words.contact} <a href={`mailto:${email}`}>{email}</a>
          </p>
        </article>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

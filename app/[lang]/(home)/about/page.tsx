import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"
import { aboutCopy } from "@/lib/about"
import { i18n } from "@/lib/i18n"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"
import siteConfig from "@/site.config.json"

type Props = { params: Promise<{ lang: string }> }
const copyFor = (lang: string) => aboutCopy[lang as keyof typeof aboutCopy] ?? aboutCopy.en

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const words = copyFor(lang)
  return pageMetadata({ lang, suffix: "/about", title: words.title, description: words.intro })
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const words = copyFor(lang)
  const [purpose, tools, services, process, future, open] = words.sections
  const paragraphs = (section: typeof purpose) => section.paragraphs.map((text) => <p key={text}>{text}</p>)
  return (
    <div className="wirecat-about">
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}/about`,
          title: words.title,
          description: words.intro,
          breadcrumbs: [
            { name: seoWords(lang).homeLabel, pathname: `/${lang}` },
            { name: words.title, pathname: `/${lang}/about` },
          ],
        })}
      />
      <main className="wrap about-page">
        <header className="about-intro">
          <h1>{words.title}</h1>
          <p className="intro">{words.intro}</p>
        </header>
        <section className="about-purpose">
          <h2>{purpose.title}</h2>
          <div>
            <p>{purpose.paragraphs[0]}</p>
            <p className="about-statement">{purpose.paragraphs[1]}</p>
          </div>
        </section>
        <section className="about-tools">
          <div>
            <h2>{tools.title}</h2>
            {paragraphs(tools)}
          </div>
          <nav className="about-tool-links" aria-label={tools.title}>
            <Link href={`/${lang}/docs/tg`}>
              <span>Telegram</span>
              <code>tg</code>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href={`/${lang}/docs/max`}>
              <span>MAX</span>
              <code>max</code>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="about-start" href={`/${lang}/docs/installation`}>
              {words.start}
              <ArrowRight aria-hidden="true" />
            </Link>
          </nav>
        </section>
        <div className="about-outlook">
          <section>
            <h2>{open.title}</h2>
            {paragraphs(open)}
            <div className="about-links">
              <a href="https://github.com/leemour/tg-cli">
                tg · {words.source}
                <ArrowRight aria-hidden="true" />
              </a>
              <a href="https://github.com/leemour/max-cli">
                max · {words.source}
                <ArrowRight aria-hidden="true" />
              </a>
              <Link href={`/${lang}/docs/security`}>
                {words.security}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>
          <section>
            <h2>{future.title}</h2>
            {paragraphs(future)}
          </section>
        </div>
        <section className="about-services">
          <h2>{services.title}</h2>
          <div>{paragraphs(services)}</div>
        </section>
        <section className="about-process">
          <h2>{process.title}</h2>
          <div>{paragraphs(process)}</div>
        </section>
        <section className="about-contact" id="contact">
          <div>
            <h2>{words.contact}</h2>
            <p>{words.contactText}</p>
          </div>
          <a className="btn" href={siteConfig.contacts.maintainerTelegram}>
            @{new URL(siteConfig.contacts.maintainerTelegram).pathname.slice(1)}
            <ArrowRight aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

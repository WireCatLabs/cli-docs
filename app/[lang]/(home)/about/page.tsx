import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { aboutCopy } from "@/lib/about"
import { i18n } from "@/lib/i18n"
import siteConfig from "@/site.config.json"

type Props = { params: Promise<{ lang: string }> }
const copyFor = (lang: string) => aboutCopy[lang as keyof typeof aboutCopy] ?? aboutCopy.en

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const words = copyFor(lang)
  return { title: words.title, description: words.intro }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const words = copyFor(lang)
  const [purpose, tools, services, process, future, open] = words.sections
  const paragraphs = (section: typeof purpose) => section.paragraphs.map((text) => <p key={text}>{text}</p>)
  return (
    <div className="wirecat-about">
      <SiteHeader lang={lang} />
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
              <span aria-hidden="true">→</span>
            </Link>
            <Link href={`/${lang}/docs/max`}>
              <span>MAX</span>
              <code>max</code>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="about-start" href={`/${lang}/docs/installation`}>
              {words.start} →
            </Link>
          </nav>
        </section>
        <div className="about-outlook">
          <section>
            <h2>{open.title}</h2>
            {paragraphs(open)}
            <div className="about-links">
              <a href="https://github.com/leemour/tg-cli">tg · {words.source} →</a>
              <a href="https://github.com/leemour/max-cli">max · {words.source} →</a>
              <Link href={`/${lang}/docs/tg/security`}>{words.security} →</Link>
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
          <a className="btn" href={`mailto:${siteConfig.contacts.email}`}>
            {siteConfig.contacts.email}
          </a>
        </section>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

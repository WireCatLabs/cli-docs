import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { StructuredData } from "@/components/structured-data"
import { WirecatLogo } from "@/components/wirecat-logo"
import { aboutCopy } from "@/lib/about"
import { i18n } from "@/lib/i18n"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
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
  const [purpose, tools, services, , future, open] = words.sections
  const paragraphs = (section: typeof purpose) => section.paragraphs.map((text) => <p key={text}>{text}</p>)
  return (
    <div className="wirecat-about">
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}/about`,
          aboutProject: true,
          title: words.title,
          description: words.intro,
          breadcrumbs: [
            { name: seoWords(lang).homeLabel, pathname: homePath(lang) },
            { name: words.title, pathname: `/${lang}/about` },
          ],
        })}
      />
      <main className="wrap about-page">
        <header className="about-intro">
          <h1>{words.title}</h1>
          <p className="intro">{words.intro}</p>
        </header>
        <details className="about-mobile-contents">
          <summary>{words.project.contents}</summary>
          <nav aria-label={words.project.contents}>
            {[
              ["purpose", purpose.title],
              ["tools", tools.title],
              ["open-source", open.title],
              ["future", future.title],
              ["funding", services.title],
            ].map(([id, title]) => (
              <a key={id} href={`#${id}`}>
                {title}
              </a>
            ))}
          </nav>
        </details>
        <div className="about-layout">
          <article className="about-story" aria-label={words.title}>
            <section id="purpose" className="about-purpose">
              <h2>{purpose.title}</h2>
              <p>{purpose.paragraphs[0]}</p>
              <p className="about-statement">{purpose.paragraphs[1]}</p>
            </section>
            <section id="tools" className="about-tools">
              <h2>{tools.title}</h2>
              {paragraphs(tools)}
              <nav className="about-tool-links" aria-label={tools.title}>
                <Link href={`/${lang}/docs/tg`}>
                  <span>
                    Telegram <code>tg</code>
                  </span>
                  <span>{words.toolDescriptions.tg}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link href={`/${lang}/docs/max`}>
                  <span>
                    MAX <code>max</code>
                  </span>
                  <span>{words.toolDescriptions.max}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </nav>
              <div className="about-links">
                <Link href={`/${lang}/docs/features`}>
                  {words.docs}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link href={`/${lang}/docs/agents`}>
                  {words.agentGuide}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </section>
            <section id="open-source" className="about-open">
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
            <section id="future" className="about-future">
              <h2>{future.title}</h2>
              {paragraphs(future)}
            </section>
            <section id="funding" className="about-services">
              <h2>{services.title}</h2>
              {paragraphs(services)}
              <a className="about-contact-link" href={siteConfig.contacts.maintainerTelegram}>
                {words.project.contact}
                <ArrowRight aria-hidden="true" />
              </a>
            </section>
          </article>
          <aside className="about-sidebar" aria-label={words.project.title}>
            <section className="about-project-card">
              <WirecatLogo />
              <h2>{words.project.title}</h2>
              <p>{words.project.description}</p>
              <dl>
                <div>
                  <dt>{words.project.tools}</dt>
                  <dd>
                    <Link href={`/${lang}/docs/tg`}>Telegram</Link> · <Link href={`/${lang}/docs/max`}>MAX</Link>
                  </dd>
                </div>
                <div>
                  <dt>{words.project.license}</dt>
                  <dd>
                    MIT · <a href="https://github.com/leemour/tg-cli">GitHub</a>
                  </dd>
                </div>
                <div>
                  <dt>{words.project.maintainer}</dt>
                  <dd>
                    <a href={siteConfig.contacts.maintainerTelegram}>
                      Viacheslav Ptsarev
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              </dl>
            </section>
            <nav className="about-contents" aria-label={words.project.contents}>
              <h2>{words.project.contents}</h2>
              {[
                ["purpose", purpose.title],
                ["tools", tools.title],
                ["open-source", open.title],
                ["future", future.title],
                ["funding", services.title],
              ].map(([id, title]) => (
                <a key={id} href={`#${id}`}>
                  {title}
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </nav>
            <section className="about-contribute">
              <h2>{words.project.contribute}</h2>
              <p>{words.project.contributeText}</p>
              <a href={`${siteConfig.repository}/issues`}>
                {words.project.issues}
                <ArrowRight aria-hidden="true" />
              </a>
              <a href={siteConfig.contacts.telegram}>
                Telegram
                <ArrowRight aria-hidden="true" />
              </a>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

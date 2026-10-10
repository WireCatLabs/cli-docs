import { ArrowRight, Mail, MessageCircle } from "lucide-react"
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
  const [purpose, tools, future, services] = words.sections
  const paragraphs = (section: typeof purpose) => section.paragraphs.map((text) => <p key={text}>{text}</p>)
  const products = [
    {
      name: "Telegram",
      command: "tg",
      description: words.toolDescriptions.tg,
      docs: `/${lang}/docs/tg`,
      source: "https://github.com/WireCatLabs/tg-cli",
    },
    {
      name: "MAX",
      command: "max",
      description: words.toolDescriptions.max,
      docs: `/${lang}/docs/max`,
      source: "https://github.com/WireCatLabs/max-cli",
    },
    {
      name: words.emailTool,
      command: "memo",
      description: words.toolDescriptions.memo,
      docs: `/${lang}/docs/memo`,
      source: "https://github.com/WireCatLabs/cli-memo",
    },
  ]
  const contacts = () => (
    <>
      <h2>{words.contactTitle}</h2>
      <p>{words.contactText}</p>
      <div className="about-contact-actions">
        <a href={`mailto:${siteConfig.contacts.email}`}>
          <Mail aria-hidden="true" />
          {words.emailButton}
        </a>
        <a href={siteConfig.contacts.maintainerTelegram}>
          <MessageCircle aria-hidden="true" />
          {words.telegramButton}
        </a>
      </div>
    </>
  )
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
      <main id="main" className="wrap about-page">
        <header className="about-intro">
          <h1>{words.title}</h1>
          <p className="intro">{words.intro}</p>
          <p id="open-source" className="about-open-source">
            <strong>{words.openSource}</strong>
          </p>
        </header>
        <section className="about-contact-mobile" aria-label={words.contactTitle}>
          {contacts()}
        </section>
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
                {products.map((product) => (
                  <div className="about-tool-row" key={product.command}>
                    <a className="about-tool-docs" href={product.docs} aria-label={`${product.name}: ${words.docs}`}>
                      <span>{product.name}</span>
                      <code>{product.command}</code>
                    </a>
                    <p>{product.description}</p>
                    <a
                      className="about-tool-source animated-text-link text-link"
                      href={product.source}
                      aria-label={`${product.name}: GitHub`}
                    >
                      <span className="link-label">GitHub</span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </nav>
              <div className="about-links">
                <Link className="animated-text-link text-link" href={`/${lang}/docs/features`}>
                  <span className="link-label">{words.docs}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="animated-text-link text-link" href={`/${lang}/docs/agents`}>
                  <span className="link-label">{words.agentGuide}</span>
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
              <a
                className="about-contact-link animated-text-link text-link"
                href={siteConfig.contacts.maintainerTelegram}
              >
                <span className="link-label">{words.project.contact}</span>
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
                    <Link href={`/${lang}/docs/tg`}>Telegram</Link> · <Link href={`/${lang}/docs/max`}>MAX</Link> ·{" "}
                    <Link href={`/${lang}/docs/memo`}>{words.emailTool}</Link>
                  </dd>
                </div>
                <div>
                  <dt>{words.project.license}</dt>
                  <dd>MIT</dd>
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
            <section className="about-contact-desktop" aria-label={words.contactTitle}>
              {contacts()}
            </section>
            <section className="about-contribute">
              <h2>{words.project.contribute}</h2>
              <p>{words.project.contributeText}</p>
              <a className="animated-text-link text-link" href={`${siteConfig.repository}/issues`}>
                <span className="link-label">{words.project.issues}</span>
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

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
  const external = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})
  const paragraphs = (section: typeof purpose) => section.paragraphs.map((text) => <p key={text}>{text}</p>)
  const tool = (command: string, name: string, repo: string, pkg: string) => ({
    name,
    command,
    description: words.toolDescriptions[command as keyof typeof words.toolDescriptions],
    docs: `/${lang}/docs/${command}`,
    sources: [
      ["GitHub", `https://github.com/WireCatLabs/${repo}`],
      ["npm", `https://www.npmjs.com/package/@wirecat/${pkg}`],
    ],
  })
  const products = [
    tool("tg", "Telegram", "tg-cli", "tg-cli"),
    tool("wa", "WhatsApp", "whatsapp-cli", "whatsapp-cli"),
    tool("max", "MAX", "max-cli", "max-cli"),
    tool("zm", "Zoom", "zoom-cli", "zoom-cli"),
    tool("drive", "Google Drive", "drive-cli", "drive-cli"),
    tool("gcal", "Google Calendar", "gcal-cli", "gcal-cli"),
    tool("mail", words.names.mail, "mail-cli", "mail-cli"),
    tool("memo", "Memo", "cli-memo", "cli-memo"),
    {
      name: words.names.desktop,
      command: "",
      description: words.toolDescriptions.desktop,
      docs: `/${lang}/docs/desktop`,
      sources: [
        ["GitHub", "https://github.com/WireCatLabs/wirecat-desktop"],
        [words.downloadShort, `/${lang}/download`],
      ],
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
        <a href={siteConfig.contacts.maintainerTelegram} target="_blank" rel="noopener noreferrer">
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
                  <div className="about-tool-row" key={product.name}>
                    <a
                      className="about-tool-docs animated-text-link"
                      href={product.docs}
                      aria-label={`${product.name}: ${words.docs}`}
                    >
                      <span className="link-label">{product.name}</span>
                      {product.command && <code>{product.command}</code>}
                    </a>
                    <p>{product.description}</p>
                    <span className="about-tool-sources">
                      {product.sources.map(([label, href]) => (
                        <a
                          key={label}
                          className="about-tool-source animated-text-link text-link"
                          href={href}
                          {...external(href)}
                          aria-label={`${product.name}: ${label}`}
                        >
                          <span className="link-label">{label}</span>
                          <ArrowRight aria-hidden="true" />
                        </a>
                      ))}
                    </span>
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
                <Link className="animated-text-link text-link" href={`/${lang}/download`}>
                  <span className="link-label">{words.download}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="animated-text-link text-link" href={`/${lang}/blog`}>
                  <span className="link-label">{words.blog}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </section>
            <section id="principles" className="about-principles">
              <h2>{words.principles.title}</h2>
              <ul>
                {words.principles.items.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong> {item.text}
                  </li>
                ))}
              </ul>
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
                target="_blank"
                rel="noopener noreferrer"
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
                    {products.slice(0, -1).map((product, index) => (
                      <span key={product.name}>
                        {index > 0 && " · "}
                        <Link className="animated-text-link" href={product.docs}>
                          <span className="link-label">{product.name}</span>
                        </Link>
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>{words.project.source}</dt>
                  <dd>
                    <a
                      className="animated-text-link"
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="link-label">github.com/WireCatLabs</span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>{words.project.license}</dt>
                  <dd>Apache 2.0</dd>
                </div>
                <div>
                  <dt>{words.project.maintainer}</dt>
                  <dd>
                    <a
                      className="animated-text-link"
                      href={siteConfig.contacts.maintainerTelegram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="link-label">Viacheslav Ptsarev</span>
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
              <a
                className="animated-text-link text-link"
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              >
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

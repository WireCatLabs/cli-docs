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
  const googleDisclosure = {
    en: {
      title: "Google API Limited Use",
      text: "WireCat’s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including its Limited Use requirements.",
      policy: "Google API Services User Data Policy",
      revoke: "Manage your Google Account connections",
      terms: "Terms of Service",
    },
    ru: {
      title: "Ограниченное использование данных Google API",
      text: "Использование и передача WireCat информации, полученной через API Google, соответствуют политике Google API Services User Data Policy, включая требования Limited Use.",
      policy: "Google API Services User Data Policy",
      revoke: "Управление подключениями в аккаунте Google",
      terms: "Условия использования",
    },
    es: {
      title: "Uso limitado de las API de Google",
      text: "El uso y la transferencia por WireCat de información recibida de las API de Google cumplen la Google API Services User Data Policy, incluidos sus requisitos de uso limitado.",
      policy: "Google API Services User Data Policy",
      revoke: "Gestionar las conexiones de tu cuenta de Google",
      terms: "Términos de servicio",
    },
  }[lang as "en" | "ru" | "es"] ?? {
    title: "Google API Limited Use",
    text: "WireCat’s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including its Limited Use requirements.",
    policy: "Google API Services User Data Policy",
    revoke: "Manage your Google Account connections",
    terms: "Terms of Service",
  }
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
          <section id="google-limited-use">
            <h2>{googleDisclosure.title}</h2>
            <p>{googleDisclosure.text}</p>
            <p>
              <a href="https://developers.google.com/terms/api-services-user-data-policy">{googleDisclosure.policy}</a>
              {" · "}
              <a href="https://myaccount.google.com/connections">{googleDisclosure.revoke}</a>
            </p>
          </section>
          <p>
            <a href={`/${lang}/terms`}>{googleDisclosure.terms}</a>
          </p>
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

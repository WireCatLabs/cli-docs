import { i18n } from "@/lib/i18n"
import { googleDisclosureFor, privacyCopy } from "@/lib/privacy"
import { termsCopy } from "@/lib/terms"
import siteConfig from "@/site.config.json"

export const dynamic = "force-static"

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; document: string }> }) {
  const { lang, document } = await params
  if (!i18n.languages.some((code) => code === lang) || !["privacy", "terms"].includes(document))
    return new Response("Not found", { status: 404 })
  const locale = lang as keyof typeof privacyCopy
  const words = document === "privacy" ? privacyCopy[locale] : termsCopy[locale]
  const text = [
    `# ${words.title}`,
    words.intro,
    words.updated,
    ...words.sections.flatMap((section) => [`## ${section.title}`, ...section.paragraphs]),
  ]
  if (document === "privacy") {
    const google = googleDisclosureFor(lang)
    text.push(
      `## ${google.title}`,
      google.text,
      `[${google.policy}](https://developers.google.com/terms/api-services-user-data-policy)`,
      `[${google.revoke}](https://myaccount.google.com/connections)`,
    )
  }
  text.push(
    `${words.contact} [${siteConfig.contacts.email}](mailto:${siteConfig.contacts.email})`,
    `[${privacyCopy[locale].title}](${siteConfig.url}/${lang}/privacy) · [${termsCopy[locale].title}](${siteConfig.url}/${lang}/terms)`,
  )
  return new Response(`${text.join("\n\n")}\n`, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) => ["privacy", "terms"].map((document) => ({ lang, document })))
}

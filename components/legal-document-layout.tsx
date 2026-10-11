import { FileText, ShieldCheck } from "lucide-react"
import type { ReactNode } from "react"
import "@/components/legal-document-layout.css"

export function LegalDocumentLayout({
  lang,
  active,
  children,
}: {
  lang: string
  active: "privacy" | "terms"
  children: ReactNode
}) {
  const words = {
    en: { title: "Legal documents", privacy: "Privacy Policy", terms: "Terms of Service" },
    ru: { title: "Правовые документы", privacy: "Политика конфиденциальности", terms: "Условия использования" },
    es: { title: "Documentos legales", privacy: "Política de privacidad", terms: "Términos de servicio" },
  }[lang as "en" | "ru" | "es"] ?? { title: "Legal documents", privacy: "Privacy Policy", terms: "Terms of Service" }
  return (
    <main id="main" className="wrap about-page">
      <div className="legal-document-layout">
        <nav className="legal-document-nav" aria-label={words.title}>
          <p>{words.title}</p>
          <a href={`/${lang}/privacy`} aria-current={active === "privacy" ? "page" : undefined}>
            <ShieldCheck aria-hidden="true" size={18} />
            <span>{words.privacy}</span>
          </a>
          <a href={`/${lang}/terms`} aria-current={active === "terms" ? "page" : undefined}>
            <FileText aria-hidden="true" size={18} />
            <span>{words.terms}</span>
          </a>
        </nav>
        <div className="legal-document-content">
          {children}
          <p>
            <a href={`/llms.mdx/legal/${lang}/${active}/content.md`}>Markdown</a>
          </p>
        </div>
      </div>
    </main>
  )
}

import { ChevronDown, Globe } from "lucide-react"
import Link from "next/link"
import { WirecatLogo } from "@/components/wirecat-logo"
import { aboutCopy } from "@/lib/about"

export function SiteHeader({ lang }: { lang: string }) {
  const words = aboutCopy[lang as keyof typeof aboutCopy] ?? aboutCopy.en
  return (
    <div className="bar">
      <header className="top wrap">
        <Link className="wirecat-brand" href={`/${lang}`} aria-label={`WireCat · ${words.back}`}>
          <WirecatLogo />
        </Link>
        <div className="right">
          <details className="lang">
            <summary aria-label="Language">
              <Globe />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown className="dn" />
            </summary>
            <div className="lang-menu">
              {[
                ["en", "English"],
                ["ru", "Русский"],
                ["es", "Español"],
              ].map(([locale, label]) => (
                <Link
                  key={locale}
                  href={`/${locale}/about`}
                  lang={locale}
                  aria-current={locale === lang ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <nav className="site" aria-label="Site">
            <Link href={`/${lang}/docs/tg`}>Telegram</Link>
            <Link href={`/${lang}/docs/max`}>MAX</Link>
            <Link href={`/${lang}/about`} aria-current="page">
              {words.nav}
            </Link>
          </nav>
        </div>
      </header>
    </div>
  )
}

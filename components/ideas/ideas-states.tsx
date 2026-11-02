import { RotateCw } from "lucide-react"
import Link from "next/link"
import { DiscordIcon, TelegramIcon } from "@/components/brand-icons"
import { ideasPath } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import siteConfig from "@/site.config.json"

export function IdeasSkeleton({ lang, rows = 5 }: { lang: string; rows?: number }) {
  return (
    <div className="ideas-skeleton" aria-busy="true">
      <span className="sr-only" role="status">
        {ideasWords(lang).loading}
      </span>
      {Array.from({ length: rows }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Placeholder rows have no identity.
        <div key={index} className="ideas-skeleton-row" aria-hidden="true">
          <span />
          <span>
            <span />
            <span />
          </span>
        </div>
      ))}
    </div>
  )
}

export function IdeasDown({ lang, onRetry }: { lang: string; onRetry: () => void }) {
  const words = ideasWords(lang)
  return (
    <section className="ideas-notice" role="alert" aria-labelledby="ideas-down">
      <h2 id="ideas-down">{words.down}</h2>
      <p>{words.downText}</p>
      <div className="ideas-actions">
        <button type="button" className="ideas-button" onClick={onRetry}>
          <RotateCw aria-hidden="true" />
          {words.retry}
        </button>
        <a className="ideas-button ideas-button-quiet" href={siteConfig.community.discord} rel="noopener noreferrer">
          <DiscordIcon />
          Discord
        </a>
        <a
          className="ideas-button ideas-button-quiet"
          href={siteConfig.community.telegramGroup}
          rel="noopener noreferrer"
        >
          <TelegramIcon />
          Telegram
        </a>
      </div>
    </section>
  )
}

export function IdeasEmpty({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  return (
    <section className="ideas-notice" aria-labelledby="ideas-empty">
      <h2 id="ideas-empty">{words.empty}</h2>
      <p>{words.emptyText}</p>
      <div className="ideas-actions">
        <Link className="ideas-button ideas-button-quiet" href={ideasPath(lang)}>
          {words.showAll}
        </Link>
        <Link className="ideas-button" href={ideasPath(lang, "new")}>
          {words.post}
        </Link>
      </div>
    </section>
  )
}

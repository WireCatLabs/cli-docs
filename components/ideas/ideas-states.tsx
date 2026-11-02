import { RotateCw } from "lucide-react"
import { DiscordIcon, TelegramIcon } from "@/components/brand-icons"
import { ideasWords } from "@/lib/ideas/words"
import siteConfig from "@/site.config.json"

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

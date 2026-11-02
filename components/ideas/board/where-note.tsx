import { DiscordIcon, GitHubIcon, TelegramIcon } from "@/components/brand-icons"
import { issuesUrl } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import siteConfig from "@/site.config.json"

/** The aside's "what goes where", as one quiet block that fits under a list or in a rail. */
export function WhereNote({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  return (
    <aside className="board-where" aria-label={words.where}>
      <p>
        {words.whereBugs}{" "}
        <a href={issuesUrl()} target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
          {words.whereBugsLink}
        </a>
      </p>
      <p>
        {words.whereChat}{" "}
        <a href={siteConfig.community.discord} target="_blank" rel="noopener noreferrer">
          <DiscordIcon />
          Discord
        </a>{" "}
        <a href={siteConfig.community.telegramGroup} target="_blank" rel="noopener noreferrer">
          <TelegramIcon />
          Telegram
        </a>
      </p>
      <p>{words.emails}</p>
    </aside>
  )
}

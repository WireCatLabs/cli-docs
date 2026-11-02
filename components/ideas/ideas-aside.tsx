import { Mail, Signpost } from "lucide-react"
import { BlogWidget } from "@/components/blog/blog-layout"
import { DiscordIcon, GitHubIcon, TelegramIcon } from "@/components/brand-icons"
import { issuesUrl } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import siteConfig from "@/site.config.json"

/** What the page is for, and where bugs and chat go instead. */
export function IdeasAside({ lang, tool }: { lang: string; tool?: string }) {
  const words = ideasWords(lang)
  return (
    <>
      <BlogWidget title={words.where} icon={<Signpost aria-hidden="true" />} className="ideas-where">
        <p>{words.whereIdeas}</p>
        <p>{words.whereBugs}</p>
        <ul className="blog-icon-links">
          <li>
            <a href={issuesUrl(tool)} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              {words.whereBugsLink}
            </a>
          </li>
        </ul>
        <p>{words.whereChat}</p>
        <ul className="blog-icon-links">
          <li>
            <a href={siteConfig.community.discord} target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
              Discord
            </a>
          </li>
          <li>
            <a href={siteConfig.community.telegramGroup} target="_blank" rel="noopener noreferrer">
              <TelegramIcon />
              Telegram
            </a>
          </li>
        </ul>
      </BlogWidget>
      <p className="ideas-emails">
        <Mail aria-hidden="true" />
        {words.emails}
      </p>
    </>
  )
}

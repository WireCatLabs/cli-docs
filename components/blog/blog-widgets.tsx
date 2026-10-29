import { FileText, Rss } from "lucide-react"
import Link from "next/link"
import { blogArchive, blogMarkdownPath, blogPath } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import siteConfig from "@/site.config.json"
import { GitHubIcon, TelegramIcon } from "../brand-icons"
import { formatMonth } from "./blog-meta"
import { NewsletterForm } from "./newsletter-form"

/** The newsletter form, or nothing until `newsletter.apiUrl` and `newsletter.turnstileSiteKey` are set. */
export function NewsletterBlock({ lang }: { lang: string }) {
  const { apiUrl, turnstileSiteKey } = siteConfig.newsletter
  if (!apiUrl || !turnstileSiteKey) return null
  return <NewsletterForm lang={lang} apiUrl={apiUrl} siteKey={turnstileSiteKey} />
}

export const newsletterReady = () => !!(siteConfig.newsletter.apiUrl && siteConfig.newsletter.turnstileSiteKey)

/** RSS, Markdown for agents, GitHub and the Telegram channel, with their real icons. */
export function FollowLinks({ lang }: { lang: string }) {
  const words = blogWords(lang)
  return (
    <ul className="blog-icon-links blog-follow">
      <li>
        <a href={blogPath(lang, "rss.xml")}>
          <Rss aria-hidden="true" />
          {words.rss}
        </a>
      </li>
      <li>
        <a href={blogMarkdownPath(lang)}>
          <FileText aria-hidden="true" />
          {words.markdown}
        </a>
      </li>
      <li>
        <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
          GitHub
        </a>
      </li>
      <li>
        <a href={siteConfig.contacts.telegram} target="_blank" rel="noopener noreferrer">
          <TelegramIcon />
          Telegram
        </a>
      </li>
    </ul>
  )
}

/** Posts per month; nothing while every post is from one month. */
export function ArchiveList({ lang }: { lang: string }) {
  const months = blogArchive(lang)
  if (months.length < 2) return null
  return (
    <ul className="blog-archive">
      {months.map(({ month, count }) => (
        <li key={month}>
          <Link href={`${blogPath(lang)}?q=${month}`}>{formatMonth(lang, month)}</Link>
          <span className="blog-count">{count}</span>
        </li>
      ))}
    </ul>
  )
}

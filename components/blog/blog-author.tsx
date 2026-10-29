import { type BlogAuthor, type BlogLocale, blogAuthor } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { GitHubIcon, LinkedInIcon, TelegramIcon } from "../brand-icons"

const aboutPath = (lang: string) => `/${lang}/about`

export function AuthorAvatar({ author, size = 36 }: { author: BlogAuthor; size?: number }) {
  if (author.avatar)
    return (
      // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
      <img className="blog-avatar" src={author.avatar} width={size} height={size} alt="" aria-hidden="true" />
    )
  return (
    <span className="blog-avatar" style={{ width: size, height: size }} aria-hidden="true">
      {author.initials}
    </span>
  )
}

/** "VP Viacheslav Ptsarev": the name links to About, where the reader learns who is behind WireCat. */
export function AuthorByline({ lang, id }: { lang: string; id?: string }) {
  const author = blogAuthor(id)
  if (!author) return null
  return (
    <a className="blog-byline" href={aboutPath(lang)} rel="author">
      <AuthorAvatar author={author} size={28} />
      <span>{author.name[lang as BlogLocale]}</span>
    </a>
  )
}

const authorLinks = (author: BlogAuthor) =>
  [
    author.links.github && { href: author.links.github, label: "GitHub", Icon: GitHubIcon },
    author.links.linkedin && { href: author.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    author.links.telegram && { href: author.links.telegram, label: "Telegram", Icon: TelegramIcon },
  ].filter((link) => !!link)

/** The author box under a post and in the index sidebar; bio and role render only when the registry has them. */
export function AuthorCard({ lang, id, compact = false }: { lang: string; id?: string; compact?: boolean }) {
  const author = blogAuthor(id)
  if (!author) return null
  const words = blogWords(lang)
  const locale = lang as BlogLocale
  return (
    <section className={compact ? "blog-author blog-author-compact" : "blog-author"} aria-label={words.author}>
      <div className="blog-author-head">
        <AuthorAvatar author={author} size={compact ? 52 : 64} />
        <div>
          {!compact && <p className="blog-kicker">{words.writtenBy}</p>}
          <p className="blog-author-name">{author.name[locale]}</p>
          {author.role && <p className="blog-author-role">{author.role[locale]}</p>}
        </div>
      </div>
      {author.bio && <p className="blog-author-bio">{author.bio[locale]}</p>}
      <ul className="blog-icon-links">
        <li>
          <a href={aboutPath(lang)}>{words.aboutWireCat}</a>
        </li>
        {authorLinks(author).map(({ href, label, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer me">
              <Icon />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

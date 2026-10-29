import { Archive, ArrowRight, Rss, Tags, UserRound } from "lucide-react"
import { type BlogPost, blogAuthor, blogPath, blogTag } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { AuthorCard } from "./blog-author"
import { PostCard } from "./blog-card"
import { BlogLayout, BlogWidget } from "./blog-layout"
import { BlogListSearch } from "./blog-search"
import { SeriesShelf } from "./blog-series"
import { TopicCloud, TopicNav } from "./blog-topics"
import { ArchiveList, FollowLinks, NewsletterBlock, newsletterReady } from "./blog-widgets"

/** What the index search matches: title, standfirst, topic labels in this language and the month. */
const searchText = (lang: string, post: BlogPost) =>
  [
    post.title,
    post.description,
    post.date,
    ...post.tags.map((id) => blogTag(id)?.label[lang as "en" | "ru" | "es"] ?? id),
  ].join(" ")

/** The index and the topic pages: one list, the first three as a lead story and two beside it. */
export function BlogList({
  lang,
  title,
  intro,
  activeTag,
  posts,
}: {
  lang: string
  title: string
  intro: string
  activeTag?: string
  posts: BlogPost[]
}) {
  const words = blogWords(lang)
  const featured = !activeTag && posts.length >= 3
  const author = blogAuthor(posts.find((post) => post.author)?.author)
  const aside = (
    <>
      {author && (
        <BlogWidget title={words.author} icon={<UserRound aria-hidden="true" />}>
          <AuthorCard lang={lang} id={author.id} compact />
        </BlogWidget>
      )}
      <BlogWidget title={words.tags} icon={<Tags aria-hidden="true" />}>
        <TopicCloud lang={lang} />
      </BlogWidget>
      <ArchiveWidget lang={lang} />
      {newsletterReady() && (
        <BlogWidget title={words.newsletter.title}>
          <NewsletterBlock lang={lang} />
        </BlogWidget>
      )}
      <BlogWidget title={words.follow} icon={<Rss aria-hidden="true" />}>
        <FollowLinks lang={lang} />
      </BlogWidget>
    </>
  )
  return (
    <BlogLayout className="blog-index" aside={posts.length ? aside : undefined}>
      <header className="blog-masthead">
        <div>
          <h1>{title}</h1>
          <p className="blog-standfirst">{intro}</p>
        </div>
        {posts.length > 0 && <BlogListSearch lang={lang} total={posts.length} />}
      </header>
      <TopicNav lang={lang} active={activeTag} />
      {posts.length ? (
        <>
          <ol className={featured ? "blog-list blog-list-featured" : "blog-list"}>
            {posts.map((post, index) => (
              <li key={post.url} data-search={searchText(lang, post)}>
                <PostCard lang={lang} post={post} variant={featured && index === 0 ? "lead" : "default"} />
              </li>
            ))}
          </ol>
          {!activeTag && <SeriesShelf lang={lang} posts={posts} />}
        </>
      ) : (
        <section className="blog-empty" aria-label={words.all}>
          <p>{words.empty}</p>
          <a className="animated-text-link text-link" href={blogPath(lang, "rss.xml")}>
            <span className="link-label">{words.rss}</span>
            <ArrowRight aria-hidden="true" />
          </a>
        </section>
      )}
    </BlogLayout>
  )
}

function ArchiveWidget({ lang }: { lang: string }) {
  const list = ArchiveList({ lang })
  if (!list) return null
  return (
    <BlogWidget title={blogWords(lang).archive} icon={<Archive aria-hidden="true" />}>
      {list}
    </BlogWidget>
  )
}

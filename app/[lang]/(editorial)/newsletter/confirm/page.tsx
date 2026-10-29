import type { Metadata } from "next"
import { NewsletterConfirm } from "@/components/blog/newsletter-confirm"
import { blogPath } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { i18n } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"
import siteConfig from "@/site.config.json"
import "@/components/blog/blog.css"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const words = blogWords(lang).newsletter.confirm
  return {
    ...pageMetadata({
      lang,
      suffix: "/newsletter/confirm",
      title: `${words.title} · WireCat`,
      description: words.text,
    }),
    robots: { index: false, follow: false },
  }
}

export default async function NewsletterConfirmPage({ params }: Props) {
  const { lang } = await params
  const words = blogWords(lang).newsletter.confirm
  return (
    <div className="wirecat-blog">
      <main id="main" className="wrap blog-page">
        <h1>{words.title}</h1>
        <NewsletterConfirm lang={lang} apiUrl={siteConfig.newsletter.apiUrl} blogHref={blogPath(lang)} />
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

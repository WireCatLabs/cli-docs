import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { type ReactNode, Suspense } from "react"
import { i18n } from "@/lib/i18n"
import { ideasEnabled, ideasSample } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import { pageMetadata } from "@/lib/seo"
import { IdeasAside } from "./ideas-aside"
import { LanguageLinksKeepQuery } from "./language-links"
import { PreviewBar } from "./preview-bar"
import { SignInNotice } from "./sign-in-notice"
import "@/components/blog/blog.css"
import "./ideas.css"

export type IdeasPageProps = { params: Promise<{ lang: string }> }

/** Only the list is indexed, and only once the API is live; forms and the per-idea shell never are. */
export async function ideasMetadata(params: IdeasPageProps["params"], suffix = "", title?: string): Promise<Metadata> {
  const { lang } = await params
  const words = ideasWords(lang)
  const metadata = pageMetadata({
    lang,
    suffix: `/ideas${suffix}`,
    title: `${title ? `${title} · ` : ""}${words.title} · WireCat`,
    description: words.description,
  })
  return suffix || ideasSample ? { ...metadata, robots: { index: false, follow: false } } : metadata
}

export const ideasStaticParams = () => i18n.languages.map((lang) => ({ lang }))

export function IdeasFrame({ lang, children }: { lang: string; children: ReactNode }) {
  if (!ideasEnabled) notFound()
  return (
    <div className="wirecat-blog wirecat-ideas">
      <main id="main" className="wrap blog-page ideas-page">
        {ideasSample && <PreviewBar lang={lang} />}
        <Suspense>
          <LanguageLinksKeepQuery />
        </Suspense>
        <SignInNotice lang={lang} />
        <div className="blog-columns">
          <div className="blog-main">{children}</div>
          <aside className="blog-sidebar ideas-sidebar">
            <IdeasAside lang={lang} />
          </aside>
        </div>
      </main>
    </div>
  )
}

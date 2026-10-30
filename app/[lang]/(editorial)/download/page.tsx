import type { Metadata } from "next"
import { DownloadView } from "@/components/download-view"
import { StructuredData } from "@/components/structured-data"
import { buildSnapshot, detectOs } from "@/lib/desktop-releases"
import { downloadWords } from "@/lib/download"
import { i18n } from "@/lib/i18n"
import { pageMetadata, pageStructuredData, seoWords } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
import "@/lib/docs-usability.css"
import "@/lib/landing/download.css"

type Props = { params: Promise<{ lang: string }> }

// Runs before the first paint, so the matching button shows without a jump; without JS all systems stay equal.
const detectScript = `try{document.currentScript.parentElement.dataset.os=(${detectOs})(navigator)}catch(e){}`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const words = downloadWords(lang)
  return pageMetadata({ lang, suffix: "/download", title: words.title, description: words.description })
}

export default async function DownloadPage({ params }: Props) {
  const { lang } = await params
  const words = downloadWords(lang)
  const releases = await buildSnapshot()
  return (
    <div className="wirecat-download" suppressHydrationWarning>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed string built from our own function. */}
      <script dangerouslySetInnerHTML={{ __html: detectScript }} />
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: `/${lang}/download`,
          title: words.title,
          description: words.description,
          breadcrumbs: [
            { name: seoWords(lang).homeLabel, pathname: homePath(lang) },
            { name: words.title, pathname: `/${lang}/download` },
          ],
        })}
      />
      <DownloadView lang={lang} initial={releases ?? []} />
    </div>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

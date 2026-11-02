import { IdeasPage } from "@/components/ideas/board/ideas-page"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { StructuredData } from "@/components/structured-data"
import { ideasWords } from "@/lib/ideas/words"
import { pageStructuredData, seoWords } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"

export const generateMetadata = ({ params }: IdeasPageProps) => ideasMetadata(params)
export const generateStaticParams = ideasStaticParams

export default async function Ideas({ params }: IdeasPageProps) {
  const { lang } = await params
  const words = ideasWords(lang)
  const pathname = `/${lang}/ideas`
  return (
    <IdeasFrame lang={lang} columns={false}>
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname,
          title: words.title,
          description: words.description,
          breadcrumbs: [
            { name: seoWords(lang).homeLabel, pathname: homePath(lang) },
            { name: words.title, pathname },
          ],
        })}
      />
      <IdeasPage lang={lang} />
    </IdeasFrame>
  )
}

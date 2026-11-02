import { IdeasPage } from "@/components/ideas/board/ideas-page"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"

export const generateMetadata = ({ params }: IdeasPageProps) => ideasMetadata(params)
export const generateStaticParams = ideasStaticParams

export default async function Ideas({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang} columns={false}>
      <IdeasPage lang={lang} />
    </IdeasFrame>
  )
}

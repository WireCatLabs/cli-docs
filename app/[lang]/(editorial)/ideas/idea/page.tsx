import { ForwardToBoard } from "@/components/ideas/forward"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"

export const generateMetadata = ({ params }: IdeasPageProps) => ideasMetadata(params, "/idea")
export const generateStaticParams = ideasStaticParams

export default async function IdeaPage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang}>
      <ForwardToBoard lang={lang} />
    </IdeasFrame>
  )
}

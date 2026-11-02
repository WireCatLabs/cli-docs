import { Suspense } from "react"
import { IdeaView } from "@/components/ideas/idea-view"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { IdeasSkeleton } from "@/components/ideas/ideas-states"

export const generateMetadata = ({ params }: IdeasPageProps) => ideasMetadata(params, "/idea")
export const generateStaticParams = ideasStaticParams

export default async function IdeaPage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang}>
      <Suspense fallback={<IdeasSkeleton lang={lang} rows={1} />}>
        <IdeaView lang={lang} />
      </Suspense>
    </IdeasFrame>
  )
}

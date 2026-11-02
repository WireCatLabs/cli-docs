import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { UnsubscribePanel } from "@/components/ideas/unsubscribe-panel"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = async ({ params }: IdeasPageProps) =>
  ideasMetadata(params, "/unsubscribe", ideasWords((await params).lang).unsubscribe.title)
export const generateStaticParams = ideasStaticParams

export default async function UnsubscribePage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang}>
      <UnsubscribePanel lang={lang} />
    </IdeasFrame>
  )
}

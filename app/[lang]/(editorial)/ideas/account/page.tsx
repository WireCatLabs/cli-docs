import { AccountPanel } from "@/components/ideas/account-panel"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = async ({ params }: IdeasPageProps) =>
  ideasMetadata(params, "/account", ideasWords((await params).lang).account.title)
export const generateStaticParams = ideasStaticParams

export default async function AccountPage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang}>
      <AccountPanel lang={lang} />
    </IdeasFrame>
  )
}

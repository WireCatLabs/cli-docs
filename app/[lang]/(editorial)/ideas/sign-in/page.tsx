import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { SignInPanel } from "@/components/ideas/sign-in-panel"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = async ({ params }: IdeasPageProps) =>
  ideasMetadata(params, "/sign-in", ideasWords((await params).lang).signIn.title)
export const generateStaticParams = ideasStaticParams

export default async function SignInPage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <IdeasFrame lang={lang}>
      <SignInPanel lang={lang} />
    </IdeasFrame>
  )
}

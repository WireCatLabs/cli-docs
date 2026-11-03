import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { SignInPanel } from "@/components/ideas/sign-in-panel"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = async ({ params }: IdeasPageProps) =>
  ideasMetadata(params, "/sign-in", ideasWords((await params).lang).signIn.title)
export const generateStaticParams = ideasStaticParams

// Runs before the static form paints, so a reader arriving from the emailed link sees "Signing you in", not the form.
const linkCover = `if(/[#&]token=/.test(location.hash))document.documentElement.dataset.signInLink=""`

export default async function SignInPage({ params }: IdeasPageProps) {
  const { lang } = await params
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: A fixed string with nothing from the request in it. */}
      <script dangerouslySetInnerHTML={{ __html: linkCover }} />
      <IdeasFrame lang={lang}>
        <SignInPanel lang={lang} />
      </IdeasFrame>
    </>
  )
}

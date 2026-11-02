import { IdeaForm } from "@/components/ideas/idea-form"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = async ({ params }: IdeasPageProps) =>
  ideasMetadata(params, "/new", ideasWords((await params).lang).form.title)
export const generateStaticParams = ideasStaticParams

export default async function NewIdeaPage({ params }: IdeasPageProps) {
  const { lang } = await params
  const words = ideasWords(lang).form
  return (
    <IdeasFrame lang={lang}>
      <header className="ideas-masthead ideas-masthead-form">
        <h1>{words.title}</h1>
        <p className="blog-standfirst">{words.intro}</p>
      </header>
      <IdeaForm lang={lang} />
    </IdeasFrame>
  )
}

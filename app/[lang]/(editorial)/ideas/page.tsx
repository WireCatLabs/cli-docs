import { Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { VariantGate } from "@/components/ideas/board/variant-gate"
import { IdeasBoard } from "@/components/ideas/ideas-board"
import { IdeasFrame, type IdeasPageProps, ideasMetadata, ideasStaticParams } from "@/components/ideas/ideas-frame"
import { IdeasSkeleton } from "@/components/ideas/ideas-states"
import { ideasPath } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"

export const generateMetadata = ({ params }: IdeasPageProps) => ideasMetadata(params)
export const generateStaticParams = ideasStaticParams

export default async function IdeasPage({ params }: IdeasPageProps) {
  const { lang } = await params
  const words = ideasWords(lang)
  const page = (
    <IdeasFrame lang={lang}>
      <header className="ideas-masthead">
        <div>
          <h1>{words.title}</h1>
          <p className="blog-standfirst">{words.intro}</p>
        </div>
        <Link className="ideas-button" href={ideasPath(lang, "new")}>
          <Plus aria-hidden="true" />
          {words.post}
        </Link>
      </header>
      <Suspense fallback={<IdeasSkeleton lang={lang} />}>
        <IdeasBoard lang={lang} />
      </Suspense>
    </IdeasFrame>
  )
  return (
    <Suspense fallback={page}>
      <VariantGate lang={lang}>{page}</VariantGate>
    </Suspense>
  )
}

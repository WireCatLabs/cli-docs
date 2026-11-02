"use client"

import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import { boardVariants, isBoardVariant } from "@/lib/ideas/board/types"
import { MemberBar } from "../member-bar"
import { PreviewBar } from "../preview-bar"
import { VariantA } from "./variant-a"
import { VariantB } from "./variant-b"
import { VariantC } from "./variant-c"
import "@/components/blog/blog.css"
import "../ideas.css"
import "./board.css"

const variants = { a: VariantA, b: VariantB, c: VariantC }

/** `next dev` only: `?variant=a|b|c` swaps the page for one of the redesign variants, on sample data. */
export function VariantGate({ lang, children }: { lang: string; children: ReactNode }) {
  const params = useSearchParams()
  const variant = params.get("variant")
  if (process.env.NODE_ENV !== "development" || !isBoardVariant(variant)) return children
  const Variant = variants[variant]
  const href = (next: string) => {
    const search = new URLSearchParams(params)
    search.set("variant", next)
    search.delete("id")
    return `?${search}`
  }
  return (
    <div className="wirecat-blog wirecat-ideas board-host">
      <main id="main" className="wrap board-page" data-variant={variant}>
        <div className="board-dev">
          <PreviewBar lang={lang} />
          <nav className="ideas-preview" aria-label="Variant">
            <span>Variant</span>
            <ul>
              {boardVariants.map((option) => (
                <li key={option}>
                  <a href={href(option)} aria-current={option === variant ? "true" : undefined}>
                    {option.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <MemberBar lang={lang} />
        <Variant lang={lang} />
      </main>
    </div>
  )
}

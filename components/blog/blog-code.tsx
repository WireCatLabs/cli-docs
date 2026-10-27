"use client"

import { Check, Copy } from "lucide-react"
import { useParams } from "next/navigation"
import { type ComponentProps, useRef, useState } from "react"
import { notifyCopyFeedback } from "@/lib/copy-feedback"

const labels = { en: "Copy code", ru: "Скопировать код", es: "Copiar código" }

export function BlogCode({ children, ...props }: ComponentProps<"pre"> & { "data-code-label"?: string }) {
  const pre = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const { lang } = useParams<{ lang: keyof typeof labels }>()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pre.current?.textContent ?? "")
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      notifyCopyFeedback(true)
    } catch {
      notifyCopyFeedback(false)
    }
  }
  return (
    <figure className="blog-code" aria-label={props["data-code-label"]}>
      <pre ref={pre} {...props}>
        {children}
      </pre>
      <button type="button" onClick={copy} aria-label={labels[lang] ?? labels.en}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </button>
    </figure>
  )
}

"use client"

import { Check, Link2 } from "lucide-react"
import { useState } from "react"
import { blogWords } from "@/lib/blog-words"
import { LinkedInIcon, TelegramIcon, XIcon } from "../brand-icons"

/** Copy-link plus share intents; the absolute URL comes from the page the reader is on. */
export function ShareLinks({ lang, title, url }: { lang: string; title: string; url: string }) {
  const words = blogWords(lang)
  const [copied, setCopied] = useState(false)
  const absolute = `https://wirecat.dev${url}`
  const encoded = encodeURIComponent(absolute)
  const text = encodeURIComponent(title)
  const targets = [
    { label: "X", href: `https://x.com/intent/post?url=${encoded}&text=${text}`, Icon: XIcon },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, Icon: LinkedInIcon },
    { label: "Telegram", href: `https://t.me/share/url?url=${encoded}&text=${text}`, Icon: TelegramIcon },
  ]
  const copy = async () => {
    await navigator.clipboard.writeText(absolute)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <ul className="blog-share" aria-label={words.share}>
      <li>
        <button type="button" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
          <span aria-live="polite">{copied ? words.copied : words.copyLink}</span>
        </button>
      </li>
      {targets.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${words.share}: ${label}`}>
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}

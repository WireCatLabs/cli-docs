"use client"

import { Check, Copy, MessageSquareText, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { type InstallationEventContext, trackSiteEvent } from "@/lib/site-events"
import { wordsFor } from "@/lib/words"

const labels = {
  en: { prompt: "Prompt", command: "Command" },
  ru: { prompt: "Промпт", command: "Команда" },
  es: { prompt: "Prompt", command: "Comando" },
}

export function CopyText({
  text,
  lang,
  kind = "command",
  tracking,
}: {
  text: string
  lang: string
  kind?: "prompt" | "command"
  tracking?: InstallationEventContext
}) {
  const words = wordsFor(lang).onboarding
  const label = (labels[lang as keyof typeof labels] ?? labels.en)[kind]
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  useEffect(() => {
    if (status !== "copied") return
    const timer = setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(timer)
  }, [status])
  const Icon = kind === "prompt" ? MessageSquareText : Terminal
  return (
    <div className={`not-prose docs-snippet docs-${kind}`}>
      <div className="docs-snippet-bar">
        <span className="docs-snippet-label">
          <Icon size={15} aria-hidden="true" />
          {label}
        </span>
        <button
          type="button"
          disabled={!ready}
          className="docs-copy"
          aria-label={`${words.copy}: ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setStatus("copied")
              if (tracking) trackSiteEvent("installation_command_copy", tracking)
            } catch {
              setStatus("failed")
            }
          }}
        >
          {status === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          {status === "copied" ? words.copied : words.copy}
        </button>
      </div>
      <pre>
        <code>{text}</code>
      </pre>
      <span role="status" className="docs-copy-status">
        {status === "failed" ? words.copyFailed : status === "copied" ? words.copied : ""}
      </span>
    </div>
  )
}

export function AgentPrompt({
  text,
  language = "en",
}: {
  text: string
  language?: string
  children?: React.ReactNode
}) {
  return <CopyText text={text} lang={language} kind="prompt" />
}

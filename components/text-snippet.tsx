"use client"

import { Check, ChevronDown, Copy, MessageSquareText, Terminal } from "lucide-react"
import { useEffect, useId, useState } from "react"
import { notifyCopyFeedback } from "@/lib/copy-feedback"
import { type InstallationEventContext, trackSiteEvent } from "@/lib/site-events"
import { wordsFor } from "@/lib/words"

const labels = {
  en: { prompt: "Request", command: "Command" },
  ru: { prompt: "Запрос", command: "Команда" },
  es: { prompt: "Petición", command: "Comando" },
}

// The async clipboard API is missing on plain-HTTP origins and in some embedded browsers.
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.opacity = "0"
    document.body.append(area)
    area.select()
    const copied = document.execCommand("copy")
    area.remove()
    if (!copied) throw new Error("Copy failed")
  }
}

export function CopyText({
  text,
  lang,
  kind = "command",
  tracking,
  compact = false,
  collapsed = false,
}: {
  text: string
  lang: string
  kind?: "prompt" | "command"
  tracking?: InstallationEventContext
  compact?: boolean
  collapsed?: boolean
}) {
  const words = wordsFor(lang).onboarding
  const label = (labels[lang as keyof typeof labels] ?? labels.en)[kind]
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  const [expanded, setExpanded] = useState(!collapsed)
  const bodyId = useId()
  useEffect(() => {
    if (status !== "copied") return
    const timer = setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(timer)
  }, [status])
  const Icon = kind === "prompt" ? MessageSquareText : Terminal
  return (
    <div
      className={`not-prose docs-snippet docs-${kind}${compact ? " docs-snippet-compact" : ""}${
        collapsed ? " docs-snippet-collapsible" : ""
      }`}
      data-expanded={collapsed ? expanded : undefined}
    >
      <div className="docs-snippet-bar">
        <span className={compact ? "sr-only" : "docs-snippet-label"}>
          <Icon size={15} aria-hidden="true" />
          {label}
        </span>
        <button
          type="button"
          disabled={!ready}
          className="docs-copy"
          aria-label={`${status === "copied" ? words.copied : words.copy}: ${label}`}
          onClick={async () => {
            try {
              await writeClipboard(text)
              setStatus("copied")
              notifyCopyFeedback(true)
              if (tracking) trackSiteEvent("installation_command_copy", tracking)
            } catch {
              setExpanded(true)
              setStatus("failed")
              notifyCopyFeedback(false)
            }
          }}
        >
          {status === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          <span className={compact ? "sr-only" : undefined}>{status === "copied" ? words.copied : words.copy}</span>
        </button>
      </div>
      <pre id={bodyId}>
        <code>{text}</code>
      </pre>
      {collapsed && (
        <button
          type="button"
          disabled={!ready}
          className="docs-snippet-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={(event) => {
            const toggle = event.currentTarget
            setExpanded(!expanded)
            // Collapsing a long request would otherwise leave the reader far below the block.
            if (expanded) requestAnimationFrame(() => toggle.scrollIntoView({ block: "nearest" }))
          }}
        >
          <ChevronDown size={16} aria-hidden="true" />
          {expanded ? words.collapse : words.expand}
        </button>
      )}
      <span role="status" className="docs-copy-status">
        {status === "failed" ? words.copyFailed : status === "copied" ? words.copied : ""}
      </span>
    </div>
  )
}

export function AgentPrompt({
  text,
  language = "en",
  compact = false,
  collapsed = false,
}: {
  text: string
  language?: string
  compact?: boolean
  collapsed?: boolean
  children?: React.ReactNode
}) {
  return <CopyText text={text} lang={language} kind="prompt" compact={compact} collapsed={collapsed} />
}

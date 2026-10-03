"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { Tool } from "@/lib/shared"
import { siteUrl } from "@/lib/shared"
import { wordsFor } from "@/lib/words"

function CopyText({ text, lang }: { text: string; lang: string }) {
  const words = wordsFor(lang).onboarding
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  return (
    <div className="space-y-2">
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-fd-muted p-3 text-xs leading-relaxed">
        <code>{text}</code>
      </pre>
      <button
        type="button"
        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-fd-muted"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setStatus("copied")
          } catch {
            setStatus("failed")
          }
        }}
      >
        {words.copy}
      </button>
      <span role="status" className="ml-3 text-xs text-fd-muted-foreground">
        {status === "copied" ? words.copied : status === "failed" ? words.copyFailed : ""}
      </span>
    </div>
  )
}

export function InstallTool({ tool, lang }: { tool: Tool; lang: string }) {
  const words = wordsFor(lang)
  const ui = words.onboarding
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const followHash = () => {
      if (window.location.hash === `#${tool.name}`) setOpen(true)
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [tool.name])
  const docs = `${siteUrl}/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`
  const login = tool.name === "tg" ? "session start --app auto" : "session start qr"
  const installer = `& ([scriptblock]::Create((Invoke-RestMethod '${siteUrl}/install.ps1'))) -Tool ${tool.name} -Agent all`
  return (
    <details
      id={tool.name}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group min-w-0 scroll-mt-20 rounded-xl border bg-fd-card"
    >
      <summary className="cursor-pointer rounded-xl px-5 py-4 text-center font-semibold hover:bg-fd-muted focus-visible:outline-2 focus-visible:outline-offset-2">
        {words.install} {tool.name === "tg" ? "Telegram" : "MAX"}
      </summary>
      <div className="space-y-4 border-t p-5">
        <p className="text-sm text-fd-muted-foreground">{ui.paste}</p>
        <CopyText lang={lang} text={ui.prompt(tool.name, tool.package, docs)} />
        <Link href={`/${lang}/docs/agents`} className="inline-block text-sm underline">
          {words.navigation.agents} →
        </Link>
        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer text-sm font-medium">{ui.terminal}</summary>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-fd-muted-foreground">{ui.requirements}</p>
            <a href="https://nodejs.org/en/download" className="text-sm underline">
              Node.js ↗
            </a>
            <CopyText
              lang={lang}
              text={`npm install -g ${tool.package}\n${tool.name} skill install --for all\n${tool.name} --version\n${tool.name} doctor`}
            />
            <p className="text-sm text-fd-muted-foreground">{ui.windows}</p>
            <CopyText lang={lang} text={installer} />
            <p className="text-sm font-medium">{ui.login}</p>
            <CopyText lang={lang} text={`${tool.name} ${login}`} />
            {tool.name === "tg" && <p className="text-sm text-fd-muted-foreground">{ui.telegram}</p>}
            <CopyText
              lang={lang}
              text={`${tool.name} account show\n${tool.name} chats list --limit 5\n${tool.name} inbox --limit 5`}
            />
            <Link href={`/${lang}/docs/${tool.name}/sessions`} className="inline-block text-sm underline">
              {words.docs} →
            </Link>
          </div>
        </details>
        <p className="text-xs text-fd-muted-foreground">{ui.timing}</p>
        <p className="text-xs text-fd-muted-foreground">{ui.browser}</p>
      </div>
    </details>
  )
}

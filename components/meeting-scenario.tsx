// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Only reviewed, repository-owned landing scenario HTML is rendered; no user input is accepted.
"use client"

import "@/lib/landing/scenarios.css"
import "./meeting-scenario.css"
import { RotateCcw, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { MeetingSession, meetingCopy } from "@/lib/meeting-guide"

type Props = { sessions: { tg: MeetingSession; max: MeetingSession }; text: typeof meetingCopy.en }
export function MeetingScenario({ sessions, text }: Props) {
  const [tool, setTool] = useState<"tg" | "max">("tg")
  const [shown, setShown] = useState(0)
  const [target, setTarget] = useState(0)
  const [copyStatus, setCopyStatus] = useState("")
  const pending = useRef<HTMLDivElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const steps = sessions[tool].steps
  const running = shown < target
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(
      () => setShown(shown + 1),
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : steps[shown - 1]?.tool ? 700 : 450,
    )
    return () => clearTimeout(timer)
  }, [running, shown, steps])
  useEffect(() => {
    if (shown === 0 || running || !pending.current) return
    pending.current.scrollIntoView({
      block: "nearest",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
    pending.current.querySelector<HTMLButtonElement>(".meeting-send")?.focus({ preventScroll: true })
  }, [shown, running])
  useEffect(() => {
    const root = log.current
    if (!root) return
    const copy = async (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const button = event.target.closest<HTMLButtonElement>("[data-prompt]")
      if (!button) return
      try {
        await navigator.clipboard.writeText(button.dataset.prompt ?? "")
        setCopyStatus(text.copied)
      } catch {
        setCopyStatus(text.copyFailed)
      }
    }
    root.addEventListener("click", copy)
    return () => root.removeEventListener("click", copy)
  }, [text])
  const reset = (next: "tg" | "max" = tool) => {
    setTool(next)
    setShown(0)
    setTarget(0)
    setCopyStatus("")
  }
  const send = () => {
    const next = steps.findIndex((step, i) => i > shown && step.html.startsWith('<div class="ask'))
    setCopyStatus("")
    setShown(shown + 1)
    setTarget(next === -1 ? steps.length : next)
  }
  return (
    <div className="not-prose wirecat-landing meeting-scenario" data-meeting-scenario>
      <p className="meeting-hint">{text.hint}</p>
      <div className="app">
        <div className="titlebar">
          <span>{text.title}</span>
          <fieldset className="demo-messengers" aria-label="Telegram / MAX">
            {(["tg", "max"] as const).map((value) => (
              <button key={value} type="button" aria-pressed={tool === value} onClick={() => reset(value)}>
                {value === "tg" ? "Telegram" : "MAX"}
              </button>
            ))}
          </fieldset>
          <button type="button" className="replay" onClick={() => reset()} aria-label={text.restart}>
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
        <div className="log" ref={log}>
          {steps.slice(0, shown).map((step, index) => {
            const executing = running && index === shown - 1 && step.tool
            const html = executing
              ? step.html
                  .replace('class="tool step"', 'class="tool step running"')
                  .replace(
                    /<span class="state">[\s\S]*?<\/span>/,
                    '<span class="state"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 2a6 6 0 1 1-6 6"/></svg></span>',
                  )
              : step.html
            return <div key={step.html} className="meeting-step" dangerouslySetInnerHTML={{ __html: html }} />
          })}
          {!running && shown < steps.length && (
            <div ref={pending} className="meeting-composer" data-meeting-pending>
              <div dangerouslySetInnerHTML={{ __html: steps[shown].html }} />
              <button className="meeting-send" type="button" onClick={send}>
                <Send size={16} aria-hidden="true" />
                {text.send}
              </button>
            </div>
          )}
          {running && (
            <div className="meeting-typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
          <p role="status" className="meeting-status">
            {running ? text.working : shown === steps.length ? text.finished : copyStatus}
          </p>
        </div>
      </div>
    </div>
  )
}

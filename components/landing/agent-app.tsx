"use client"

import { useEffect, useRef, useState } from "react"

export type Step = { ask: string } | { tool: string; out: string } | { say: string }
export type Session = { title: string; hint: string; steps: Step[] }

const highlight = (json: string) =>
  json
    .replace(/"([a-zA-Z]+)":/g, '<span class="k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
    .replace(/: (\d+|true|false)/g, ': <span class="n">$1</span>')

const Tick = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8.5l3 3 7-7" />
  </svg>
)
const Spin = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M8 2a6 6 0 1 1-6 6" />
  </svg>
)

function StepView({ step, running }: { step: Step; running: boolean }) {
  if ("ask" in step) return <div className="ask step">{step.ask}</div>
  if ("say" in step) return <div className="say step" dangerouslySetInnerHTML={{ __html: step.say }} />
  return (
    <details className={`tool step${running ? " running" : ""}`}>
      <summary>
        <span className="state">{running ? <Spin /> : <Tick />}</span>
        <code dangerouslySetInnerHTML={{ __html: step.tool }} />
        <svg
          className="chev"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </summary>
      <pre dangerouslySetInnerHTML={{ __html: highlight(step.out) }} />
    </details>
  )
}

export function AgentApp({
  sessions,
  title,
  replay,
  sessionsLabel,
  placeholder,
}: {
  sessions: Session[]
  title: string
  replay: string
  sessionsLabel: string
  placeholder: string
}) {
  const [current, setCurrent] = useState(0)
  const [shown, setShown] = useState(Number.POSITIVE_INFINITY)
  const [running, setRunning] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const app = useRef<HTMLDivElement>(null)

  const play = (index: number) => {
    for (const timer of timers.current) clearTimeout(timer)
    timers.current = []
    setCurrent(index)
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(Number.POSITIVE_INFINITY)
      return
    }
    setPlaying(true)
    setShown(0)
    let at = 0
    sessions[index]?.steps.forEach((step, n) => {
      at += "ask" in step ? 500 : "tool" in step ? 600 : 900
      timers.current.push(
        setTimeout(() => {
          setShown(n + 1)
          if ("tool" in step) setRunning(n)
        }, at),
      )
      if ("tool" in step) {
        at += 700
        timers.current.push(setTimeout(() => setRunning(-1), at))
      }
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: plays once, when the window first scrolls into view
  useEffect(() => {
    const node = app.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          play(0)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      for (const timer of timers.current) clearTimeout(timer)
    }
  }, [])

  const steps = sessions[current]?.steps.slice(0, shown) ?? []
  return (
    <div className={`app${playing ? " playing" : ""}`} ref={app}>
      <div className="titlebar">
        <i />
        <i />
        <i />
        <span>{title}</span>
        <button className="replay" type="button" onClick={() => play(current)}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M2.5 8a5.5 5.5 0 1 0 1.8-4.1M2.5 2v3.5H6" />
          </svg>
          {replay}
        </button>
      </div>
      <div className="app-body">
        <nav className="sessions" aria-label={sessionsLabel}>
          <h2>{sessionsLabel}</h2>
          {sessions.map((session, index) => (
            <button
              key={session.title}
              className="session"
              type="button"
              aria-current={index === current}
              onClick={() => play(index)}
            >
              {session.title}
              <small>{session.hint}</small>
            </button>
          ))}
        </nav>
        <div className="conv">
          <div className="log">
            {steps.map((step, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: steps never reorder within a session
              <StepView key={`${current}-${index}`} step={step} running={index === running} />
            ))}
          </div>
          <div className="composer">
            <span>{placeholder}</span>
            <span className="slash">/catch-up</span>
            <span className="slash">/review</span>
            <span className="slash">/reply</span>
            <span className="slash">/find</span>
          </div>
        </div>
      </div>
    </div>
  )
}

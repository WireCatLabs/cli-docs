export type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

export function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  return new Promise((resolve, reject) => {
    const script =
      document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`) ?? document.createElement("script")
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject()))
    script.addEventListener("error", () => reject())
    if (!script.parentElement) {
      script.src = scriptUrl
      script.async = true
      document.head.append(script)
    }
  })
}

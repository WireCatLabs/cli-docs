// amoCRM's own button script (www.amocrm.ru/auth/button.min.js) did not draw its button in some browsers: it waits
// for window.onload, and blockers drop it. This page builds the same consent URL and opens it itself, so no outside
// script runs here. A file, not an inline script, so the CSP can refuse inline code.
const TEXT = {
  en: {
    title: "Connect amoCRM",
    ready: "Click the button, choose your account and allow access. amo on your computer finishes the sign-in.",
    missing: "Start the sign-in from amo or WireCat Desktop. It opens this page with the link it needs.",
    button: "Sign in with amoCRM",
    description: "WireCat amo: amoCRM in the terminal and for AI agents",
  },
  ru: {
    title: "Подключить amoCRM",
    ready: "Нажмите кнопку, выберите аккаунт и разрешите доступ. amo на вашем компьютере завершит вход.",
    missing: "Начните вход из amo или WireCat Desktop. Они откроют эту страницу с нужной ссылкой.",
    button: "Войти через amoCRM",
    description: "WireCat amo: amoCRM в терминале и для ИИ-агентов",
  },
  es: {
    title: "Conectar amoCRM",
    ready: "Pulsa el botón, elige tu cuenta y permite el acceso. amo en tu ordenador termina el inicio de sesión.",
    missing: "Empieza el inicio de sesión desde amo o WireCat Desktop. Abren esta página con el enlace que necesita.",
    button: "Entrar con amoCRM",
    description: "WireCat amo: amoCRM en el terminal y para agentes de IA",
  },
}
const lang = (navigator.language || "en").slice(0, 2).toLowerCase()
const text = TEXT[lang] || TEXT.en
document.documentElement.lang = TEXT[lang] ? lang : "en"
document.title = `amo: ${text.title}`
document.getElementById("title").textContent = text.title

const state = new URLSearchParams(location.hash.slice(1)).get("state") ?? ""
// location.href goes to amoCRM as the origin, so the state must not stay in it.
history.replaceState(null, "", location.pathname)
const match = /^(\d{4,5})\.[A-Za-z0-9_-]{43,128}$/.exec(state)
const port = match ? Number(match[1]) : 0
const status = document.getElementById("status")

const CALLBACK = "https://connect.wirecat.dev/webhooks/apps/amo-callback"
const AMOCRM_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*amocrm\.ru$/

const consentUrl = () => {
  const query = new URLSearchParams({
    state,
    mode: "popup",
    origin: location.href,
    name: "WireCat",
    description: text.description,
    redirect_uri: CALLBACK,
    secrets_uri: "https://connect.wirecat.dev/api/amo/secrets",
    logo: "https://connect.wirecat.dev/connect/wirecat-amo-logo.png",
  })
  query.append("scopes[]", "crm")
  return `https://www.amocrm.ru/oauth/?${query}`
}

const openConsent = () => {
  const width = 750
  const height = 580
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2)
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2)
  const popup = window.open(
    consentUrl(),
    "amocrm_oauth",
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  )
  if (!popup) location.assign(consentUrl())
}

// amoCRM's consent window may hand this page the address to go on to. Only our own callback is followed, so a
// message cannot send this window anywhere else.
window.addEventListener("message", (event) => {
  if (!AMOCRM_ORIGIN.test(event.origin)) return
  const url = typeof event.data?.url === "string" ? event.data.url : ""
  if (url.startsWith(`${CALLBACK}?`)) location.assign(url)
  else if (event.data?.error) status.textContent = String(event.data.error)
})

if (port >= 1024 && port <= 65535) {
  status.textContent = text.ready
  const button = document.getElementById("button")
  button.textContent = text.button
  button.hidden = false
  button.addEventListener("click", openConsent)
} else {
  status.textContent = text.missing
}

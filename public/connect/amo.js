// A file, not an inline script, so the CSP can refuse inline code: amoCRM's button script moves this window to any
// `url` posted to it, and without 'unsafe-inline' a posted javascript: URL cannot run.
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
// The button script appends location.href to amoCRM's URL unencoded: a fragment left here would swallow the
// parameters after it, and would send the state to amoCRM as the origin.
history.replaceState(null, "", location.pathname)
const match = /^(\d{4,5})\.[A-Za-z0-9_-]{43,128}$/.exec(state)
const port = match ? Number(match[1]) : 0
const status = document.getElementById("status")

if (port >= 1024 && port <= 65535) {
  status.textContent = text.ready
  const button = document.createElement("script")
  button.className = "amocrm_oauth"
  button.src = "https://www.amocrm.ru/auth/button.min.js"
  // The button script puts these values into amoCRM's URL as they are, so free text is encoded here.
  Object.assign(button.dataset, {
    name: "WireCat",
    description: encodeURIComponent(text.description),
    redirect_uri: "https://wirecat.dev/webhooks/apps/amo-callback",
    secrets_uri: "https://wirecat.dev/api/amo/secrets",
    logo: "https://wirecat.dev/connect/wirecat-amo-logo.png",
    scopes: "crm",
    title: text.button,
    state,
    mode: "popup",
  })
  // Inserted while the page still parses, so the script's window.onload handler still runs.
  document.getElementById("button").append(button)
} else {
  status.textContent = text.missing
}

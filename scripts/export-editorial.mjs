/** Export the owner-selected editorial source. Private variants never enter public/. */
import { readFile, writeFile } from "node:fs/promises"
import postcss from "postcss"
import { wordsFor } from "../lib/words.ts"

const sourceDir = new URL("../design/homepage-chat-treatments/", import.meta.url)
const source = JSON.parse(await readFile(new URL("release-source.json", sourceDir), "utf8"))
const locales = JSON.parse(await readFile(new URL("release-locales.json", sourceDir), "utf8"))
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
const decode = (value) =>
  value.replace(
    /&(?:amp|lt|gt|quot|#39);/g,
    (c) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" })[c],
  )
const ui = {
  en: { language: "Language", skip: "Skip to content", title: "WireCat", features: "Features", examples: "Examples" },
  ru: {
    language: "Язык",
    skip: "Перейти к содержимому",
    title: "WireCat",
    features: "Возможности",
    examples: "Примеры",
  },
  es: { language: "Idioma", skip: "Ir al contenido", title: "WireCat", features: "Funciones", examples: "Ejemplos" },
}
for (const lang of ["en", "ru", "es"]) {
  const dict = lang === "en" ? {} : locales[lang]
  const text = (value) => {
    const trimmed = decode(value.trim())
    return dict[trimmed] ? value.replace(value.trim(), escapeHtml(dict[trimmed])) : value
  }
  const pages = {}
  for (const [kind, original] of Object.entries(source)) {
    let html = original.replace(/<nav[^>]*class="[^"]*compact-compare-nav[^>]*>[\s\S]*?<\/nav>/, "")
    // Generated sample result is rendered afresh by the shared search engine.
    html = html
      .replace(/(<div class="mini-search-status"[^>]*>)[\s\S]*?(<\/div>)/, "$1$2")
      .replace(
        /(<div class="mini-search-results"[^>]*>)[\s\S]*?(<\/div><p class="feature-caption">)/,
        '$1</div><p class="feature-caption">',
      )
    // Give every copy control the same success icon without replacing its label.
    html = html.replace(/(<button\b[^>]*\bdata-copy="[^"]*"[^>]*>)([\s\S]*?)(<\/button>)/g, (_, open, body, close) => {
      const icon =
        '<svg class="copy-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>'
      return open + body.replace("<svg ", '<svg class="copy-idle-icon" ') + icon + close
    })
    const protectedBlocks = []
    html = html.replace(/<(pre|code)\b[\s\S]*?<\/\1>/g, (block) => {
      protectedBlocks.push(block)
      return `<!--EDITORIAL-CODE-${protectedBlocks.length - 1}-->`
    })
    html = html.replace(/>([^<>]*)</g, (_, value) => `>${text(value)}<`)
    html = html.replace(/<!--EDITORIAL-CODE-(\d+)-->/g, (_, i) => protectedBlocks[Number(i)])
    html = html.replace(/(aria-label|title|placeholder|data-copy)="([^"]*)"/g, (_, attr, value) => {
      let translated = text(value)
      const decoded = decode(value)
      const prompt = /^Use (tg|max) cli\. ([\s\S]+)$/.exec(decoded)
      if (prompt && dict[prompt[2]])
        translated = escapeHtml(
          `${lang === "ru" ? "Используй" : lang === "es" ? "Usa" : "Use"} ${prompt[1]} cli. ${dict[prompt[2]]}`,
        )
      return `${attr}="${translated}"`
    })
    for (const tool of ["tg", "max"]) {
      const english = wordsFor("en").onboarding.prompt(tool, `@leemour/${tool}-cli`)
      html = html.replaceAll(
        escapeHtml(english),
        escapeHtml(wordsFor(lang).onboarding.prompt(tool, `@leemour/${tool}-cli`)),
      )
    }
    html = html.replace(
      /href="(https:\/\/wirecat\.dev)?\/(en|ru|es)\/([^"#]*)([^"]*)"/g,
      (_, _origin, _locale, path, rest) => `href="/${lang}/${path}${rest}"`,
    )
    html = html.replace(
      /href="\/(landing|features-roles|features|examples)([?][^"]*)?"/g,
      (_, page, query = "") =>
        `href="${page === "landing" ? (lang === "en" ? "/" : `/${lang}`) : `/${lang}/${page.startsWith("features") ? "features" : "examples"}`}${query}"`,
    )
    html = html.replace('aria-label="WireCat previews"', 'aria-label="WireCat"')
    const suffix = kind === "home" ? "" : `/${kind}`
    const menu = `<details class="editorial-language"><summary aria-label="${ui[lang].language}">${lang.toUpperCase()}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><nav aria-label="${ui[lang].language}">${[
      ["en", "English"],
      ["ru", "Русский"],
      ["es", "Español"],
    ]
      .map(
        ([locale, label]) =>
          `<a href="${!suffix && locale === "en" ? "/" : `/${locale}${suffix}`}" lang="${locale}" ${locale === lang ? 'aria-current="page"' : ""}>${label}</a>`,
      )
      .join("")}</nav></details>`
    html = html.replace(
      '<button type="button" class="theme-switch"',
      `${menu}<button type="button" class="theme-switch"`,
    )
    html = html.replace(/href="https:\/\/wirecat.dev\/en"/g, `href="${lang === "en" ? "/" : `/${lang}`}"`)
    html = html.replace(/href="https:\/\/wirecat\.dev\/([^"]*)"/g, (_, path) => `href="/${path}"`)
    html = html.replace(
      /(<details class="lang footer-language">[\s\S]*?<div class="lang-menu">)[\s\S]*?(<\/div><\/details>)/,
      (_, start, end) =>
        start +
        [
          ["en", "English"],
          ["ru", "Русский"],
          ["es", "Español"],
        ]
          .map(
            ([locale, label]) =>
              `<a href="${!suffix && locale === "en" ? "/" : `/${locale}${suffix}`}" lang="${locale}" ${locale === lang ? 'aria-current="page"' : ""}>${label}</a>`,
          )
          .join("") +
        end,
    )
    html = html.replaceAll('aria-label="Language"', `aria-label="${ui[lang].language}"`)
    html = html.replace(/(<a href="mailto:[^"]*">[\s\S]*?<\/a>)/g, "<!--email_off-->$1<!--/email_off-->")
    // Correctly annotate fixtures and identifiers that intentionally remain in English.
    html = html.replace(/<pre>/g, '<pre lang="en">')
    const labels =
      lang === "ru"
        ? {
            "Switch to dark theme": "Включить тёмную тему",
            "Copy this request": "Скопировать запрос",
            "Show the next messages": "Показать следующие сообщения",
            "Show the final follow-up": "Показать последнее продолжение",
            "Example conversation": "Пример разговора",
            "AI conversation examples": "Примеры диалогов с ИИ",
            "Choose a conversation": "Выберите диалог",
            "Messenger in this example": "Мессенджер в примере",
            "Choose messenger for setup": "Мессенджер для подключения",
            "Copy terminal installation command": "Скопировать команду установки",
            "Choose an example": "Выберите пример",
            "Choose a use of WireCat": "Выберите вариант использования",
          }
        : lang === "es"
          ? {
              "Switch to dark theme": "Cambiar al tema oscuro",
              "Copy this request": "Copiar esta petición",
              "Show the next messages": "Mostrar los siguientes mensajes",
              "Show the final follow-up": "Mostrar el último intercambio",
              "Example conversation": "Conversación de ejemplo",
              "AI conversation examples": "Conversaciones con IA",
              "Choose a conversation": "Elige una conversación",
              "Messenger in this example": "Mensajería de este ejemplo",
              "Choose messenger for setup": "Servicio para conectar",
              "Copy terminal installation command": "Copiar el comando de instalación",
              "Choose an example": "Elige un ejemplo",
            }
          : {}
    for (const [en, translated] of Object.entries(labels))
      html = html.replaceAll(`aria-label="${en}"`, `aria-label="${translated}"`)
    if (
      /(?:127\.0\.0\.1|localhost|\/studio|\/block-library|\/features-compact|\/features-chapters|\/features-compare)/.test(
        html,
      )
    )
      throw Error(`Private link in ${kind}/${lang}`)
    // Keep the animated underline on the label, leaving adjacent icons untouched.
    html = html.replace(/(<a\b[^>]*>)([\s\S]*?)(<\/a>)/g, (_, open, body, close) => {
      if (/class="[^"]*\b(?:button|brand|wirecat-brand|skip)\b/.test(open)) return open + body + close
      const label = body.replace(/<svg\b[\s\S]*?<\/svg>/g, "").trim()
      if (!label || label.includes("<")) return open + body + close
      const link = /class="/.test(open)
        ? open.replace('class="', 'class="animated-text-link ')
        : open.replace("<a", '<a class="animated-text-link"')
      return link + body.replace(label, `<span class="link-label">${label}</span>`) + close
    })
    pages[kind] = `<a class="skip" href="#main">${ui[lang].skip}</a>${html}`
  }
  pages.header = pages.home
    .match(/<header class="wrap site-header"[\s\S]*?<\/header>/)[0]
    .replace(/<a\b[^>]*href="\/(?:en|ru|es)\/features"[^>]*>[\s\S]*?<\/a>/, "")
    .replace(
      '<nav aria-label="Site navigation">',
      '<nav class="public-site-menu" id="public-site-menu" aria-label="Site navigation">',
    )
    .replace('<a class="brand"', '<a class="brand site-brand"')
    .replace(
      '<details class="editorial-language">',
      '</nav><div class="public-site-controls"><details class="editorial-language">',
    )
    .replace(
      "</nav></header>",
      `</div><button type="button" class="site-menu-toggle" aria-expanded="false" aria-controls="public-site-menu" aria-label="${{ en: "Open menu", ru: "Открыть меню", es: "Abrir menú" }[lang]}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button></header>`,
    )
  pages.footer = pages.home.match(/<footer\b[\s\S]*?<\/footer>/)[0]
  for (const kind of ["home", "features", "examples"]) {
    pages[kind] = pages[kind]
      .replace(/<div class="toast"[^>]*><\/div>/, "")
      .replace(/<a class="skip"[\s\S]*?<\/a>/, "")
      .replace(/<header class="wrap site-header"[\s\S]*?<\/header>/, "")
      .replace(
        /<div class="wirecat-landing footer-host"><div class="site-footer-shell site-footer-landing">[\s\S]*?<\/footer><\/div><\/div>/,
        "",
      )
  }
  await writeFile(new URL(`../lib/editorial/${lang}.json`, import.meta.url), `${JSON.stringify(pages, null, 2)}\n`)
}
const files = [
  "production-landing.css",
  "production-theme.css",
  "production-footer.css",
  "base.css",
  "styles.css",
  "refinement.css",
  "chat.css",
  "updates.css",
  "feature-variants.css",
  "refinement-3.css",
  "landing-4.css",
  "landing-5.css",
  "interactions.css",
  "home-lines.css",
  "headline-glow.css",
]
const combined = postcss.parse(
  (await Promise.all(files.map((name) => readFile(new URL(name, sourceDir), "utf8")))).join("\n"),
)
combined.walkComments((comment) => {
  if (comment.text.includes("biome-ignore-all")) comment.remove()
})
combined.walkRules((rule) => {
  if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return
  rule.selectors = rule.selectors.map((selector) => {
    if (selector.includes(":root.dark")) return selector.replace(":root.dark", "html.dark .wirecat-editorial")
    if (selector.includes(":root")) return selector.replaceAll(":root", ".wirecat-editorial")
    if (/^\.(dark|light) /.test(selector))
      return selector
        .replace(/^\.(dark|light) /, "html.$1 .wirecat-editorial ")
        .replace(/\.wirecat-editorial body/, ".wirecat-editorial")
    if (selector.startsWith("html")) {
      let depth = 0,
        split = selector.length
      for (let i = 0; i < selector.length; i++) {
        if ("([".includes(selector[i])) depth++
        if (")]".includes(selector[i])) depth--
        if (selector[i] === " " && depth === 0) {
          split = i
          break
        }
      }
      return `${selector.slice(0, split)} .wirecat-editorial${selector.slice(split)}`
    }
    if (selector.startsWith("body")) return selector.replace(/^body/, " .wirecat-editorial")
    return `.wirecat-editorial ${selector}`
  })
})
combined.walkDecls((d) => {
  if (d.prop === "background" || d.prop === "background-image")
    d.value = d.value.replaceAll("/wallpaper.svg", "/editorial-wallpaper.svg")
})
const reset =
  ".wirecat-editorial {position:relative;isolation:isolate;min-height:100vh;font:15px/1.55 Onest,sans-serif;color:var(--ink);background:var(--bg)}.wirecat-editorial :where(h1,h2,h3,h4,p,ul,ol,dl,pre,blockquote){margin:0;padding:0}.wirecat-editorial ul{list-style:disc}.wirecat-editorial ol{list-style:decimal}.wirecat-editorial summary{display:list-item}.wirecat-editorial [hidden]{display:none!important}\n"
const extras = `\n.wirecat-editorial .editorial-language{position:relative;font-size:12px}.wirecat-editorial .editorial-language>summary{display:flex;gap:5px;align-items:center;min-height:34px;padding:5px 8px;border:1px solid var(--line);border-radius:5px;background:var(--paper)}.wirecat-editorial .editorial-language>summary::after{display:none}.wirecat-editorial .editorial-language svg{width:12px;height:12px}.wirecat-editorial .editorial-language>nav{position:absolute;right:0;top:100%;z-index:70;display:grid;gap:0;padding:6px;background:var(--paper);border:1px solid var(--line);border-radius:5px;min-width:140px}.wirecat-editorial .editorial-language nav a{padding:9px;text-decoration:none}.wirecat-editorial .editorial-language a[aria-current=page]{color:var(--accent)}.wirecat-editorial .site-header{flex-wrap:wrap}.wirecat-editorial .site-header nav{flex-wrap:wrap}@media(max-width:650px){.wirecat-editorial .site-header{gap:10px}.wirecat-editorial .site-header nav{gap:7px}.wirecat-editorial .site-header .brand .wirecat-logo-word{width:78px}.wirecat-editorial .site-header .brand .wirecat-logo-mark{width:24px;height:24px}.wirecat-editorial .site-header .connect-dropdown>summary{padding-inline:8px;max-width:150px;font-size:11px}.wirecat-editorial .site-header .theme-switch{width:28px;height:28px}.wirecat-editorial .site-header .editorial-language>summary{min-height:28px;padding:4px 6px}}\n`
await writeFile(
  new URL("../lib/editorial/editorial.css", import.meta.url),
  "/* Generated by scripts/export-editorial.mjs. Reviewed cascade isolated from docs and About. */\n/* biome-ignore-all lint/style/noDescendingSpecificity: Preserve the reviewed isolated prototype cascade. */\n/* biome-ignore-all lint/complexity/noImportantStyles: Preserve hidden states, reduced motion and the approved prototype cascade. */\n" +
    reset +
    combined.toString() +
    extras,
)
await writeFile(
  new URL("../public/editorial-wallpaper.svg", import.meta.url),
  (await readFile(new URL("wallpaper.svg", sourceDir), "utf8")).replace(
    /(<svg[^>]*>)/,
    "$1<title>Decorative messenger pattern</title>",
  ),
)
console.log("Exported selected editorial home, features and examples in en/ru/es.")

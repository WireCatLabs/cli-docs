/** Publish the reviewed, repository-owned prototypes without their design controls.
 * Run `node scripts/export-landing.mjs` after editing design/landing/g-home*.html.
 * HTML is trusted static source; no user input or scripts enter the published markup.
 */
import { execFileSync } from "node:child_process"
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import postcss from "postcss"

const copy = {
  en: {
    heading: "Connect your agent",
    intro: "Choose Telegram or MAX. The guide takes you from installation to your first answer.",
    hint: "Click to copy the installation command.",
    copy: "Copy",
    guide: "Setup guide",
    dayIntro: "A few moments with your agent. The rest of the day is yours.",
    day: [
      ["08:00", "Start with the essentials", "Get one short summary of the chats that need your attention."],
      ["11:00", "Prepare for a meeting", "Bring together the relevant messages before the conversation starts."],
      ["15:00", "Keep things moving", "Reply to a request or follow up with someone you are waiting for."],
      ["19:00", "Finish with a clear picture", "See what was resolved and what needs attention tomorrow."],
    ],
    install: "Start with Telegram →",
    max: "Start with MAX →",
  },
  ru: {
    heading: "Подключите агента",
    intro: "Выберите мессенджер. Гайд проведёт вас от установки до первого ответа.",
    hint: "Нажмите, чтобы скопировать команду установки.",
    copy: "Копировать",
    guide: "Инструкция",
    dayIntro: "Несколько обращений к агенту. Остальное время — ваше.",
    day: [
      ["08:00", "Начните с главного", "Получите короткую сводку чатов, которым нужно ваше внимание."],
      ["11:00", "Подготовьтесь к встрече", "Соберите нужные сообщения перед началом разговора."],
      ["15:00", "Продвиньте дела", "Ответьте на запрос или напомните о том, чего ждёте."],
      ["19:00", "Завершите день", "Посмотрите, что решено и к чему вернуться завтра."],
    ],
    install: "Начать с Telegram →",
    max: "Начать с MAX →",
  },
  es: {
    heading: "Conecta tu agente",
    intro: "Elige Telegram o MAX. La guía te acompaña desde la instalación hasta tu primera respuesta.",
    hint: "Haz clic para copiar el comando de instalación.",
    copy: "Copiar",
    guide: "Guía",
    dayIntro: "Unos minutos con tu agente. El resto del día es tuyo.",
    day: [
      ["08:00", "Empieza por lo importante", "Recibe un resumen breve de los chats que necesitan tu atención."],
      ["11:00", "Prepara una reunión", "Reúne los mensajes relevantes antes de empezar la conversación."],
      ["15:00", "Haz avanzar las tareas", "Responde a una petición o retoma una conversación pendiente."],
      ["19:00", "Cierra el día", "Consulta qué se ha resuelto y qué necesita atención mañana."],
    ],
    install: "Empezar con Telegram →",
    max: "Empezar con MAX →",
  },
}
const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
const tick =
  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>'
const commandView = (command) =>
  command
    .replace(/<\/?b>/g, "")
    .replace(
      /^(tg (?:messages \w+|chats list|bot (?:list|mcp)|config (?:show|set)|runs list|sends list|review|inbox)|tg \w+ (?:bot (?:recipients \w+|mcp(?: config)?)|config set))\s+(.*)$/,
      "$1 <b>$2</b>",
    )
// Only evaluate repository-owned demo data; the preview itself never executes these commands.
const previewData = { window: {} }
runInNewContext(readFileSync("design/landing/scenario-variants.js", "utf8"), previewData)
const selectedSessions = previewData.window.WireScenarioVariants
if (!selectedSessions) throw new Error("Missing selected landing scenarios")
const view = (step) => {
  if (step.ask) return `<div class="ask step">${escapeHtml(step.ask)}</div>`
  if (step.tool)
    return `<details class="tool step"><summary><span class="state">${tick}</span><code>${commandView(step.tool)}</code><svg class="chev" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></summary><pre>${escapeHtml(
      step.out,
    )
      .replace(/"([a-zA-Z]+)":/g, '<span class="k">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
      .replace(/: (\d+|true|false)/g, ': <span class="n">$1</span>')}</pre></details>`
  return `<div class="say step">${step.say}</div>`
}
let localeTypography = ""
for (const lang of ["en", "ru", "es"]) {
  const source = readFileSync(`design/landing/g-home${lang === "en" ? "" : `.${lang}`}.html`, "utf8")
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
  // Preserve the font selected in the reviewed prototype, including Russian data-ff="3".
  const fonts = runInNewContext(`(${script.match(/const fonts = (\[[\s\S]*?\n {2}\])\n/)[1]})`)
  const font = fonts[Number(source.match(/data-ff="(\d+)"/)?.[1] ?? 0)]
  localeTypography += `\nhtml[lang="${lang}"] .wirecat-landing :is(h1,h2.big,.hour h3,.time,.lane h3,.tool-name,.spec dt) { font-family: ${font.stack}; font-stretch: ${font.stretch}; font-weight: ${font.weight}; }\n`

  // Evaluate only the constant sample data from our own design source, at export time.
  const sessions = selectedSessions[lang].map((session) => ({
    ...session,
    steps: session.steps.map((step) => ({
      html: view(step),
      tool: Boolean(step.tool),
      delay: step.ask ? 500 : step.tool ? 600 : 900,
    })),
  }))
  let html = source.split("<body>")[1].split('<div class="headlines"')[0]
  html = html.replace(
    '<details class="lang">',
    '<button class="theme-toggle" type="button" aria-label="Switch theme" title="Switch theme"><svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14a9 9 0 0 1-10.5-10.5A9 9 0 1 0 20.5 14Z"/></svg></button><details class="lang">',
  )
  html = html.replace(/^ {4}<div class="fv fv[1-5]"[^\n]+\n/gm, "")
  html = html.replace(/href="g-home(?:\.(ru|es))?\.html"/g, (_, locale) => `href="/${locale ?? "en"}"`)
  html = html
    .replace(/https:\/\/wirecat.dev\/(en|ru|es)\/docs/g, `/${lang}/docs`)
    .replaceAll('href="https://wirecat.dev/', 'href="/')
  html = html
    .replaceAll(`href="/${lang}/docs/tg/installation"`, `href="/${lang}/docs/installation"`)
    .replaceAll(`href="/${lang}/docs/tg/mcp"`, `href="/${lang}/docs/mcp"`)
  html = html.replace(/<section id="about">[\s\S]*?<\/section>/, "")
  html = html.replaceAll('href="#about"', `href="/${lang}/about"`)
  const aboutLabel = { en: "About", ru: "О проекте", es: "Acerca de" }[lang]
  if (!html.includes(`href="/${lang}/about"`)) {
    html = html.replace(/(<nav class="site"[\s\S]*?)(<\/nav>)/, `$1<a href="/${lang}/about">${aboutLabel}</a>$2`)
  }
  html = html.replace(
    '<li><a href="https://github.com/leemour/tg-cli/issues">',
    `<li><a href="/${lang}/about">${aboutLabel}</a></li><li><a href="https://github.com/leemour/tg-cli/issues">`,
  )
  const w = copy[lang]
  html = html.replace(/<section class="band" id="connect">[\s\S]*?<\/section>/, "")
  // Keep the story in the reviewed order: scenarios, benefits, tools, reasons, daily habit.
  const day = html.match(/<section id="day"[^>]*>[\s\S]*?<\/section>/)?.[0]
  const benefits = html.match(/<section id="features"[^>]*>[\s\S]*?<\/section>/)?.[0]
  const toolsSection = html.match(/<section>\s*<div class="wrap">[\s\S]*?<\/section>/)?.[0]
  const reasons = html.match(/<section class="band" id="why">[\s\S]*?<\/section>/)?.[0]
  if (!day || !benefits || !toolsSection || !reasons) throw new Error("Missing landing story section")
  const dayTitle = day.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1]
  const shortDay = `<section id="day"><div class="wrap"><h2 class="big">${dayTitle}</h2><p class="intro">${w.dayIntro}</p><div class="day-summary">${w.day.map(([time, title, text]) => `<div><time class="time" datetime="${time}">${time}</time><h3>${title}</h3><p>${text}</p></div>`).join("")}</div></div></section>`
  for (const section of [day, benefits, toolsSection, reasons]) html = html.replace(section, "")
  html = html.replace(/(?=<section class="close")/, `${benefits}\n${toolsSection}\n${reasons}\n${shortDay}\n`)
  const choices = [
    ["Telegram", "tg-cli", "tg"],
    ["MAX", "max-cli", "max"],
  ]
    .map(
      ([name, pkg, tool]) =>
        `<button class="connect-choice" type="button" data-copy="npm i -g @leemour/${pkg}" aria-label="${name}: ${w.copy}"><span class="connect-choice-title"><strong>${name}</strong><span data-copy-label role="status" aria-live="polite">${w.copy}</span></span><code>npm i -g @leemour/${pkg}</code></button><a class="connect-guide" href="/${lang}/docs/installation#${tool}">${w.guide}: ${name} →</a>`,
    )
    .join("")
  html = html.replace(
    /(<main class="wrap hero">[\s\S]*?<div class="cta">)[\s\S]*?(<\/div>)/,
    `$1<details class="agent-connect"><summary class="btn">${w.heading}<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary><div class="connect-menu"><p>${w.hint}</p>${choices}</div></details>$2`,
  )
  html = html.replace(
    /(<section class="close"[^>]*>[\s\S]*?<div class="cta">)[\s\S]*?(<\/div>)/,
    `$1<a class="btn" href="/${lang}/docs/installation#tg">${w.install}</a><a class="btn" href="/${lang}/docs/installation#max">${w.max}</a>$2`,
  )
  html = html.replace(/(<p class="intro" id="closing-help">)[\s\S]*?(<\/p>)/, `$1${w.intro}$2`)
  html = html.replace(
    /(<nav class="sessions"[^>]+><h2>[^<]+<\/h2>)/,
    `$1${sessions.map((s, i) => `<button class="session" type="button" aria-current="${i === 0}">${escapeHtml(s.title)}<small>${escapeHtml(s.hint)}</small></button>`).join("")}`,
  )
  html = html.replace(
    '<div class="log" id="log"></div>',
    `<div class="log" id="log">${sessions[0].steps.map((s) => s.html).join("")}</div>`,
  )
  if (/skill install|<script|data-variant="[1-5]"/.test(html)) throw new Error("Unpublished prototype content remains")
  const footerHtml = html.match(/<footer class="site">[\s\S]*?<\/footer>/)?.[0]
  if (!footerHtml) throw new Error("Missing shared site footer")
  html = html.replace(footerHtml, "")
  writeFileSync(`lib/landing/${lang}.json`, `${JSON.stringify({ html: html.trim(), footerHtml, sessions }, null, 2)}\n`)
  if (lang !== "en") continue
  const css = postcss.parse(source.match(/<style>([\s\S]*?)<\/style>/)[1].replaceAll(" !important", ""))
  // Expand font shorthands before Next's CSS optimizer combines percentage stretches.
  // Percentage stretch in a combined shorthand is rejected by browsers.
  css.walkDecls("font", (declaration) => {
    const parts = declaration.value.match(/^(\d+)\s+(.+?)\/([\d.]+)\s+(.+)$/)
    if (!parts) return
    for (const [prop, value] of [
      ["font-weight", parts[1]],
      ["font-size", parts[2]],
      ["line-height", parts[3]],
      ["font-family", parts[4]],
    ])
      declaration.cloneBefore({ prop, value })
    declaration.remove()
  })
  css.walkRules((rule) => {
    if (rule.parent.type === "atrule" && rule.parent.name.endsWith("keyframes")) return
    if (rule.selectors.every((selector) => selector.startsWith(".headlines"))) {
      rule.remove()
      return
    }
    rule.selectors = rule.selectors.map((selector) =>
      selector === ":root" || selector === "body"
        ? ".wirecat-landing"
        : selector.startsWith(".js ")
          ? selector.replace(".js", ".wirecat-landing .landing-content.is-ready")
          : `.wirecat-landing ${selector}`,
    )
  })
  css.walkDecls("padding-bottom", (declaration) => {
    if (declaration.parent.selector === ".wirecat-landing" && declaration.value === "110px") {
      declaration.remove()
    }
  })
  css.walkRules((rule) => {
    if (!rule.nodes.length) rule.remove()
  })
  // Reset only inside the landing: Tailwind preflight must not change the prototype's typography.
  const reset =
    ".wirecat-landing { min-height: 100vh; overflow-wrap: anywhere; }\n.wirecat-landing :where(h1,h2,h3,h4,p,ul,ol,dl,pre) { margin: revert; padding: revert; font-size: revert; font-weight: revert; }\n.wirecat-landing :where(ul,ol) { list-style: revert; }\n.wirecat-landing :where(svg) { display: inline; vertical-align: middle; }\n"
  const typography =
    '\n.wirecat-landing :is(h1,h2.big,.hour h3,.time,.lane h3,.tool-name,.spec dt) { font-family: "Anybody", "Oswald", "Onest", sans-serif; font-stretch: 62%; font-weight: 900; }\n'
  const patternScript = script.slice(script.indexOf("const shapes ="), script.indexOf("let wall ="))
  const background = {}
  runInNewContext(`${patternScript}\nscatter(["plane", "sleeping"])`, {
    getComputedStyle: () => ({ getPropertyValue: () => "#1b2123" }),
    document: { documentElement: {}, body: { style: background } },
  })
  writeFileSync(
    "lib/landing/landing.css",
    `/* Generated by scripts/export-landing.mjs; isolated from the docs. */\n/* biome-ignore-all lint/style/noDescendingSpecificity: Component selectors are isolated; prototype cascade order preserves the reviewed design. */\n${reset}${css}${typography}.wirecat-landing { --gutter: clamp(16px, 2.7vw, 48px); background-image: ${background.backgroundImage}; background-size: ${background.backgroundSize}; }\n.wirecat-landing .say ul { list-style: none; }\n.wirecat-landing :is(h1,h2.big) { overflow-wrap: anywhere; }\n@media (min-width: 901px) { .wirecat-landing h1 { font-size: clamp(40px, 6.5vw, 80px); } .wirecat-landing .lede { font-size: clamp(16px, 1.5vw, 18.5px); } }\n`,
  )
}

appendFileSync("lib/landing/landing.css", localeTypography)
execFileSync("pnpm", ["exec", "biome", "format", "--write", "lib/landing"], { stdio: "inherit" })

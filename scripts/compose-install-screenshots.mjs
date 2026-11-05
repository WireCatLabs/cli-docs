/**
 * Builds public/screenshots/install/install-and-connect-<theme>-<lang>.webp: a terminal with an agent installing a
 * tool on the left, and the WireCat Desktop Tools screen (public/screenshots/desktop/tools-*) on the right.
 * The terminal is plain HTML rendered by Playwright; the prompt is the first two lines of the request in
 * content/docs/installation*.mdx, the command is the one the site hands out for Telegram.
 *
 *   node scripts/compose-install-screenshots.mjs
 */
import { mkdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"

const req = createRequire(import.meta.url)
const { chromium } = req("@playwright/test")
const sharp = createRequire(req.resolve("next/package.json"))("sharp")

const command = "npm install -g @wirecat/tg-cli && tg skill install --for all"
const text = {
  en: {
    prompt:
      "Help set up my chosen WireCat tool using its installation guide. Check Node.js and npm first. Connect only my chosen account or folder; I will approve login myself.",
    reply: "I will check Node.js and npm, then install the Telegram tool and its skill for your agent.",
    result: "added 1 package. Skill installed for your agents.",
    next: "Installed. Run tg personal setup when you are ready to log in.",
  },
  ru: {
    prompt:
      "Помоги настроить выбранный инструмент WireCat по его инструкции. Сначала проверь Node.js и npm. Подключи только выбранный аккаунт или папку; вход я подтвержу сам.",
    reply: "Проверю Node.js и npm, затем установлю инструмент Telegram и его навык для вашего агента.",
    result: "добавлен 1 пакет. Навык установлен для ваших агентов.",
    next: "Готово. Выполните tg personal setup, когда будете готовы войти.",
  },
  es: {
    prompt:
      "Ayúdame a configurar la herramienta WireCat elegida siguiendo su guía. Comprueba primero Node.js y npm. Conecta solo la cuenta o carpeta elegida; yo aprobaré el acceso.",
    reply: "Comprobaré Node.js y npm, y luego instalaré la herramienta de Telegram y su habilidad para tu agente.",
    result: "se añadió 1 paquete. Habilidad instalada para tus agentes.",
    next: "Instalado. Ejecuta tg personal setup cuando quieras iniciar sesión.",
  },
}

const page = ({ prompt, reply, result, next }, theme, shot) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1440px;height:480px;display:flex;gap:24px;align-items:center;justify-content:center;padding:20px;
background:${theme === "dark" ? "#17171a" : "#eceef2"};font-family:"DejaVu Sans Mono",monospace}
.term{width:690px;height:431px;border-radius:12px;overflow:hidden;background:#0f1115;color:#d8dbe2;
border:1px solid ${theme === "dark" ? "#33363d" : "#c9ccd3"};box-shadow:0 2px 8px #0003;display:flex;flex-direction:column}
.bar{height:34px;background:#1b1e24;display:flex;align-items:center;gap:7px;padding:0 14px;color:#8b909b;font-size:13px}
.bar i{width:11px;height:11px;border-radius:50%;background:#444851;display:block}.bar span{margin-left:10px}
.body{padding:16px 18px;font-size:14px;line-height:1.5}
.you{background:#1d2129;border-radius:6px;padding:8px 12px;margin:6px 0 12px}
.dim{color:#7d828d}.ok{color:#6ccf8e}.cmd{color:#e6e8ec}
.row{margin:6px 0}
img{width:690px;height:431px;border-radius:12px;border:1px solid ${theme === "dark" ? "#33363d" : "#c9ccd3"};display:block}
</style>
<div class="term"><div class="bar"><i></i><i></i><i></i><span>~ — claude</span></div><div class="body">
<div class="dim">$ claude</div>
<div class="you">&gt; ${prompt}</div>
<div class="row">● ${reply}</div>
<div class="row">● <span class="cmd">Bash(${command})</span></div>
<div class="row dim">&nbsp;&nbsp;⎿ <span class="ok">${result}</span></div>
<div class="row">● ${next}</div>
</div></div>
<img src="data:image/webp;base64,${shot}"></html>`

mkdirSync("public/screenshots/install", { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 480 } })
const tab = await context.newPage()
for (const lang of ["en", "ru", "es"])
  for (const theme of ["light", "dark"]) {
    const shot = readFileSync(`public/screenshots/desktop/tools-${theme}-${lang}.webp`).toString("base64")
    await tab.setContent(page(text[lang], theme, shot))
    const png = await tab.screenshot()
    const output = `public/screenshots/install/install-and-connect-${theme}-${lang}.webp`
    const info = await sharp(png).webp({ quality: 80, effort: 6 }).toFile(output)
    console.log(`${output} ${Math.round(info.size / 1024)} KB`)
  }
await browser.close()

import { mkdir, readFile, writeFile, copyFile, readdir } from "node:fs/promises"
import { build as bundleBrowser } from "esbuild"
import { audienceSwitch, outcomeBlock, reasonsBlock, closingFeature, whatLayouts, closingFeatures } from "./landing-composition.mjs"
import { roleBlock5, outcomeBlock5, trustBlock5, closingFeature5, landingVariants, roleLayouts, outcomeLayouts, conversationLayouts } from "./landing-5.mjs"
import { studioPage, allDesignsPage, blockLibraryPage } from "./design-studio.mjs"
import { wirecatLogoSvg } from "../../lib/brand.ts"
import { wordsFor } from "../../lib/words.ts"
import { createChatRenderer } from "./chat-renderers.mjs"
import { compactFeatureVariants, compactFeaturePage } from "./compact-features.mjs"
import { homepageRefinements, closingPanel, refinementNav } from "./refinement-options.mjs"
import { featureVariants, featureExploration } from "./feature-variants.mjs"
import { featurePage } from "./feature-page.mjs"

const root = new URL("./", import.meta.url)
const landing = JSON.parse(await readFile(new URL("../../lib/landing/en.json", import.meta.url), "utf8"))
const site = JSON.parse(await readFile(new URL("../../site.config.json", import.meta.url), "utf8"))
const docs = "https://wirecat.dev/en/docs"
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
const plain = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
const svg = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`
const icon = {
  arrow: svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>'),
  moon: svg('<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/>'),
  down: svg('<path d="m6 9 6 6 6-6"/>'),
  search: svg('<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'),
  account: svg('<circle cx="12" cy="8" r="4"/><path d="M5 21v-3c0-4 14-4 14 0v3"/>'),
  bot: svg('<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h1m6 0h1M9 16h6"/>'),
  group: svg('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2 20v-2c0-5 12-5 12 0v2m1-5c4-2 7 0 7 3v2"/>'),
  note: svg('<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 12h7M9 16h5"/>'),
  verify: svg('<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>'),
  reply: svg('<path d="m9 5-6 6 6 6M3 11h10c5 0 8 3 8 8"/>'),
  telegram: svg('<path d="m3 11 18-7-5 17-5-6-4 3 1-6 10-6-8 8Z"/>'),
  max: svg('<path d="M5 6h14v11h-8l-5 4V6Z"/><path d="m9 13 2-3 2 3 2-3"/>'),
  email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'),
  devices: svg('<rect x="3" y="4" width="14" height="11" rx="2"/><path d="M6 20h8m-4-5v5"/><rect x="17" y="9" width="5" height="11" rx="1"/>'),
  archive: svg('<path d="M4 8h16v13H4Z"/><path d="M3 3h18v5H3Z"/><path d="M9 12h6"/>'),
  refresh: svg('<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5 8a8 8 0 0 1 14-3l1 2M4 17l1 2a8 8 0 0 0 14-3"/>'),
  history: svg('<path d="M3 4v5h5"/><path d="M3 9a9 9 0 1 1 0 7"/><path d="M12 6v6l4 2"/>'),
  lock: svg('<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>'),
  mic: svg('<rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'),
  obsidian: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none"><path d="M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362-.553-1.321-.636-3.375-.64-4.377a1.707 1.707 0 0 0-.358-1.05l-3.198-4.064a3.744 3.744 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59-.124 1.26.046 2.73.815 4.481.128.011.257.025.386.044a6.363 6.363 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569c.073.012.146.02.22.02.78.024 2.095.092 3.16.29.87.16 2.593.64 4.01 1.055 1.083.316 2.198-.548 2.355-1.664.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.295 5.295 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45.532 2.218.368 4.829-1.425 7.531zM5.533 9.938c-.023.1-.056.197-.098.29L2.82 16.059a1.602 1.602 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534-.683-1.725-.848-3.233-.716-4.577.154-1.552.7-2.847 1.235-3.95.113-.235.223-.454.328-.664.149-.297.288-.577.419-.86.217-.47.379-.885.46-1.27.08-.38.08-.72-.014-1.043-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.602 1.602 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711.09.21.175.43.253.653z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="none"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.09.67-3.74-1.31-3.74-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.11.08 1.69 1.14 1.69 1.14.99 1.69 2.59 1.2 3.22.92.1-.72.38-1.2.7-1.48-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.23c.94 0 1.87.13 2.75.37 2.12-1.44 3.05-1.14 3.05-1.14.6 1.53.22 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.6 5.2-5.08 5.48.4.35.75 1.02.75 2.06v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>`,
}
const link = (text, href, cls = "text-link") => `<a class="${cls}" href="${href}">${text}${icon.arrow}</a>`
const config = [
 {id:"bubbles",name:"Chat bubbles",palette:"classic",type:"outcomes",hero:["context","search","commitments","inbox"],mode:"bubbles",desc:"Opposing message bubbles. The request looks like something you sent, and the agent replies like a person."},
 {id:"assistant",name:"Quiet assistant",palette:"classic",type:"outcomes",hero:["context","search","commitments"],mode:"assistant",desc:"A familiar AI-chat layout: your prompt in a small bubble, the answer as readable prose, tools tucked away."},
 {id:"messenger",name:"Messenger conversation",palette:"classic",type:"outcomes",hero:["context","search","commitments"],mode:"messenger",desc:"A compact messenger view with a contact header, natural replies and a short follow-up."},
 {id:"thread",name:"Conversation thread",palette:"classic",type:"outcomes",hero:["context","search","commitments"],mode:"thread",desc:"Two turns that show the agent correcting its understanding after reading more of the conversation."},
]
const captions = {
  context: { title: "Prepare for a call", question: "Gather the decisions, risks and open questions for tomorrow’s Atlas call.", answerTitle: "The call can start with the remaining decisions", answer: '<ul><li><b>Payment tests:</b> Tom has results; the production check still needs access.</li><li><b>Final copy:</b> Anna needs it before launch.</li><li><b>Decide on the call:</b> owners, deadlines and whether the remaining risk changes the launch.</li></ul><p class="result-note">A 20-minute agenda, based on the project group, design group and DMs.</p>', pick: ["Test payments work.", "launching", "final copy"], caption: "An agenda assembled from the relevant chats" },
  search: { title: "Find recommendations", question: "Find SQL course recommendations across Telegram and MAX. I want exercises and feedback.", answerTitle: "The workshop is the better lead", answer: '<p>A participant confirms weekly exercises and feedback on mistakes. The video course helped with basics, but feedback isn’t confirmed.</p><ul><li><b>Start with:</b> the workshop.</li><li><b>Check next:</b> course level, assignment reviews and current availability.</li></ul>', pick: ["weekly exercises", "nobody reviewed"], caption: "A comparison that uses the surrounding messages" },
  commitments: { title: "Follow up with context", question: "Check who needs my reply and whether Tom already sent the design. Draft the right follow-up.", answerTitle: "Tom already sent the first draft", answer: '<p>A reminder saying he hasn’t sent anything would miss the history.</p><blockquote>Tom, thanks for the first draft! When can you send the final version with our feedback incorporated?</blockquote><p class="result-note">The reply is a draft. The budget decision stays with you.</p>', pick: ["first design draft", "design on Wednesday"], caption: "A reply that reflects what has already happened" },
  inbox: { title: "Get a morning briefing", question: "Who is waiting for my reply, and what should I handle first?", answerTitle: "Your first 15 minutes", answer: '<ol><li><b>Marco’s budget request:</b> the contractor is waiting on your decision.</li><li><b>Anna’s meeting:</b> confirm the new time, 19:30.</li><li><b>Mum’s voice note:</b> confirm whether you can drive her tomorrow.</li></ol><p class="result-note">News is kept in a separate list for later.</p>', pick: ["budget", "19:30", "appointment"], caption: "Priorities from messages and a transcribed voice note" },
  moderation: { title: "Review a group", question: "Show violations of the Community group’s rules and a proposed action plan. Don’t delete anything yet.", answerTitle: "A moderation plan for your review", answer: '<p>Two promotional messages violate the saved link rule.</p><ul><li>Proposed action: delete those two messages.</li><li>Keep the recording question.</li><li>Remove no members.</li></ul><p class="result-note">This is a preview. No action has been taken.</p>', pick: ["websites", "packages", "recording"], caption: "The proposed actions are visible before you approve them" },
  bot: { title: "Answer a customer", question: "Check Anna’s order questions received by the sales bot and draft a reply.", answerTitle: "Confirm what is known; check the requested change", answer: '<blockquote>Delivery is agreed for Friday and your address is confirmed. I’ll check with the team whether we can move it to tomorrow and get back to you.</blockquote><p class="result-note">The date change wasn’t confirmed in the bot’s messages. The draft makes no new promise.</p>', pick: ["Delivery agreed", "move it to tomorrow"], caption: "A support reply based on the messages this bot received" },
  files: { title: "Collect the latest files", question: "Find the current Atlas contract, invoices and presentation. Check project groups and DMs.", answerTitle: "The current files, without losing old versions", answer: '<ul><li><b>Contract:</b> contract-final.pdf from Anna’s DMs.</li><li><b>Invoice:</b> invoice-phase-1.pdf from the project group.</li><li><b>Presentation:</b> presentation-v3.pdf from the design group.</li></ul><p class="result-note">Older versions remain in chat history. Nothing is sent to the customer.</p>', pick: ["Invoice for", "presentation v3"], caption: "One current document set from several conversations" },
  schedule: { title: "Schedule messages", question: "Remind me to check the invoice in two hours. Ask Anna and Tom for updates in one hour, privately.", answerTitle: "Reminders and follow-ups scheduled", answer: '<ul><li><b>Saved Messages:</b> check the invoice in two hours.</li><li><b>Anna:</b> ask for final copy in one hour.</li><li><b>Tom:</b> ask for payment status in one hour.</li></ul><p class="result-note">Telegram delivers scheduled messages even when your laptop is off.</p>', pick: [], caption: "A message that arrives at the right time" },
}
function evidence(session) {
  const found = []
  for (const step of session.steps) for (const match of step.html.matchAll(/<details class="evidence-message"[\s\S]*?<blockquote>([\s\S]*?)<\/blockquote><\/details>/g)) {
    const meta = plain(match[0].match(/class="evidence-meta">([\s\S]*?)<\/span>/)?.[1] ?? "Source message").replace(/ · Oct \d+, \d{4}/, "")
    const author=plain((match[0].match(/<strong>([\s\S]*?)<\/strong>/)?.[1] ?? "").replace(/<span class="evidence-id">[\s\S]*?<\/span>/,""));
    const label=author && !meta.startsWith(author+" ·") ? `${author} · ${meta}` : meta;
    const quote = plain(match[1]);if (!found.some(x => x.quote === quote && x.meta === label)) found.push({meta:label,quote})
  }
  return found
}
function caseData(id) {
  const session = landing.sessions.find(s => s.id === id)
  const c = captions[id];const all = evidence(session)
  const chosen = c.pick.map(term => all.find(s => s.quote.toLowerCase().includes(term.toLowerCase()))).filter(Boolean).filter((s,i,a)=>a.findIndex(x=>x.quote===s.quote&&x.meta===s.meta)===i).slice(0,3)
  return {...c, id, session, sources:chosen, prompt: `Use my WireCat messaging tools. ${c.question}`}
}
const cases = Object.fromEntries(Object.keys(captions).map(id => [id,caseData(id)]))

function connect(scope, label = "Connect your agent", small = false) {
  return `<details class="connect-dropdown" data-connect><summary class="button ${small ? "small" : ""}">${label}${icon.down}</summary><div class="connect-panel"><p class="connect-intro">Copy a setup request into your AI agent.</p><div class="connect-provider" role="group" aria-label="Choose messenger for setup"><button type="button" data-connect-provider="tg" aria-pressed="true">Telegram</button><button type="button" data-connect-provider="max" aria-pressed="false">MAX</button></div><p class="prompt-label">Ask your agent to install and connect</p><pre class="agent-prompt">${esc(wordsFor("en").onboarding.prompt("tg","@leemour/tg-cli"))}</pre><button class="button copy-agent" type="button" data-copy="${esc(wordsFor("en").onboarding.prompt("tg","@leemour/tg-cli"))}">Copy request for your agent${icon.copy}</button><details class="manual-install"><summary>Or copy the terminal command</summary><div class="command"><code>npm install -g @leemour/tg-cli && tg skill install --for all</code><button type="button" data-copy="npm install -g @leemour/tg-cli && tg skill install --for all" aria-label="Copy terminal installation command">${icon.copy}</button></div></details><a class="text-link connect-guide" href="${docs}/installation#tg">Setup and sign-in guide${icon.arrow}</a><p class="connect-small">The request runs in your agent. Signing in adds a device to your account.</p></div></details>`
}
const header = (v) => `<nav class="comparison-bar" aria-label="Homepage variants"><a href="/">Chat treatments</a><div>${config.map(c=>`<a href="/${c.id}" ${c.id===v?.id?'aria-current="page"':''}>${c.name}</a>`).join("")}</div><a href="http://127.0.0.1:4328/">Previous hero variants</a></nav><header class="wrap site-header"><a class="brand" href="/" aria-label="WireCat previews">${wirecatLogoSvg}</a><nav aria-label="Site navigation"><a href="/features">Features</a><a href="/examples">Examples</a><a href="${docs}">Docs</a><a href="https://wirecat.dev/en/about">About</a><button type="button" class="theme-switch" aria-label="Switch to dark theme">${icon.moon}</button>${connect("header","Connect your agent",true)}</nav></header>`
const colorControls = () => ""
function hero(v) {
  const tools = `<div class="connector-list" aria-label="Messenger and email tools"><span>${icon.telegram}Telegram</span><span>${icon.max}MAX</span><span>${icon.email}Email</span></div>`
  return `<section class="hero wrap memory-hero"><div class="hero-copy"><h1>Memory for your messages.<br><em>Context for your agent.</em></h1><p class="lede">Find what was said, catch up on what matters and reply with the full context. WireCat connects the AI agent you already use to your conversations and notes.</p><div class="hero-actions">${connect("hero")}</div>${tools}<p class="micro">Free, open-source tools that run on your computer.</p></div>${heroDemo(v)}</section>`
}
const terminalIcon=svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/>')
function originalMarkup(step, prefix) {
 let html=step.html.replace(/class="([^"]+)"/g,(_,cls)=>`class="${cls.split(" ").map(token=>token==="step"?"walkthrough-step":token).join(" ")}"`).replace(/id="([^"]+)"/g,`id="${prefix}-$1"`)
 if(step.html.includes('class="ask step"'))html=html.replace('<p>',`<div class="message-role request-role">${icon.account}<span>Your request</span></div><p>`)
 else if(!step.tool)html=html.replace(/(<div class="say[^"]*">)/,`$1<div class="message-role response-role">${icon.bot}<span>Agent response</span></div>`)
 if(step.tool)html=html.replace('<pre>', '<span class="tool-output-label">Tool output · JSON</span><pre>')
 return html
}
function renderExchange(part,prefix){
 let html=""
 for(let i=0;i<part.length;i++){
  if(!part[i].tool){html+=originalMarkup(part[i],`${prefix}-${i}`);continue}
  const calls=[];while(i<part.length && part[i].tool){calls.push(originalMarkup(part[i],`${prefix}-${i}`));i++}i--
  html+=`<section class="tool-call-group" aria-label="Tool calls"><div class="message-role tool-role">${terminalIcon}<span>Tool calls</span><small>${calls.length} ${calls.length===1?"command":"commands"}</small></div>${calls.join("")}</section>`
 }
 return html
}
function exchanges(session) {
 const parts=[]
 for(const step of session.steps){if(step.html.includes('class="ask step"'))parts.push([]);parts.at(-1).push(step)}
 return parts
}
function originalDialogue(v,id,provider) {
 const session=(provider==="tg"?landing.sessions:landing.maxSessions).find(s=>s.id===id)
 const parts=exchanges(session);const prefix=`${v.id}-${id}-${provider}`
 const render=(part,index)=>renderExchange(part,`${prefix}-${index}`)
 if(v.mode==="chat")return `<div class="walkthrough hero-transcript">${render(parts[0],0)}<details class="continue-dialogue"><summary>Continue the original conversation</summary>${parts.slice(1).map((part,i)=>render(part,i+1)).join("")}</details></div>`
 if(v.mode==="walkthrough")return `<div class="exchange-demo" data-exchange-demo><div class="walkthrough hero-transcript">${parts.map((part,i)=>`<div class="exchange-frame" data-exchange-frame="${i}" ${i?"hidden":""}>${render(part,i)}</div>`).join("")}</div><div class="exchange-controls"><button type="button" data-previous-exchange disabled>Previous</button><span data-exchange-counter>Exchange 1 of ${parts.length}</span><button type="button" data-next-exchange>Continue example${icon.arrow}</button></div></div>`
 return `<div class="walkthrough hero-transcript result-first"><details class="previous-dialogue"><summary>Earlier requests and tool calls</summary>${parts.slice(0,-1).map((part,i)=>render(part,i)).join("")}</details>${render(parts.at(-1),parts.length-1)}</div>`
}
const {heroDemo,visibleTools}=createChatRenderer({landing,cases,exchanges,originalMarkup,evidence,icon,esc,terminalIcon})
const rows = {
  outcomes: [
    ["search","Find information buried in chats","Recover recommendations, agreements and files without opening every conversation.",'<p class="example-request">“Where did we agree to meet?”</p><p>Find the place, time and original messages, including any changes made later.</p>',"search"],
    ["note","Prepare for the conversation","Bring decisions, blockers and open questions into a brief before a meeting.",'<p class="example-request">“What do I need to know before we talk?”</p><p>Get a short brief of what’s been decided, what changed and what still needs an answer.</p>',"context"],
    ["reply","Draft a reply with full context","Bring earlier messages, questions and promises into a reply you can review.",'<p class="example-request">“Help me answer their latest question.”</p><p>Your agent checks what they’ve already told you and what you promised, then drafts a reply that addresses both.</p>',"commitments"],
  ],
  roles: [
    ["account","Your personal account","Catch up on messages, find past agreements and draft replies from your own account.",'<p><b>What you get:</b> a short briefing, a source-backed answer or a reply ready to review.</p>',"inbox"],
    ["bot","Your customer-support bots","Ask your agent to prepare answers from the messages and knowledge you give it.",'<blockquote>“Friday is confirmed. I’ll check whether we can move delivery to tomorrow.”</blockquote>',"bot"],
    ["group","Groups you manage","Find unanswered questions, summarize discussions and preview moderation actions.",'<p><b>What you get:</b> the violations, the affected messages and a proposed action plan.</p>',"moderation"],
  ],
  workflow: [
    ["search","Find the right information","Ask for a recommendation, a document or a decision. Your agent gathers matching messages.",'<p><b>Found:</b> two SQL course recommendations, from Telegram and MAX.</p>',"search"],
    ["verify","Check what was actually said","Read the original messages and surrounding discussion before accepting a conclusion.",'<blockquote>“Weekly exercises and feedback from the instructor.”</blockquote>',"search"],
    ["reply","Turn it into an answer or action","Use the checked context to prepare a reply, a meeting brief or a note.",'<p><b>Result:</b> a comparison, a proposed next step, and the messages behind it.</p>',"commitments"],
  ],
}
function what(v) {
  return `<section class="wrap section what"><div class="what-intro"><h2>What you can do</h2><p>${v.type==='roles'?'Use your own account, work through a bot or manage a community. Choose the work you want your agent to handle.':'Ask your agent to find the information, check the history and help with the next step.'}</p></div><div class="what-columns">${rows[v.type].map(([ico,title,text,example,id])=>`<article>${icon[ico]}<h3>${title}</h3><p>${text}</p><div class="small-result">${example}</div>${link("See how it works",`/examples?case=${id}`)}</article>`).join("")}</div></section>`
}
function roleBand(v) {
  if(v.type==='roles')return ""
  return `<section class="audience-band"><div class="wrap audience-row"><h2>Use your account,<br>bots and groups</h2><article><h3>Personal account</h3><p>Catch up, find information and reply to your existing conversations.</p>${link("Personal account guide",`${docs}/tg/usage`)}</article><article><h3>Your bots</h3><p>Answer customers and send updates with your agent’s help.</p>${link("Bot guide",`${docs}/bot-api`)}</article><article><h3>Administer groups</h3><p>Review unanswered questions and apply the rules you choose.</p>${link("Group guide",`${docs}/tg/groups`)}</article></div></section>`
}
function more(v) {
 const features=[
  ["Catch up on busy chats","Get a briefing of what needs your attention. Keep news and less urgent updates for later.","inbox"],
  ["Get the point of a voice note","Turn a recording into text, then ask your agent to pull out the questions, details and next steps.","inbox"],
  ["Schedule reminders and follow-ups","Ask for an update at the right time, or send yourself a reminder. Scheduled messages arrive even when your computer is off.","schedule"],
 ]
 return `<section class="wrap section more-examples"><div class="section-title"><h2>Stay on top of messages and commitments</h2><p>Spend less time catching up, replaying recordings and remembering who to follow up with.</p></div><div class="more-columns">${features.map(([title,text,id])=>`<article><h3>${title}</h3><p>${text}</p>${link("See it in a conversation",`/examples?case=${id}`)}</article>`).join("")}</div></section>`
}
const tools = () => `<section class="wrap section integrations"><div><h2>What you can use today</h2><p>Start with the tools you use. Telegram and MAX are WireCat’s messaging tools. Email through Himalaya and Markdown notes, including Obsidian, can join the same agent workflow.</p><p class="project-definition">More messenger connections are planned. You can use today’s tools on their own.</p></div><div class="integration-table"><a href="${docs}/tg"><span>${icon.telegram}Telegram</span><p>tg · your account, bots and groups</p>${icon.arrow}</a><a href="${docs}/max"><span>${icon.max}MAX</span><p>max · your account, bots and groups</p>${icon.arrow}</a><div class="integration-entry"><span>${icon.email}Email</span><p>Through the Himalaya CLI</p></div><div class="integration-entry"><span>${icon.note}<span class="integration-label">Markdown<small>Obsidian and other editors</small></span></span><p>Your notes, read and updated by your agent</p></div><details><summary>How does this fit together?</summary><p>Your agent coordinates the tools you connect. WireCat supplies the messaging tools; Himalaya is a separate open-source email tool; Markdown notes can live in Obsidian or another editor.</p><p>For example, ask your agent to collect a discussion, check the latest email and prepare an update to your project note.</p></details></div></section>`
const why = () => `<section class="why-band"><div class="wrap"><div class="section-title"><h2>Why it works this well</h2><p>Practical features that help your agent handle the work you normally do in chat apps.</p></div><dl class="why-grid"><div><dt>Search stored history offline</dt><dd>Look through the archive on your computer without fetching every message again.</dd></div><div><dt>Keep work and personal accounts separate</dt><dd>Use profiles for different accounts and bots. Choose which ones a task should use.</dd></div><div><dt>Read voice notes as text</dt><dd>Get a transcript, then ask your agent to pick out the questions and next steps.</dd></div><div><dt>Send messages at the right time</dt><dd>Schedule reminders and follow-ups. Telegram delivers them even when your laptop is off.</dd></div><div><dt>Search words or conversation meaning</dt><dd>Use exact message filters, or build and embed conversations for semantic retrieval.</dd></div><div><dt>Check what was sent</dt><dd>Review send attempts in the journal. Record command runs when you need to inspect a task.</dd></div></dl>${link("See the full feature list","/features")}</div></section>`
const proof = () => `<section class="wrap trust useful-extras"><article>${icon.note}<div><h3>Get a digest of the channels you follow</h3><p>Ask your agent to pick out updates on the topics you care about, with links to the posts.</p>${link("See the morning briefing","/examples?case=inbox")}</div></article><article>${icon.search}<div><h3>Collect the latest files from different chats</h3><p>Find the current contract, invoices and presentation across groups and DMs. Keep older versions in the history.</p>${link("See the document example","/examples?case=files")}</div></article><article>${icon.group}<div><h3>Find questions that still need an answer</h3><p>Ask your agent to review a group for open questions so you can see where someone is waiting for help.</p>${link("Group review guide",`${docs}/tg/groups`)}</div></article></section>`
const calculator = () => `<section class="wrap section calculator"><div><h2>How much time could you get back?</h2><p>Compare your daily chat work with an agent-assisted workflow. Change the volume and the assumptions to match your day.</p><p class="micro">This is an estimate, not a measured speed or accuracy claim. Setup and history downloads are excluded.</p></div><div class="calculator-body"><div class="calculator-inputs">${[['messages','Messages per day',200,1000,10],['chats','Active chats per day',12,50,1],['replies','Replies per day',6,50,1]].map(([id,label,value,max,step])=>`<label for="calc-${id}">${label}<output data-volume="${id}">${value}</output></label><input id="calc-${id}" data-calc="${id}" type="range" min="0" max="${max}" step="${step}" value="${value}">`).join("")}<details><summary>Edit the time assumptions</summary>${[['readSeconds','Read a message manually, seconds',4],['contextSeconds','Find context per chat, seconds',45],['writeMinutes','Write a reply manually, minutes',3],['summaryMinutes','Read the daily briefing, minutes',8],['checkContextSeconds','Check context per chat, seconds',15],['checkReplyMinutes','Review a reply draft, minutes',1]].map(([id,label,value])=>`<label for="time-${id}">${label}<input id="time-${id}" data-timing="${id}" type="number" min="0" step="0.5" value="${value}"></label>`).join("")}</details></div><div class="calculator-result" aria-live="polite"><span id="saving-label">Time you could free up</span><p><strong id="saved-minutes">23</strong> minutes a day</p><p><b id="saved-monthly">9</b> hours over 22 working days</p><div><span>Manual work <b id="manual-time">40</b> min</span><span>With your agent <b id="agent-time">17</b> min</span></div><small>Based on the volumes and timings you entered.</small></div></div></section>`
const panelArgs={icon,link,docs}
const setup = (mode="access") => `<section class="wrap section setup"><div><h2>Give your agent somewhere useful to start.</h2><p>Connect Telegram or MAX, then ask a question about a conversation you already have. Add email and notes when you want them in the same workflow.</p><div class="setup-actions">${connect("closing","Connect your agent")}${link("Installation guide",`${docs}/installation`)}</div><p class="micro">Free tools. Your existing agent or model may have its own costs.</p></div>${closingPanel(mode,panelArgs)}</section>`

function footer() {
  let html=landing.footerHtml
  const contacts=`<ul class="foot-contacts"><li><a href="mailto:${esc(site.contacts.email)}">${esc(site.contacts.email)}</a></li><li><a href="${esc(site.contacts.telegram)}">Telegram · @${esc(new URL(site.contacts.telegram).pathname.slice(1))}</a></li></ul>`
  const command=html.match(/<span class="cmd">[\s\S]*?<\/span>/)?.[0]
  html=html.replace(/(<div class="foot-brand">[\s\S]*?<\/p>)/,b=>b+contacts).replace(/<a class="mark"[^>]*>[\s\S]*?<\/a>/,`<a class="wirecat-brand" href="https://wirecat.dev/en"><span class="wirecat-logo" role="img" aria-label="WireCat">${wirecatLogoSvg}</span></a>`)
  if(command)html=html.replace(command,"").replace('<div class="foot-bottom">',`<div class="footer-install"><span class="footer-install-label">Telegram · CLI + agent skill</span>${command}</div><div class="foot-bottom">`)
  html=html.replace(/href="\/(?!\/)([^"]*)"/g,'href="https://wirecat.dev/$1"')
  html=html.replace('<h2>Project</h2><ul>', '<h2>Project</h2><ul><li><a href="/features">Features</a></li><li><a href="/examples">Examples</a></li>')
  html=html.replace(/(<a href="https:\/\/github\.com[^"]*">)/g,`$1${icon.github}`)
  html=html.replace(/(<a href="https:\/\/t\.me[^"]*">)/g,`$1${icon.telegram}`)
  html=html.replace(/(<a href="mailto:[^"]*">)/g,`$1${icon.email}`)
  return `<div class="wirecat-landing footer-host"><div class="site-footer-shell site-footer-landing">${html}</div></div><div class="toast" role="status" aria-live="polite"></div>`
}
const doc = (title,body,palette="classic") => {
 let navNumber=0
 const namedBody=body.replace(/<nav>/g,()=>`<nav aria-label="${esc(title)} links ${++navNumber}">`).replace('aria-label="AI conversation examples"',`aria-label="${esc(title)} examples"`).replace(/aria-label="Example conversation"/g,`aria-label="${esc(title)} conversation"`).replace(/<main([^>]*)>/g,(_,attrs)=>`<main${attrs} aria-label="${esc(title)}">`).replace('<header class="wrap site-header">',`<header class="wrap site-header" aria-label="${esc(title)} navigation">`).replace('<header class="studio-header">',`<header class="studio-header" aria-label="${esc(title)} navigation">`).replace('<footer class="site">',`<footer class="site" aria-label="${esc(title)} footer">`)
 return `<!doctype html><html lang="en" class="light" data-palette="${palette}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} · WireCat Memory variants</title><link rel="icon" href="/icon.svg"><link rel="stylesheet" href="/production-landing.css"><link rel="stylesheet" href="/production-theme.css"><link rel="stylesheet" href="/production-footer.css"><link rel="stylesheet" href="/base.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/refinement.css"><link rel="stylesheet" href="/chat.css"><link rel="stylesheet" href="/updates.css"><link rel="stylesheet" href="/feature-variants.css"><link rel="stylesheet" href="/refinement-3.css"><link rel="stylesheet" href="/landing-4.css"><link rel="stylesheet" href="/landing-5.css"><script src="/interactions.js" defer></script><script src="/landing-search.js" defer></script><script src="/studio.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a>${namedBody}</body></html>`
}
await mkdir(new URL('history/',root),{recursive:true})
try{await readFile(new URL('history/bubbles-before-role-switch.html',root))}catch{await copyFile(new URL('bubbles.html',root),new URL('history/bubbles-before-role-switch.html',root))}
await mkdir(new URL('previews/',root),{recursive:true})
const refinementPages=homepageRefinements.map(v=>({...config[0],...v,desc:v.description}))
for(const v of [...config,...refinementPages])await writeFile(new URL(`${v.id}.html`,root),doc(v.name,`${header(v)}<main id="main">${v.closing?refinementNav(link):""}${colorControls()}${hero(v)}${what(v)}${roleBand(v)}${more(v)}${tools()}${why()}${v.calculator?calculator():""}${setup(v.closing)}</main>${footer()}`,v.palette))
const gallery=`${header()}<main class="wrap gallery" id="main"><h1>Memory.<br><em>Four ways to make it feel like a chat.</em></h1><p class="lede">The same Outcomes page and purple/green colors. Compare four conversation designs with natural replies and tool details kept out of the way.</p><div class="memory-gallery">${config.map(v=>`<article><a class="preview-window" href="/${v.id}"><img src="/previews/${v.id}.png" alt="${v.name} preview" width="1440" height="1000"></a><h2>${v.name}</h2><p>${v.desc}</p>${link("Open this variant",`/${v.id}`)}</article>`).join("")}</div><div class="archive-links"><h2>Examples and previous designs</h2>${link("All eight landing scenarios","/examples")}${link("The three compact previous designs","http://127.0.0.1:4326/")}${link("The three original mockups","http://127.0.0.1:4326/references")}${link("The earlier six variants","http://127.0.0.1:4325/")}</div></main>${footer()}`
await writeFile(new URL('index.html',root),doc('Four chat treatments',gallery))
function exampleExchange(part,prefix){
 let output=""
 for(let i=0;i<part.length;i++){
  const step=part[i]
  if(step.tool){
   const tools=[];while(i<part.length&&part[i].tool)tools.push(part[i++]);i--
   output+=visibleTools(tools,prefix+"-"+i,"Your agent uses the connected tools")
  }else if(step.html.includes('class="ask step"')){
   const question=plain(step.html.match(/<p>([\s\S]*?)<\/p>/)?.[1]??"").replace(/Copy prompt$/,"").trim()
   output+=`<div class="chat-turn user-turn"><div class="user-message"><p>${esc(question)}</p><button type="button" data-copy="${esc(question)}" aria-label="Copy this request">${icon.copy}</button></div></div>`
  }else{
   const content=step.html.replace(/^<div class="say step">/,"").replace(/<\/div>$/,"").replace(/id="([^"]+)"/g,`id="${prefix}-$1"`)
   const natural=content.replace('<span class="answer-label">Decisions so far</span>', '<p>We’re aiming for Friday’s launch. Here’s what the project group has agreed:</p>').replace('<span class="answer-label">Context from other chats</span>', '<p>The design group and your DMs fill in the picture:</p>')
   output+=`<div class="chat-turn assistant-turn"><span class="chat-avatar" aria-hidden="true">${icon.bot}</span><div class="assistant-message">${natural}</div></div>`
  }
 }
 return output
}
const exampleList=Object.values(cases)
const examples=`${header()}<main class="wrap examples-page" id="main"><div class="examples-heading"><h1>See what your<br><em>agent can do.</em></h1><p class="lede">A meeting brief, a better follow-up, a file you couldn’t find. Follow the conversation and inspect the messages behind each answer.</p></div><section class="scenario-introduction"><h2>Start with a task you recognise.</h2><p>These worked conversations show how you could use WireCat with your own agent. Choose a task, follow the exchange and inspect the commands or source messages behind the answer. Copy a request to try it with your own conversations.</p></section><div class="examples-layout"><aside class="examples-sidebar"><h2>Choose a task</h2><div class="walkthrough-tabs" role="tablist" aria-orientation="vertical" aria-label="Choose an example">${exampleList.map((c,i)=>`<button role="tab" type="button" id="walk-tab-${c.id}" aria-controls="walk-panel-${c.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-walkthrough="${c.id}">${c.title}${icon.arrow}</button>`).join("")}</div>${link("Explore features","/features")}</aside><div class="examples-content"><div class="mobile-example-choice"><label for="example-choice">Choose a task</label><select id="example-choice">${exampleList.map(c=>`<option value="${c.id}">${c.title}</option>`).join("")}</select></div>${exampleList.map((c,i)=>`<section class="walkthrough-panel" role="tabpanel" id="walk-panel-${c.id}" aria-labelledby="walk-tab-${c.id}" ${i?'hidden':''}><div class="example-title"><div><h2>${c.title}</h2><p>${c.caption}</p></div><div class="demo-providers" role="group" aria-label="Messenger in this example"><button type="button" data-demo-provider="tg" aria-pressed="true">Telegram</button><button type="button" data-demo-provider="max" aria-pressed="false">MAX</button></div></div>${['tg','max'].map((provider,j)=>{const session=(provider==='tg'?landing.sessions:landing.maxSessions).find(s=>s.id===c.id);return `<div class="dialogue-provider" data-dialogue-provider="${provider}" ${j?'hidden':''}><div class="example-chat treatment-bubbles">${exchanges(session).map((part,k)=>exampleExchange(part,`example-${provider}-${c.id}-${k}`)).join("")}</div></div>`}).join("")}<div class="example-ending"><p>Try a task like this with your own conversations.</p>${connect(`example-${c.id}`,"Connect your agent")}</div></section>`).join("")}</div></div></main>${footer()}`
await writeFile(new URL('examples.html',root),doc('Examples',examples))
await writeFile(new URL('features.html',root),doc('Features',`${header()}<div class="wrap feature-original-compare">${link("Compare compact feature layouts","/features-compact")}</div>${featurePage({icon,link,connect,docs,tools,setup})}${footer()}`))
const featureArgs={icon,link,connect,docs,tools,setup}
for(const variant of featureVariants)await writeFile(new URL(`${variant.id}.html`,root),doc(variant.name,`${header()}${featureExploration(variant.id,featureArgs)}${footer()}`))
const featureGallery=`${header()}<main id="main" class="wrap feature-options"><h1>Three ways to explain<br><em>what WireCat can do.</em></h1><p class="lede">The same capabilities and purple/green identity, with three different layouts. These feature pages use capability lists, finished artifacts and practical tasks instead of chat bubbles.</p><div class="feature-options-grid">${featureVariants.map(v=>`<article><h2>${v.name}</h2><p>${v.description}</p>${link("Open this layout",`/${v.id}`)}</article>`).join("")}</div><div class="archive-links">${link("Current feature page","/features")}${link("Worked conversations","/examples")}${link("Updated homepage","/bubbles")}${link("Original layout archive","/archive")}${link("Original mockup gallery","http://127.0.0.1:4326/references")}</div></main>${footer()}`
await writeFile(new URL('feature-variants.html',root),doc('Feature layouts',featureGallery))
const archiveLayouts=[['a-morning-brief','Morning Brief','The original paper/receipt-like briefing concept.'],['b-the-thread','The Thread','A continuous conversation-led layout.'],['c-arrivals-board','Arrivals Board','A board that collects work from different conversations.'],['d-agent-desk','Agent Desk','The product shown through a desktop-agent workspace.'],['e-ask-run-answer','Ask, Run, Answer','A layout built around the agent workflow.'],['f-one-message','One Message','A focused message-first concept.']]
await writeFile(new URL('archive.html',root),doc('Original layout archive',`${header()}<main id="main" class="wrap feature-options"><h1>Original layout explorations.</h1><p class="lede">The earlier six concepts, preserved with their original design and copy. For the three later visual mockups, open the reference gallery.</p><div class="feature-options-grid">${archiveLayouts.map(([id,title,text])=>`<article><h2>${title}</h2><p>${text}</p>${link("Open original layout",`/archive/${id}`)}</article>`).join("")}</div><div class="archive-links">${link("Original mockup gallery","http://127.0.0.1:4326/references")}${link("New feature layouts","/feature-variants")}${link("Updated homepage","/bubbles")}</div></main>${footer()}`))
for(const variant of compactFeatureVariants)await writeFile(new URL(`${variant.id}.html`,root),doc(variant.name,`${header()}${compactFeaturePage(variant.id,{icon,link,connect,docs,tools,setup})}${footer()}`))
const compactGallery=`${header()}<main id="main" class="wrap refinement-options"><h1>Personal, bots and admin.<br><em>Three compact feature layouts.</em></h1><p class="lede">All three audiences are visible on the page. Smaller headings, shorter capability lists and fewer repeated introductions.</p><div class="options-section compact-options-grid">${compactFeatureVariants.map(v=>`<article><h2>${v.name}</h2><p>${v.description}</p>${link("Open this layout",`/${v.id}`)}</article>`).join("")}</div><div class="archive-links">${link("Command and closing-block options","/refinement-options")}${link("Previous feature explorations","/feature-variants")}${link("Updated homepage","/bubbles")}</div></main>${footer()}`
await writeFile(new URL('features-compact.html',root),doc('Compact feature layouts',compactGallery))
const previewCalls=landing.sessions.find(s=>s.id==='context').steps
const toolsPreview=[['soft','Soft inset','A quiet green surface keeps the command visible without making it the main event.'],['console','Compact console','A small dark terminal surface gives command text a clear home.'],['ledger','Checked list','White paper, thin rules and checkmarks make a group of completed calls easy to scan.']]
const refinementGallery=`${header()}<main id="main" class="wrap refinement-options"><h1>Useful closing blocks.<br><em>Commands you can actually see.</em></h1><p class="lede">Compare three command treatments and three replacements for the first-question panel. Each combination also has a full homepage preview.</p><section class="options-section"><h2>Command treatments</h2><p>Each shows the same first command and real remaining-call count. Expand the count to see the complete command list.</p><div class="tool-options-grid">${toolsPreview.map(([style,title,text],i)=>`<article class="command-${style}"><h3>${title}</h3>${visibleTools(previewCalls,`preview-${style}`,"Read project chats and DMs",true)}<p>${text}</p>${link("View on the homepage",`/${homepageRefinements[i].id}`)}</article>`).join("")}</div></section><section class="options-section"><h2>Replace the first-question panel</h2><p>Help visitors understand access, choose a connection path or see how chat context can become a useful note.</p><div class="closing-options-grid">${homepageRefinements.map((v,i)=>`<article><h3>${['Access controls','Connection paths','A useful project note'][i]}</h3>${closingPanel(v.closing,panelArgs)}</article>`).join("")}</div></section><section class="options-section"><h2>New compact feature pages</h2><div class="compact-options-grid">${compactFeatureVariants.map(v=>`<article><h3>${v.name}</h3><p>${v.description}</p>${link("Open this layout",`/${v.id}`)}</article>`).join("")}</div></section><div class="archive-links">${link("Updated homepage","/bubbles")}${link("Previous feature variants","/feature-variants")}${link("Worked examples","/examples")}</div></main>${footer()}`
await writeFile(new URL('refinement-options.html',root),doc('Command and closing-block options',refinementGallery))
const compositionArgs={icon,link,docs}
const latestHeader=()=>header().slice(header().indexOf('<header class="wrap site-header">')).replace('href="/" aria-label="WireCat previews"','href="/landing" aria-label="WireCat"').replace('href="/features"','href="/features-roles"')
const latestFooter=()=>footer().replace('href="/features"','href="/features-roles"')
const latestSetup=(kind,prefix)=>`<section class="wrap section setup"><div><h2>Give your agent somewhere useful to start.</h2><p>Connect Telegram or MAX, then ask a question about a conversation you already have. Add email and notes when you want them in the same workflow.</p><div class="setup-actions">${connect("closing","Connect your agent")}${link("Installation guide",`${docs}/installation`)}</div><p class="micro">Free tools. Your existing agent or model may have its own costs.</p></div>${closingFeature(kind,prefix,compositionArgs)}</section>`
const composedBody=(layout,closing,id)=>`<main id="main" class="landing4">${hero({...config[0],id,commandStyle:'ledger'})}${audienceSwitch(id,compositionArgs)}${outcomeBlock(layout,id,compositionArgs)}${tools()}${reasonsBlock(compositionArgs)}${calculator()}${latestSetup(closing,id)}</main>`
const latestFiles=[]
for(const layout of whatLayouts)for(const closing of closingFeatures){const id=`landing-${layout.id}-${closing.id}`;latestFiles.push(id+'.html');await writeFile(new URL(id+'.html',root),doc(`${layout.name} · ${closing.name}`,`${latestHeader()}${composedBody(layout.id,closing.id,id)}${latestFooter()}`))}
for(const [id,layout] of [['landing','columns'],['bubbles','columns'],['landing-columns','columns'],['landing-bands','bands'],['landing-tabs','tabs']]){latestFiles.push(id+'.html');await writeFile(new URL(id+'.html',root),doc('WireCat · current landing composition',`${latestHeader()}${composedBody(layout,'search',id)}${latestFooter()}`))}
const conversation5=(kind,id)=>`<div class="conversation5 conversation5-${kind}">${heroDemo({...config[0],id,commandStyle:'ledger'})}</div>`
const hero5=(kind,id)=>hero({...config[0],id,commandStyle:'ledger'}).replace(/<section class="memory-demo[\s\S]*$/,conversation5(kind,id)+'</section>')
const setup5=(kind,id)=>latestSetup(kind,id).replace(closingFeature(kind,id,compositionArgs),closingFeature5(kind,id,compositionArgs))
const body5=(v,closing,id)=>`<main id="main" class="landing4 landing5">${hero5(v.conversation,id)}${roleBlock5(v.role,id,compositionArgs)}${outcomeBlock5(v.outcome,compositionArgs)}${tools()}${reasonsBlock(compositionArgs)}${trustBlock5(compositionArgs)}${calculator()}${setup5(closing,id)}</main>`
for(const v of landingVariants){for(const closing of closingFeatures){const id=v.id+'-'+closing.id;latestFiles.push(id+'.html');await writeFile(new URL(id+'.html',root),doc(v.name+' · '+closing.name,latestHeader()+body5(v,closing.id,id)+latestFooter()))}latestFiles.push(v.id+'.html');await writeFile(new URL(v.id+'.html',root),doc(v.name,latestHeader()+body5(v,'search',v.id)+latestFooter()))}
for(const id of ['landing','bubbles'])await writeFile(new URL(id+'.html',root),doc('WireCat · compact landing',latestHeader()+body5(landingVariants[0],'search',id)+latestFooter()))
const options5=`<header class="studio-header"><a href="/studio">WireCat · design studio</a><nav><a href="/block-library">Block library</a><a href="/all-designs">All old designs</a></nav></header><main id="main" class="wrap iteration5-options"><h1>Three compact compositions.</h1><p>Same Memory heading, product facts and purple/green palette. Compare the role layout, outcome examples and conversation details.</p><div class="iteration5-cards">${landingVariants.map(v=>`<article><a href="/${v.id}"><img src="/previews/${v.id}.png" alt="Preview of ${v.name}" width="1440" height="1000"></a><h2>${v.name}</h2><p>${v.description}</p>${link('Open this landing','/'+v.id)}</article>`).join('')}</div><section class="iteration5-parts"><h2>Choose individual parts.</h2><p>The hero heading stays fixed. These previews change only the conversation, role presentation and outcomes.</p><nav>${link('Conversation details','/block-library?group=Hero details')}${link('Personal / bots / admin','/block-library?group=Role layouts')}${link('What you can do','/block-library?group=Outcome layouts')}${link('Earlier compact blocks','/block-library?group=Earlier compact blocks')}${link('The original visual mockups','/block-library?group=Original visual references')}</nav></section></main>`
await writeFile(new URL('iteration-five.html',root),doc('Compact compositions and details',options5));latestFiles.push('iteration-five.html')
await bundleBrowser({entryPoints:[new URL('mini-search.mjs',root).pathname],outfile:new URL('landing-search.js',root).pathname,bundle:true,minify:true,platform:'browser',format:'iife',target:'es2022'})
const retainedBlocks=JSON.parse(await readFile(new URL('retained-blocks.json',root),'utf8'))
const blocks=[
 ...retainedBlocks,
 ...conversationLayouts.map(v=>({id:'conversation-'+v.id,name:'Hero detail · '+v.name,group:'Hero details',width:'half',height:560,html:conversation5(v.id,'block-conversation-'+v.id)})),
 ...roleLayouts.map(v=>({id:'roles-'+v.id,name:'Personal / bots / admin · '+v.name,group:'Role layouts',width:'full',html:roleBlock5(v.id,'block-roles-'+v.id,compositionArgs)})),
 ...outcomeLayouts.map(v=>({id:'outcomes5-'+v.id,name:'What you can do · '+v.name,group:'Outcome layouts',width:'full',html:outcomeBlock5(v.id,compositionArgs)})),
 {id:'trust5',name:'Open source / your data / your agent',group:'Reasons and tools',width:'full',html:trustBlock5(compositionArgs)},
 {id:'search5',name:'Compact search demonstration',group:'Calculator and closing',width:'half',html:closingFeature5('search','block-search5',compositionArgs)},
 ...compactFeatureVariants.map(v=>({id:'feature-structure-'+v.id,name:'Feature structure · '+v.name,group:'Feature page structures',height:550,source:'/'+v.id})),
 ...featureVariants.map(v=>({id:'earlier-feature-'+v.id,name:'Earlier feature structure · '+v.name,group:'Earlier feature structures',height:550,source:'/'+v.id})),

 {id:'audiences',name:'Personal / bots / admin switch',group:'Audience and outcomes',height:570,html:audienceSwitch('block-audiences',compositionArgs)},
 ...whatLayouts.map(v=>({id:'outcomes-'+v.id,name:'What you can do · '+v.name,group:'Audience and outcomes',height:520,html:outcomeBlock(v.id,'block-'+v.id,compositionArgs)})),
 {id:'old-audience-band',name:'Earlier account / bots / groups band',group:'Earlier alternatives',height:390,html:roleBand(config[0])},
 {id:'nine-reasons',name:'Nine production reasons · purple icons',group:'Reasons and tools',height:590,html:reasonsBlock(compositionArgs)},
 {id:'nine-reasons-plain',name:'Nine production reasons · no icons',group:'Reasons and tools',height:590,html:reasonsBlock(compositionArgs,false)},
 {id:'six-reasons',name:'Earlier six reasons',group:'Earlier alternatives',height:590,html:why()},
 {id:'connections',name:'Telegram / MAX / email / Markdown',group:'Reasons and tools',height:490,html:tools()},
 {id:'calculator',name:'Editable time estimate',group:'Calculator and closing',height:600,html:calculator()},
 ...closingFeatures.map(v=>({id:'closing-'+v.id,name:'Closing feature · '+v.name,group:'Calculator and closing',height:590,html:closingFeature(v.id,'block-'+v.id,compositionArgs)})),
 ...['access','connections','notes'].map(v=>({id:'closing-'+v,name:'Earlier closing · '+v,group:'Calculator and closing',height:520,html:closingPanel(v,panelArgs)})),
 {id:'first-question',name:'Original first-question panel',group:'Earlier alternatives',height:350,html:`<div class="starter"><h3>Try a first question</h3><p>“Find a decision from last week and show me the messages behind it.”</p><button class="text-link" data-copy="Use tg cli to find a decision from last week and show me the messages behind it.">Copy the request${icon.copy}</button><details><summary>Where is my information processed?</summary><p>The messaging archive is stored on your computer. Content given to your agent follows its model configuration.</p></details></div>`},
 ...['soft','console','ledger'].map(style=>({id:'commands-'+style,name:'Command treatment · '+style,group:'Commands',height:180,html:`<div class="command-${style}">${visibleTools(landing.sessions.find(s=>s.id==='context').steps,'block-commands-'+style,'Read project chats and DMs',true)}</div>`})),
 {id:'extra-tasks',name:'Earlier briefing / voice / reminders section',group:'Earlier alternatives',height:430,html:more(config[0])},
 {id:'extra-proof',name:'Earlier digest / files / questions strip',group:'Earlier alternatives',height:430,html:proof()},
 {id:'footer',name:'Production footer',group:'Footer',height:580,html:footer()},
]
for(const block of blocks){if(block.source)continue;const id='block-'+block.id;latestFiles.push(id+'.html');await writeFile(new URL(id+'.html',root),doc(block.name,`<main id="main" class="block-canvas landing4 landing5"><h1 class="sr-only">Block preview</h1><h2 class="sr-only">${block.name}</h2>${block.html}</main><div class="toast" role="status" aria-live="polite"></div>`))}
const registry=[]
const addCollection=async(name,folder,base,filter=()=>true)=>{const items=[];for(const file of (await readdir(folder)).filter(x=>x.endsWith('.html')&&filter(x)).sort()){const text=await readFile(new URL(file,folder),'utf8');const title=plain(text.match(/<title>([\s\S]*?)<\/title>/)?.[1]??file).replace(/ · WireCat.*$/,'');items.push({name:title+(file==='index.html'?' · comparison':''),href:base+(file==='index.html'?'/':'/'+file.replace(/\.html$/,''))})}if(items.length)registry.push({name,items})}
await addCollection('First six approaches · port 4325',new URL('../homepage-variants/',root),'http://127.0.0.1:4325')
await addCollection('Compact concepts and original mockups · port 4326',new URL('../homepage-next/',root),'http://127.0.0.1:4326')
await addCollection('Memory explorations and calculator · port 4327',new URL('../homepage-memory/',root),'http://127.0.0.1:4327')
await addCollection('Original hero conversations · port 4328',new URL('../homepage-memory-heroes/',root),'http://127.0.0.1:4328')
await addCollection('Current and later explorations · port 4329',root,'http://127.0.0.1:4329',file=>!file.startsWith('block-')&&!['studio.html','all-designs.html','block-library.html'].includes(file))
const originalItems=(await readdir(new URL('archive/',root))).filter(x=>x.endsWith('.html')).sort().map(file=>({name:file.replace(/\.html$/,'').replace(/-/g,' '),href:'http://127.0.0.1:4329/archive/'+file}))
registry.push({name:'Original design/landing concepts',items:originalItems})
registry.push({name:'Preserved before this composition',items:[{name:'Landing · before visual rework',href:'http://127.0.0.1:4329/history/landing-before-visual-rework.html'},{name:'Chat bubbles · before role switch',href:'http://127.0.0.1:4329/history/bubbles-before-role-switch.html'}]})
await writeFile(new URL('design-registry.json',root),JSON.stringify(registry,null,2))
await writeFile(new URL('studio.html',root),doc('Private design studio',studioPage({registry,whatLayouts:landingVariants.map(v=>({id:v.id.replace("landing-",""),name:v.name})),closingFeatures,icon,link})))
await writeFile(new URL('all-designs.html',root),doc('All old and current design links',allDesignsPage({registry,link})))
await writeFile(new URL('block-library.html',root),doc('Private block catalogue',blockLibraryPage({blocks,link})))
latestFiles.push('studio.html','all-designs.html','block-library.html')
await writeFile(new URL('setup-prompts.js',root),`window.wirecatSetupPrompts=${JSON.stringify(Object.fromEntries(['tg','max'].map(t=>[t,wordsFor('en').onboarding.prompt(t,`@leemour/${t}-cli`)])))};`)
for(const filename of new Set([...latestFiles,'index.html','examples.html','features.html','feature-variants.html','archive.html','features-compact.html','refinement-options.html',...compactFeatureVariants.map(v=>`${v.id}.html`),...refinementPages.map(v=>`${v.id}.html`),...featureVariants.map(v=>`${v.id}.html`),...config.map(v=>`${v.id}.html`)])){const p=new URL(filename,root);const text=await readFile(p,'utf8');await writeFile(p,text.replace('<script src="/interactions.js"','<script src="/setup-prompts.js" defer></script><script src="/interactions.js"'))}
console.log('Built chat treatments, features and examples.')

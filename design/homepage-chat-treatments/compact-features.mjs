export const compactFeatureVariants=[
 {id:'features-roles',name:'Three role columns',description:'Personal, bots and admin sit side by side. Four compact capabilities per role; details open only when you want them.'},
 {id:'features-chapters',name:'Compact role sections',description:'Three horizontal role sections. Each pairs a short purpose with a small, grouped capability list.'},
 {id:'features-compare',name:'Role comparison',description:'A compact table shows how reading, replies and organisation work for each role.'},
]
const roles=[
 {id:'personal',name:'Personal account',intro:'Find what matters in your own conversations.',guide:'tg/usage',example:'inbox',items:[
  ['Search messages and files','Search stored history by words, person, date and chat. Read surrounding messages and download the attachments you need.'],
  ['Catch up and track replies','Bring unread messages and commitments into a briefing. See who is waiting for you and what you are waiting for.'],
  ['Read voice notes as text','Transcribe voice messages on your computer, then ask your agent for the questions and next steps.'],
  ['Draft, send and schedule','Prepare a reply with the history in mind. Send text and files, edit or forward messages, and schedule reminders.'],
 ]},
 {id:'bots',name:'Bots',intro:'Answer and act through a bot’s own identity.',guide:'bot-api',example:'bot',items:[
  ['Answer from the bot’s history','Use messages the bot previously received to prepare a reply. Check what is confirmed before promising a change.'],
  ['Send updates and files','Send, edit, delete and pin bot messages. Share attachments and prepare customer updates.'],
  ['Handle buttons and commands','Respond to button presses, manage the command menu and use webhooks in the workflow you build.'],
  ['Connect and manage','Connect your agent through MCP. Use the bot’s group permissions to manage members and administrators.'],
 ]},
 {id:'admin',name:'Administer groups',intro:'Keep a group useful and organised.',guide:'tg/groups',example:'moderation',items:[
  ['Find unanswered questions','Review a group for questions that still need an answer, including the surrounding discussion.'],
  ['Preview moderation','Check messages against your rules and inspect proposed actions before applying them. Reviews run when you or your schedule starts them.'],
  ['Manage members and invites','Add or remove members, manage administrator rights, and inspect or reset invite links.'],
  ['Organise groups and topics','Update group details and settings. In Telegram, work with forum topics and topic-specific conversations.'],
 ]},
]
export function compactFeaturePage(id,{icon,link,connect,docs,tools,setup}){
 const nav=`<nav class="wrap compact-compare-nav" aria-label="Compare compact feature layouts">${link('Compare compact layouts','/features-compact')}${compactFeatureVariants.map(v=>`<a href="/${v.id}" ${id===v.id?'aria-current="page"':''}>${v.name}</a>`).join('')}</nav>`
 const heading=`<section class="wrap compact-feature-heading"><div><h1>Messaging tools for<br><em>your account, bots and groups.</em></h1><p>Connect the AI agent you already use to Telegram and MAX. Choose the work it should handle.</p></div><div>${connect('compact-features','Connect your agent',true)}${link('See worked conversations','/examples')}</div></section>`
 const item=(item,role,index)=>`<details class="compact-capability"><summary>${item[0]}${icon.down}</summary><p>${item[1]}</p></details>`
 const links=role=>`<div class="role-footer">${link('See an example',`/examples?case=${role.example}`)}${link('Guide',`${docs}/${role.guide}`)}</div>`
 let content=''
 if(id==='features-roles'){
  content=`<section class="wrap role-columns" aria-label="Capabilities by account type">${roles.map(role=>`<article><h2>${role.name}</h2><p>${role.intro}</p><div>${role.items.map((entry,i)=>item(entry,role,i)).join('')}</div>${links(role)}</article>`).join('')}</section>`
 }else if(id==='features-chapters'){
  content=`<section class="wrap role-chapters" aria-label="Capabilities by account type">${roles.map(role=>`<article><div class="chapter-label"><h2>${role.name}</h2><p>${role.intro}</p>${links(role)}</div><div class="chapter-capabilities">${role.items.map((entry,i)=>`<div><h3>${entry[0]}</h3><p>${entry[1]}</p></div>`).join('')}</div></article>`).join('')}</section>`
 }else{
  const matrix=[
   ['Find and understand','Search your chats, commitments and files. Transcribe voice notes.','Search messages the bot received; check customer context.','Review group discussions and unanswered questions.'],
   ['Reply and act','Draft replies, send files and schedule follow-ups.','Send updates, answer customers and handle button presses.','Preview moderation and apply the actions you choose.'],
   ['Organise and connect','Keep work and personal accounts in separate profiles.','Use MCP, command menus and webhooks; manage group members.','Manage members, invites, settings and Telegram forum topics.'],
  ]
  content=`<section class="wrap role-comparison"><div class="role-table-wrap"><table class="role-table"><caption class="sr-only">Capabilities for personal accounts, bots and group administration</caption><thead><tr><th scope="col">What you need</th>${roles.map(role=>`<th scope="col">${role.name}<span>${role.intro}</span></th>`).join('')}</tr></thead><tbody>${matrix.map(([title,...cells])=>`<tr><th scope="row">${title}</th>${cells.map(text=>`<td>${text}</td>`).join('')}</tr>`).join('')}<tr class="table-guides"><th scope="row">Explore</th>${roles.map(role=>`<td>${links(role)}</td>`).join('')}</tr></tbody></table></div><div class="mobile-role-comparison">${roles.map((role,i)=>`<article><h2>${role.name}</h2><p>${role.intro}</p><dl>${matrix.map(([title,...cells])=>`<div><dt>${title}</dt><dd>${cells[i]}</dd></div>`).join('')}</dl>${links(role)}</article>`).join('')}</div></section>`
 }
 const shared=`<section class="wrap shared-capabilities"><h2>Built around your agent.</h2><dl><div><dt>Local history</dt><dd>Save the chats you choose and search the archive offline.</dd></div><div><dt>Profiles and permissions</dt><dd>Separate accounts, limit recipients and choose read-only or confirmed changes.</dd></div><div><dt>Skills and MCP</dt><dd>Connect a terminal or desktop agent through the interface it uses.</dd></div></dl><div>${link('Telegram documentation',`${docs}/tg`)}${link('MAX documentation',`${docs}/max`)}</div></section>`
 const support=`<section class="wrap compact-connections"><h2>Add email and notes when you need them.</h2><p>Your agent can use Himalaya for email and read or update Markdown files in Obsidian or another editor. Start with Telegram or MAX; add more context at your own pace.</p></section><section class="wrap compact-feature-close"><div><h2>Connect your agent.</h2><p>Install the messaging tool and give your agent its skill, or connect through MCP.</p></div><div>${connect('compact-close','Connect your agent',true)}${link('Installation guide',`${docs}/installation`)}</div></section>`
 return `<main id="main" class="compact-feature-page compact-${id}">${nav}${heading}${content}${shared}${support}</main>`
}

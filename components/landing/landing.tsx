import { AgentApp, type Session } from "@/components/landing/agent-app"
import { LandingEffects } from "@/components/landing/effects"
import { Features } from "@/components/landing/features"
import { fontVariables } from "@/components/landing/fonts"
import { wallpaper } from "@/components/landing/wallpaper"
import { translator } from "@/lib/landing/i18n"
import "./landing.css"

const languages = [
  ["en", "English"],
  ["ru", "Русский"],
  ["es", "Español"],
] as const

function sessionsFor(t: (text: string) => string, c: (text: string) => string): Session[] {
  return [
    {
      title: t("Who owes what"),
      hint: "tg review",
      steps: [
        { ask: t("What did I promise anyone this week, and who still owes me?") },
        {
          tool: "tg review <b>--since-time 7d</b>",
          out: c(`{"since": "2026-09-25T09:00:00+02:00", "until": "2026-10-02T08:58:00+02:00",
 "complete": true,
 "chats": [{"title": "Anna", "kind": "dialog", "messages": […], "more": false},
           {"title": "Design", "kind": "group", "messages": […], "more": false},
           {"title": "Project Alpha", "kind": "group", "messages": […], "more": false}, …],
 "skipped": [], "partial": false, "quiet": 14}`),
        },
        {
          say: [
            "<h3>You owe</h3><ul><li><b>Anna</b>: the invoice by Friday. That is today. <q>Anna, 29 Sep</q></li><li><b>Kate</b>: notes on the new slides. <q>Design, 1 Oct</q></li></ul>",
            "<h3>Waiting on others</h3><ul><li><b>Tom</b>: the mock-up, promised for 30 Sep. Not in Design yet.</li></ul>",
            "<h3>Needs clarifying</h3><ul><li><b>Project Alpha</b>: who brings the samples. <q>We'll decide later</q>, 25 Sep</li></ul>",
            "<p><small>Next review starts from 2 Oct, 08:58.</small></p>",
          ]
            .map(t)
            .join(""),
        },
        { ask: t("Nudge Tom about the mock-up.") },
        {
          tool: c('tg messages send <b>"Tom"</b> "Hi Tom! How is the mock-up going?"'),
          out: c(`{"message": {"id": "48213", "text": "Hi Tom! How is the mock-up going?", "timestamp": "2026-10-02T09:01:12+02:00", "outgoing": true, …},
 "sendId": "…"}`),
        },
        { say: t("<p>Sent to Tom.</p>") },
      ],
    },
    {
      title: t("Morning catch-up"),
      hint: "tg inbox",
      steps: [
        { ask: t("Anything I need to see this morning?") },
        {
          tool: "tg inbox",
          out: c(`{"mode": "unread",
 "chats": [{"title": "Book club", "kind": "group", "unreadCount": 4, "messages": […], "more": false},
           {"title": "Marco", "kind": "dialog", "unreadCount": 1, "messages": […], "more": false},
           {"title": "Mum", "kind": "dialog", "unreadCount": 1, "messages": […], "more": false}],
 "skipped": [], "partial": false, "quiet": 211}`),
        },
        {
          say: t(
            "<p>Three chats need you. Nothing is marked read.</p><ul><li><b>Marco</b> needs the release tag approved before 11.</li><li><b>Book club</b> moved Friday to 19:30 and wants a yes from you.</li><li><b>Mum</b> sent a voice note, 0:42.</li></ul><p><small>211 muted chats changed, none of them mention you.</small></p>",
          ),
        },
      ],
    },
    {
      title: t("Lisbon money"),
      hint: "tg search messages",
      steps: [
        { ask: t("Who owes who from the Lisbon trip?") },
        {
          tool: c('tg search messages <b>"paid"</b> --chat "Lisbon trip"'),
          out: c(`{"items": [{"senderName": "Ana", "text": "Paid the hotel, 240", "timestamp": "2026-09-14T22:10:00+02:00"},
           {"senderName": "Ben", "text": "paid dinner 96", "timestamp": "2026-09-15T23:41:00+02:00"},
           {"outgoing": true, "text": "I paid the taxi, 60", "timestamp": "2026-09-16T08:05:00+02:00"}],
 "hasMore": false}`),
        },
        {
          say: `${t("<p>Three payments, €396 in total, €132 each.</p>")}
<table><thead><tr><th></th><th>${t("Paid")}</th><th>${t("Share")}</th><th>${t("Balance")}</th></tr></thead><tbody>
<tr><td>Ana</td><td>€240</td><td>€132</td><td class="plus">+€108</td></tr>
<tr><td>Ben</td><td>€96</td><td>€132</td><td class="minus">−€36</td></tr>
<tr><td>${t("You")}</td><td>€60</td><td>€132</td><td class="minus">−€72</td></tr></tbody></table>
${t("<p>You send Ana €72, Ben sends her €36. Want me to post that in the chat?</p>")}`,
        },
      ],
    },
    {
      title: t("Reminders"),
      hint: "--at-time",
      steps: [
        { ask: t("Remind me to call Mum at six. And send the team the minutes on Monday at nine.") },
        {
          tool: c('tg messages send <b>me</b> "Call Mum" --at-time 2026-10-02T18:00'),
          out: c(
            `{"message": {"id": "…", "text": "Call Mum", "timestamp": "2026-10-02T18:00:00+02:00", …}, "sendId": "…"}`,
          ),
        },
        {
          tool: c(
            'tg messages send <b>"Team"</b> "Minutes from Thursday" --file minutes.pdf --at-time 2026-10-05T09:00',
          ),
          out: c(
            `{"message": {"id": "…", "text": "Minutes from Thursday", "timestamp": "2026-10-05T09:00:00+02:00", …}, "sendId": "…"}`,
          ),
        },
        {
          say: t(
            "<p>Both are scheduled on Telegram's side: the reminder lands in your Saved Messages at 18:00 today, the minutes go to Team on Monday at 09:00. Your laptop can be closed.</p>",
          ),
        },
      ],
    },
    {
      title: t("Voice note"),
      hint: "tg messages transcribe",
      steps: [
        { ask: t("What did Mum say? I'm in a meeting.") },
        {
          tool: c('tg messages transcribe <b>"Mum"</b> 8812 --local'),
          out: c(`{"text": "Hi love, is your flight still at six? Call me when you land…", "pending": false}`),
        },
        {
          say: t(
            "<p><q>Hi love, is your flight still at six? Call me when you land, and don't forget Granddad's birthday on Sunday.</q></p><p>Want a reminder for Sunday morning?</p>",
          ),
        },
      ],
    },
  ]
}

export function Landing({ lang }: { lang: string }) {
  const { t, c } = translator(lang)
  const sessions = sessionsFor(t, c)
  return (
    <div className={`wc ${lang} ${fontVariables}`} lang={lang} style={wallpaper()}>
      <div className="bar" id="bar">
        <header className="top wrap">
          <a className="mark" href={`/${lang}`}>
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <circle className="ring" cx="16" cy="16" r="16" />
              <circle cx="16" cy="16" r="16" fill="#4b53f0" />
              <path
                className="wire"
                pathLength="40"
                d="M9 21V11l4 4 3-4 3 4 4-4v10"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path className="pulse" pathLength="40" d="M9 21V11l4 4 3-4 3 4 4-4v10" />
            </svg>
            <span className="word">
              Wir<span className="word-tail">eCat</span>
            </span>
          </a>
          <div className="right">
            <details className="lang">
              <summary aria-label="Language">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M1.7 8h12.6M8 1.7c1.8 1.8 2.6 4 2.6 6.3S9.8 12.5 8 14.3M8 1.7C6.2 3.5 5.4 5.7 5.4 8s.8 4.5 2.6 6.3" />
                </svg>
                <span>{lang.toUpperCase()}</span>
                <svg
                  className="dn"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4.5 6.5L8 10l3.5-3.5" />
                </svg>
              </summary>
              <div className="lang-menu">
                {languages.map(([code, name]) => (
                  <a key={code} href={`/${code}`} lang={code} aria-current={code === lang ? "page" : undefined}>
                    {name}
                  </a>
                ))}
              </div>
            </details>
            <nav className="site" aria-label="Site">
              <span className="glide" aria-hidden="true"></span>
              <a href={`/${lang}/docs/tg`}>Telegram</a>
              <a href={`/${lang}/docs/max`}>MAX</a>
              <a href="#about">{t("About")}</a>
            </nav>
          </div>
        </header>
      </div>

      <main className="wrap hero">
        <div className="hero-text">
          <h1 id="headline">
            {t("Never search a chat again.")} <span>{t("Just ask.")}</span>
          </h1>
          <div>
            <p className="lede">
              {t("Connect Claude Code, Codex or another agent to your messengers. Find who owes what in")}{" "}
              <b>{t("Telegram and MAX")}</b>
              {t(", set reminders and let it reply for you.")}
            </p>
            <div className="cta">
              <span className="cmd">
                <code>{c("npm i -g @leemour/tg-cli")}</code>
                <button className="copy" type="button" data-copy="npm i -g @leemour/tg-cli">
                  {t("Copy")}
                </button>
              </span>
              <a className="btn" href="#connect">
                {t("Connect your agent")}
              </a>
            </div>
            <p className="tagline">
              <b>{t("AI messaging with CLI tools for agents.")}</b> {t("Free and open source.")}
            </p>
          </div>
        </div>

        <AgentApp
          sessions={sessions}
          title={t("Agent · ~/inbox")}
          replay={t("Replay")}
          sessionsLabel={t("Sessions")}
          placeholder={t("Ask about your chats…")}
        />
      </main>

      <section id="day" style={{ paddingTop: "0" }}>
        <div className="wrap">
          <h2 className="big">{t("A day with your agent")}</h2>
          <p className="intro">
            {t("You ask in plain words. Your agent runs one")} <code>{c("tg")}</code>{" "}
            {t("command and gets back to you with the answer, not the chat.")}
          </p>
          <div className="day">
            <div className="hour reveal">
              <span className="time">08:00</span>
              <span className="dot"></span>
              <div>
                <h3>{t("The morning summary")}</h3>
                <code className="chip">{c("tg inbox --new")}</code>
                <p className="why">
                  {t(
                    "Set it once as a schedule. Before you open the app, your agent has read everything that came in overnight and written you one message.",
                  )}
                </p>
                <p className="why">
                  {t(
                    "Muted groups stay out of it unless someone mentions you. Nothing is marked as read, so nobody sees you looked.",
                  )}
                </p>
              </div>
              <div className="thread">
                <div className="thread-head">
                  <span className="av">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M5 18V7l4 4 3-4 3 4 4-4v11"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <b>{t("Your agent")}</b> {t("· morning summary")}
                </div>
                <div className="msg bot">
                  <span className="ran">tg inbox --new</span>
                  <p>
                    <b>{t("Good morning. 4 chats need you, 206 messages can wait.")}</b>
                  </p>
                  <ul>
                    <li>
                      <b>Marco</b> {t("needs the release tag approved before 11:00.")}
                    </li>
                    <li>
                      <b>{t("Book club")}</b> {t("moved Friday to 19:30. Anna asks if you're in.")}
                    </li>
                    <li>
                      <b>Pablo</b> {t("has waited 3 days for the invoice.")}
                    </li>
                    <li>
                      <b>{t("Mum")}</b> {t("sent a voice note, 0:42.")}
                    </li>
                  </ul>
                  <p>{t("Work all-hands (128) and Hiking club (57) have nothing for you.")}</p>
                  <div className="meta">08:00</div>
                </div>
                <div className="msg me">
                  <p>{t("Tell Anna I'm in. Remind me about Pablo at 2.")}</p>
                  <div className="meta">08:04</div>
                </div>
                <div className="msg bot">
                  <p>
                    {t("Sent to Book club:")} <q>{t("I'm in, 19:30 works!")}</q>{" "}
                    {t("Pablo's reminder is set for 14:00.")}
                  </p>
                  <div className="meta">08:04</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">11:20</span>
              <span className="dot"></span>
              <div>
                <h3>{t("A voice note in a meeting")}</h3>
                <code className="chip">{c('tg messages transcribe "Mum" 8812 --local')}</code>
                <p className="why">
                  {t(
                    "Read it instead of leaving the room. The speech model runs on your own computer, in 25 languages, and the audio goes nowhere else.",
                  )}
                </p>
              </div>
              <div className="thread">
                <div className="msg me">
                  <p>{t("What did Mum say? Can't listen now.")}</p>
                  <div className="meta">11:20</div>
                </div>
                <div className="msg bot">
                  <span className="ran">tg messages transcribe "Mum" 8812 --local</span>
                  <p>
                    <q>
                      {t(
                        "Hi love, is your flight still at six? Call me when you land. And don't forget Granddad's birthday on Sunday, he'd love a call.",
                      )}
                    </q>
                  </p>
                  <p>
                    {t(
                      "Two things in there: call her tonight after landing, and Granddad on Sunday. Set reminders for both?",
                    )}
                  </p>
                  <div className="meta">11:20</div>
                </div>
                <div className="msg me">
                  <p>{t("Yes. Sunday at 10.")}</p>
                  <div className="meta">11:21</div>
                </div>
                <div className="msg bot">
                  <p>
                    {t("Done: Sunday 10:00,")} <q>{t("Call Granddad, happy birthday")}</q>.
                  </p>
                  <div className="meta">11:21</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">13:30</span>
              <span className="dot"></span>
              <div>
                <h3>{t("Who owes who")}</h3>
                <code className="chip">{c('tg search messages "paid" --chat "Lisbon trip"')}</code>
                <p className="why">
                  {t(
                    "Payments are scattered across a week of trip chat. Your agent finds them in the copy of your chats on your computer and does the sums.",
                  )}
                </p>
                <p className="why">{t("No scrolling back, no spreadsheet.")}</p>
              </div>
              <div className="thread">
                <div className="msg me">
                  <p>{t("Settle the Lisbon trip for me.")}</p>
                  <div className="meta">13:30</div>
                </div>
                <div className="msg bot">
                  <span className="ran">tg search messages "paid" --chat "Lisbon trip"</span>
                  <p>{t("Found 3 payments, €396 in total, €132 each:")}</p>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>{t("Paid")}</th>
                        <th>{t("Balance")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{t("Ana · hotel")}</td>
                        <td>€240</td>
                        <td className="plus">+€108</td>
                      </tr>
                      <tr>
                        <td>{t("Ben · dinner")}</td>
                        <td>€96</td>
                        <td className="minus">−€36</td>
                      </tr>
                      <tr>
                        <td>{t("You · taxi")}</td>
                        <td>€60</td>
                        <td className="minus">−€72</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>{t("You send Ana €72, Ben sends her €36. Post that in the chat?")}</p>
                  <div className="meta">13:30</div>
                </div>
                <div className="msg me">
                  <p>{t("Post it.")}</p>
                  <div className="meta">13:31</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">14:00</span>
              <span className="dot"></span>
              <div>
                <h3>{t("The reminder you asked for")}</h3>
                <code className="chip">
                  {c('tg messages send me "Answer Pablo about the invoice" --at-time 2026-10-02T14:00')}
                </code>
                <p className="why">
                  {t(
                    "Set this morning in one sentence. Telegram itself delivers it to your Saved Messages, so it arrives even if your laptop is closed.",
                  )}
                </p>
              </div>
              <div className="thread">
                <div className="note">{t("Saved Messages")}</div>
                <div className="msg other">
                  <span className="from">{t("Reminder")}</span>
                  <p>{t("Answer Pablo about the invoice.")}</p>
                  <div className="meta">14:00</div>
                </div>
                <div className="msg me">
                  <p>{t("Draft Pablo a reply: invoice goes out Monday.")}</p>
                  <div className="meta">14:02</div>
                </div>
                <div className="msg bot">
                  <p>
                    {t("Draft:")} <q>{t("Hi Pablo, sorry for the wait! The invoice goes out on Monday.")}</q>{" "}
                    {t("Send it?")}
                  </p>
                  <div className="meta">14:02</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">16:00</span>
              <span className="dot"></span>
              <div>
                <h3>{t("Replies while you're busy")}</h3>
                <code className="chip">{c("tg watch")}</code>
                <p className="why">
                  {t(
                    "Tell your agent what to answer, and it watches new messages as they arrive and replies in your name.",
                  )}
                </p>
                <p className="why">{t("Anything it isn't sure about waits for you.")}</p>
              </div>
              <div className="thread">
                <div className="msg me">
                  <p>
                    {t(
                      "I'm in workshops till 6. If Priya asks for the deck, send her the link. Anything else, tell me later.",
                    )}
                  </p>
                  <div className="meta">15:58</div>
                </div>
                <div className="msg other">
                  <span className="from">Priya</span>
                  <p>{t("Hey! Where's the latest deck?")}</p>
                  <div className="meta">16:12</div>
                </div>
                <div className="msg bot">
                  <span className="ran">tg messages send "Priya" "Here you go: …/deck-v3"</span>
                  <p>{t("Sent Priya the deck link.")}</p>
                  <div className="meta">16:12</div>
                </div>
                <div className="msg other">
                  <span className="from">Tom</span>
                  <p>{t("Can we move tomorrow's call to 3?")}</p>
                  <div className="meta">16:40</div>
                </div>
                <div className="msg bot">
                  <p>{t("Tom wants tomorrow's call at 15:00. Saved for when you're out.")}</p>
                  <div className="meta">16:40</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">18:00</span>
              <span className="dot"></span>
              <div>
                <h3>{t("Questions left hanging")}</h3>
                <code className="chip">{c('tg review --chat "Hiking club" --unanswered')}</code>
                <p className="why">
                  {t(
                    "In the groups you run: who asked something and never got an answer. Useful before it turns into ten follow-ups.",
                  )}
                </p>
              </div>
              <div className="thread">
                <div className="msg me">
                  <p>{t("Anything unanswered in Hiking club?")}</p>
                  <div className="meta">18:00</div>
                </div>
                <div className="msg bot">
                  <span className="ran">tg review --chat "Hiking club" --unanswered</span>
                  <p>{t("Two questions have waited more than a day:")}</p>
                  <ul>
                    <li>
                      <b>Lucas</b>
                      {t(": who has the second tent?")} <i>{t("yesterday, 09:14")}</i>
                    </li>
                    <li>
                      <b>Sofia</b>
                      {t(": what time does the bus leave on Saturday?")} <i>{t("yesterday, 17:40")}</i>
                    </li>
                  </ul>
                  <p>{t("The plan from last week says 07:30 for the bus. Answer Sofia with that?")}</p>
                  <div className="meta">18:00</div>
                </div>
              </div>
            </div>

            <div className="hour reveal">
              <span className="time">21:30</span>
              <span className="dot"></span>
              <div>
                <h3>{t("Who owes what this week")}</h3>
                <code className="chip">{c("tg review --since-time 7d")}</code>
                <p className="why">
                  {t(
                    "Everything said since the last review, your messages too, sorted into what you promised and what others promised you.",
                  )}
                </p>
                <p className="why">{t("The next review starts where this one ended.")}</p>
              </div>
              <div className="thread">
                <div className="msg me">
                  <p>{t("What did I promise anyone this week?")}</p>
                  <div className="meta">21:30</div>
                </div>
                <div className="msg bot">
                  <span className="ran">tg review --since-time 7d</span>
                  <p>
                    <b>{t("You owe")}</b>
                  </p>
                  <ul>
                    <li>
                      {t("Anna: the invoice, by today.")} <i>{t("29 Sep")}</i>
                    </li>
                    <li>
                      {t("Kate: notes on the new slides.")} <i>{t("1 Oct")}</i>
                    </li>
                  </ul>
                  <p>
                    <b>{t("Waiting on others")}</b>
                  </p>
                  <ul>
                    <li>{t("Tom: the mock-up, promised for 30 Sep.")}</li>
                  </ul>
                  <p>
                    <b>{t("Needs clarifying")}</b>
                  </p>
                  <ul>
                    <li>
                      {t("Project Alpha: who brings the samples.")} <i>{t('"We\'ll decide later"')}</i>
                    </li>
                  </ul>
                  <div className="meta">21:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="connect">
        <div className="wrap">
          <h2 className="big">{t("Connect your agent in one line")}</h2>
          <p className="intro">{t("Each tool ships with an agent skill and an MCP server.")}</p>
          <div className="connect">
            <div className="lane">
              <h3>Claude Code · Codex · Gemini CLI</h3>
              <p>{t("Installs the skill: which commands exist and how to use them.")}</p>
              <span className="cmd">
                <code>{c("tg skill install")}</code>
                <button className="copy" type="button" data-copy="tg skill install">
                  {t("Copy")}
                </button>
              </span>
            </div>
            <div className="lane">
              <h3>Claude Desktop · Cursor</h3>
              <p>{t("Prints the MCP entry for your settings. Ready prompts come with it:")}</p>
              <div className="slashes">
                <span className="slash">/catch-up</span>
                <span className="slash">/review</span>
                <span className="slash">/reply</span>
                <span className="slash">/find</span>
              </div>
              <span className="cmd">
                <code>{c("tg mcp config")}</code>
                <button className="copy" type="button" data-copy="tg mcp config">
                  {t("Copy")}
                </button>
              </span>
            </div>
            <div className="lane">
              <h3>{t("Any model")}</h3>
              <p>{t("Every docs page as plain Markdown, in one list.")}</p>
              <span className="cmd">
                <code>{c("wirecat.dev/llms.txt")}</code>
                <button className="copy" type="button" data-copy="https://wirecat.dev/llms.txt">
                  {t("Copy")}
                </button>
              </span>
            </div>
          </div>
          <p className="limits">
            {t("Reading marks nothing read. You choose which chats it may write to and how often it sends.")}
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="big">{t("Telegram and MAX, the same commands")}</h2>
          <p className="intro">{t("Learn one and you know the other.")}</p>
          <div className="tools">
            <article className="tool-card tool-tg">
              <svg className="tool-art" viewBox="0 0 120 120" aria-hidden="true">
                <path d="M10 58l96-40-26 86-22-30z" />
                <path d="M58 74l48-56" />
              </svg>
              <div className="tool-name">
                tg<small>Telegram</small>
              </div>
              <div className="tool-tags">
                <span>inbox</span>
                <span>review</span>
                <span>search</span>
                <span>transcribe</span>
                <span>watch</span>
              </div>
              <p>{t("A Telegram client for the terminal and for AI agents, on your own account.")}</p>
              <span className="cmd">
                <code>{c("npm i -g @leemour/tg-cli")}</code>
                <button className="copy" type="button" data-copy="npm i -g @leemour/tg-cli">
                  {t("Copy")}
                </button>
              </span>
              <div className="tool-links">
                <a href={`/${lang}/docs/tg`}>{t("Docs")}</a>
                <a href="https://github.com/leemour/tg-cli">GitHub</a>
                <a href="https://www.npmjs.com/package/@leemour/tg-cli">npm</a>
              </div>
            </article>
            <article className="tool-card tool-max">
              <svg className="tool-art" viewBox="0 0 120 120" aria-hidden="true">
                <path d="M24 18h72a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14H58l-24 20V86H24a14 14 0 0 1-14-14V32a14 14 0 0 1 14-14z" />
                <path d="M34 44h52M34 60h34" />
              </svg>
              <div className="tool-name">
                max<small>{t("MAX Messenger")}</small>
              </div>
              <div className="tool-tags">
                <span>bot</span>
                <span>chats check</span>
                <span>inbox</span>
                <span>mcp</span>
                <span>review</span>
              </div>
              <p>{t("Your MAX bots through the official Bot API, and your personal account.")}</p>
              <span className="cmd">
                <code>{c("npm i -g @leemour/max-cli")}</code>
                <button className="copy" type="button" data-copy="npm i -g @leemour/max-cli">
                  {t("Copy")}
                </button>
              </span>
              <div className="tool-links">
                <a href={`/${lang}/docs/max`}>{t("Docs")}</a>
                <a href="https://github.com/leemour/max-cli">GitHub</a>
                <a href="https://www.npmjs.com/package/@leemour/max-cli">npm</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Features lang={lang} t={t} c={c} />

      <section className="band" id="why">
        <div className="wrap">
          <h2 className="big">{t("Why it works this well")}</h2>
          <p className="intro">
            {t("Built for agents and scripts first, so it is quick, predictable and leaves a trail.")}
          </p>
          <dl className="spec">
            <div>
              <dt>{t("Fast")}</dt>
              <dd>{t("Search runs on the copy of your chats on your computer. No network, no waiting.")}</dd>
              <code>{c('tg search messages "contract" --offline')}</code>
            </div>
            <div>
              <dt>{t("Always current")}</dt>
              <dd>{t("A background service keeps that copy up to date, and catches up after a restart.")}</dd>
              <code>{c("tg server install")}</code>
            </div>
            <div>
              <dt>{t("Many accounts, many bots")}</dt>
              <dd>{t("Each profile and each bot has a name, and the name is the first word of the command.")}</dd>
              <code>{c("tg work inbox")}</code>
            </div>
            <div>
              <dt>{t("Reads without a trace")}</dt>
              <dd>{t("Reading marks nothing read. The other side sees nothing until you choose.")}</dd>
              <code>{c("tg chats mark-read")}</code>
            </div>
            <div>
              <dt>{t("Never sends twice")}</dt>
              <dd>
                {t("If the connection drops mid-send, repeat the command. Telegram recognises it and drops the copy.")}
              </dd>
              <code>{c("--send-id")}</code>
            </div>
            <div>
              <dt>{t("Logs, not your messages")}</dt>
              <dd>
                {t("Every send goes into a journal and every call can be traced, without text, names or numbers.")}
              </dd>
              <code>{c("tg sends list · --trace")}</code>
            </div>
            <div>
              <dt>{t("Secrets stay in the keyring")}</dt>
              <dd>{t("No password, login code, phone number or token is ever typed on the command line.")}</dd>
              <code>{c("tg session start")}</code>
            </div>
            <div>
              <dt>{t("Made for agents")}</dt>
              <dd>{t("One JSON value on stdout, errors on stderr, a fixed exit code for every kind of failure.")}</dd>
              <code>{c("--json")}</code>
            </div>
            <div>
              <dt>{t("Runs everywhere")}</dt>
              <dd>{t("Windows, macOS and Linux, on Node 22 or newer. No native module to build.")}</dd>
              <code>{c("npm i -g @leemour/tg-cli")}</code>
            </div>
          </dl>
        </div>
      </section>

      <section className="close">
        <div className="wrap">
          <h2 className="big">{t("Give your agent your inbox tonight")}</h2>
          <div className="cta">
            <span className="cmd">
              <code>{c("npm i -g @leemour/tg-cli && tg session start && tg skill install")}</code>
              <button
                className="copy"
                type="button"
                data-copy="npm i -g @leemour/tg-cli && tg session start && tg skill install"
              >
                {t("Copy")}
              </button>
            </span>
          </div>
        </div>
      </section>

      <footer className="site">
        <div className="wrap">
          <div className="foot">
            <div className="foot-brand" id="about">
              <a className="mark" href={`/${lang}`}>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <circle className="ring" cx="16" cy="16" r="16" />
                  <circle cx="16" cy="16" r="16" fill="#4b53f0" />
                  <path
                    className="wire"
                    pathLength="40"
                    d="M9 21V11l4 4 3-4 3 4 4-4v10"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path className="pulse" pathLength="40" d="M9 21V11l4 4 3-4 3 4 4-4v10" />
                </svg>
                <span className="word">
                  Wir<span className="word-tail">eCat</span>
                </span>
              </a>
              <p>
                {t(
                  "AI messaging with CLI tools for agents. Your Telegram and MAX, for you, your scripts and your AI agents.",
                )}
              </p>
              <span className="cmd">
                <code>{c("npm i -g @leemour/tg-cli")}</code>
                <button className="copy" type="button" data-copy="npm i -g @leemour/tg-cli">
                  {t("Copy")}
                </button>
              </span>
            </div>
            <div>
              <h4>{t("Tools")}</h4>
              <ul>
                <li>
                  <a href={`/${lang}/docs/tg`}>tg · Telegram</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/max`}>max · MAX</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/changelog`}>{t("tg changelog")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/max/changelog`}>{t("max changelog")}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t("Docs")}</h4>
              <ul>
                <li>
                  <a href={`/${lang}/docs/tg/installation`}>{t("Installation")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/usage`}>{t("Usage")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/commands`}>{t("All commands")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/troubleshooting`}>{t("Troubleshooting")}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t("For agents")}</h4>
              <ul>
                <li>
                  <a href={`/${lang}/docs/tg/mcp`}>{t("MCP server")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/recipes`}>{t("Recipes")}</a>
                </li>
                <li>
                  <a href="https://wirecat.dev/llms.txt">
                    <code>{c("/llms.txt")}</code>
                  </a>
                </li>
                <li>
                  <a href="https://wirecat.dev/llms-full.txt">
                    <code>{c("/llms-full.txt")}</code>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t("Project")}</h4>
              <ul>
                <li>
                  <a href="https://github.com/leemour/tg-cli">{t("tg on GitHub")}</a>
                </li>
                <li>
                  <a href="https://github.com/leemour/max-cli">{t("max on GitHub")}</a>
                </li>
                <li>
                  <a href="https://github.com/leemour/tg-cli/issues">{t("Report a problem")}</a>
                </li>
                <li>
                  <a href={`/${lang}/docs/tg/security`}>{t("Security")}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>{t("© 2026 WireCat · MIT licence · Windows, macOS, Linux")}</span>
            <nav className="langs" aria-label="Language">
              {languages.map(([code, name]) => (
                <a key={code} href={`/${code}`} aria-current={code === lang ? "page" : undefined}>
                  {name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
      <LandingEffects copied={t("Copied")} copy={t("Copy")} />
    </div>
  )
}

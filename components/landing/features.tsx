const icons = {
  personal: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" />
    </>
  ),
  bots: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5" />
    </>
  ),
  groups: (
    <>
      <circle cx="9" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M3.5 19c.9-3.2 3-4.8 5.5-4.8s4.6 1.6 5.5 4.8M14.5 15c2.6-.4 4.6.9 5.5 3.6" />
    </>
  ),
}

const groups = [
  {
    key: "personal",
    name: "Personal account",
    short: "Your chats, history and contacts",
    lead: "Your own account, as one more of your devices: every chat, its history, groups, channels and contacts.",
    more: ["How to use your account →", "tg/usage"],
    items: [
      ["Unread in every chat at once.", "Other people's messages, and nothing gets marked read.", "tg inbox"],
      ["Who owes what.", "Everything said since the last review, yours too, in one call.", "tg review --since-time 7d"],
      [
        "Search years of history offline.",
        "In the copy of your chats kept on your computer.",
        'tg search messages "contract"',
      ],
      [
        "Voice notes as text.",
        "By Telegram, or by a speech model on your machine.",
        'tg messages transcribe "Mum" 8812 --local',
      ],
      [
        "Send later.",
        "Telegram delivers it on time, with your laptop shut.",
        'tg messages send me "Call Mum" --at-time 2h',
      ],
      [
        "Everything else you do by hand.",
        "Replies, files, reactions, polls, edits, forwards, pins.",
        'tg messages send "Book club" "The minutes" --file minutes.pdf',
      ],
    ],
  },
  {
    key: "bots",
    name: "Bots",
    short: "Official Bot API, many bots",
    lead: "Your bots, through the official Bot API of Telegram and MAX. Keep as many as you like, each under a name you choose.",
    more: ["How to set up a bot →", "tg/bot"],
    items: [
      ["The bot's name is the first word.", "Keep several, each under a name you choose.", "tg bot list --check"],
      ["Tokens in the system keyring.", "Never printed, not even in an error.", "tg sales bot auth set"],
      [
        "Each bot has its own list of chats.",
        "It writes only there, and keeps a journal of what it sent.",
        "tg sales bot recipients add user:<id>",
      ],
      [
        "Messages and files.",
        "Send, edit, delete and pin, to a chat or to a person.",
        'tg sales bot messages send "Team" "Build is ready" --file report.pdf',
      ],
      [
        "On MAX, the whole Bot API.",
        "Members, admins, buttons, the command menu, webhooks and moderation.",
        "max sales bot api get-updates --limit 10",
      ],
      ["A bot for your agent.", "An MCP server of its own, read-only by default.", "max sales bot mcp"],
    ],
  },
  {
    key: "groups",
    name: "Groups you run",
    short: "Members, questions, moderation",
    lead: "For the groups and channels you run: who is waiting, who came and went, and what breaks your rules.",
    more: ["How to run a group →", "tg/groups"],
    items: [
      ["Questions nobody answered.", "Asked at least a day ago, still open.", 'tg review --chat "Hiking" --unanswered'],
      ["Who joined, left, was added or removed.", "And by whom.", 'tg chats events "Hiking" --since-time 7d'],
      [
        "Everyone in the group.",
        "With their role and when they were last seen.",
        'tg chats members list "Hiking" --all',
      ],
      [
        "Forum topics and invite links.",
        "See where a link leads without joining.",
        "tg chats inspect https://t.me/+AbCdEf",
      ],
      [
        "Manage it.",
        "Rename, add and remove members and admins, reset the invite link.",
        'tg chats create "Hiking 2027" @sofia',
      ],
      [
        "Moderation by your rules.",
        "Links, forwards and flood, applied when you run them.",
        'max chats check "Residents"',
      ],
    ],
  },
] as const

export function Features({ lang, t, c }: { lang: string; t: (text: string) => string; c: (text: string) => string }) {
  return (
    <section id="features" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="big">{t("One tool for every side of your messenger")}</h2>
        <p className="intro">
          {t("Your own account, your bots and the groups you run. The same commands in Telegram and MAX.")}
        </p>
        <div className="fv6">
          {groups.map((group) => (
            <div className="grp6" key={group.key}>
              <div className="head6">
                <span className="fv-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icons[group.key]}
                  </svg>
                </span>
                <h3 className="fv-name">{t(group.name)}</h3>
                <span className="fv-short">{t(group.short)}</span>
              </div>
              <p className="fv-lead">{t(group.lead)}</p>
              <div className="g6">
                {group.items.map(([title, text, command]) => (
                  <div className="t6" key={title}>
                    <b>{t(title)}</b>
                    <span>{t(text)}</span>
                    <code>{c(command)}</code>
                  </div>
                ))}
              </div>
              <a className="more" href={`/${lang}/docs/${group.more[1]}`}>
                {t(group.more[0])}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

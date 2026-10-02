"""Writes six layouts of the features block into g-home.html. Run: python3 design/landing/features.py"""

import html
import pathlib
import re

page = pathlib.Path(__file__).resolve().parent / "g-home.html"

ICON = {
    "personal": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6"/></svg>',
    "bots": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/></svg>',
    "groups": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.9-3.2 3-4.8 5.5-4.8s4.6 1.6 5.5 4.8M14.5 15c2.6-.4 4.6.9 5.5 3.6"/></svg>',
}

GROUPS = [
    {
        "key": "personal", "name": "Personal account", "short": "Your chats, history and contacts",
        "lead": "Your own account, as one more of your devices: every chat, its history, groups, channels and contacts.",
        "more": ("How to use your account →", "usage"), "file": "account.sh",
        "items": [
            ("Unread in every chat at once.", "Other people's messages, and nothing gets marked read.", "tg inbox"),
            ("Who owes what.", "Everything said since the last review, yours too, in one call.", "tg review --since-time 7d"),
            ("Search years of history offline.", "In the copy of your chats kept on your computer.", 'tg messages search "contract"'),
            ("Voice notes as text.", "By Telegram, or by a speech model on your machine.", 'tg messages transcribe "Mum" 8812 --local'),
            ("Send later.", "Telegram delivers it on time, with your laptop shut.", 'tg messages send me "Call Mum" --at-time 2h'),
            ("Everything else you do by hand.", "Replies, files, reactions, polls, edits, forwards, pins.", 'tg messages send "Book club" "The minutes" --file minutes.pdf'),
        ],
    },
    {
        "key": "bots", "name": "Bots", "short": "Official Bot API, many bots",
        "lead": "Your bots, through the official Bot API of Telegram and MAX. Keep as many as you like, each under a name you choose.",
        "more": ("How to set up a bot →", "bot"), "file": "bots.sh",
        "items": [
            ("The bot's name is the first word.", "Keep several, each under a name you choose.", "tg bot list --check"),
            ("Tokens in the system keyring.", "Never printed, not even in an error.", "tg sales bot auth set"),
            ("Each bot has its own list of chats.", "It writes only there, and keeps a journal of what it sent.", "tg sales bot recipients add user:<id>"),
            ("Messages and files.", "Send, edit, delete and pin, to a chat or to a person.", 'tg sales bot messages send "Team" "Build is ready" --file report.pdf'),
            ("On MAX, the whole Bot API.", "Members, admins, buttons, the command menu, webhooks and moderation.", "max sales bot api get-updates --limit 10"),
            ("A bot for your agent.", "An MCP server of its own, read-only by default.", "max sales bot mcp"),
        ],
    },
    {
        "key": "groups", "name": "Groups you run", "short": "Members, questions, moderation",
        "lead": "For the groups and channels you run: who is waiting, who came and went, and what breaks your rules.",
        "more": ("How to run a group →", "groups"), "file": "groups.sh",
        "items": [
            ("Questions nobody answered.", "Asked at least a day ago, still open.", 'tg review --chat "Hiking" --unanswered'),
            ("Who joined, left, was added or removed.", "And by whom.", 'tg chats events "Hiking" --since-time 7d'),
            ("Everyone in the group.", "With their role and when they were last seen.", 'tg chats members list "Hiking" --all'),
            ("Forum topics and invite links.", "See where a link leads without joining.", "tg chats inspect https://t.me/+AbCdEf"),
            ("Manage it.", "Rename, add and remove members and admins, reset the invite link.", 'tg chats create "Hiking 2027" @sofia'),
            ("Moderation by your rules.", "Links, forwards and flood, applied when you run them.", 'max chats check "Residents"'),
        ],
    },
]

e = html.escape


def cmd(text):
    return f"<code>{e(text, quote=False)}</code>"


def more(g):
    label, slug = g["more"]
    return f'<a class="more" href="https://wirecat.dev/en/docs/tg/{slug}">{label}</a>'


def tabs(v, cls):
    out = [f'<div class="{cls}" role="tablist">']
    for i, g in enumerate(GROUPS):
        out.append(
            f'<button class="fv-tab" role="tab" type="button" data-v="{v}" data-group="{g["key"]}" aria-selected="{str(i == 0).lower()}">'
            f'<span class="fv-ico">{ICON[g["key"]]}</span><span class="fv-name">{g["name"]}</span><span class="fv-short">{g["short"]}</span></button>'
        )
    out.append("</div>")
    return "".join(out)


def panel(v, g, i, body):
    hidden = "" if i == 0 else " hidden"
    return f'<div class="fv-panel" data-v="{v}" data-group="{g["key"]}"{hidden}>{body}</div>'


def v1():
    panels = []
    for i, g in enumerate(GROUPS):
        tiles = "".join(f'<div class="t1"><h4>{t}</h4><p>{d}</p>{cmd(c)}</div>' for t, d, c in g["items"])
        panels.append(panel(1, g, i, f'<p class="fv-lead">{g["lead"]}</p><div class="g1">{tiles}</div>{more(g)}'))
    return tabs(1, "tabs1") + "".join(panels)


def v2():
    cols = []
    for g in GROUPS:
        items = "".join(f'<li><b>{t}</b><span>{d}</span>{cmd(c)}</li>' for t, d, c in g["items"])
        cols.append(f'<div class="c2"><div class="c2-head"><span class="fv-ico">{ICON[g["key"]]}</span><h4>{g["name"]}</h4><p>{g["short"]}</p></div><ul>{items}</ul>{more(g)}</div>')
    return f'<div class="g2">{"".join(cols)}</div>'


def v3():
    panels = []
    for i, g in enumerate(GROUPS):
        rows = "".join(f'<div class="r3"><b>{t}</b><span>{d}</span>{cmd(c)}</div>' for t, d, c in g["items"])
        panels.append(panel(3, g, i, f'<p class="fv-lead">{g["lead"]}</p>{rows}{more(g)}'))
    return f'<div class="g3">{tabs(3, "tabs3")}<div>{"".join(panels)}</div></div>'


def v4():
    panels = []
    for i, g in enumerate(GROUPS):
        items = "".join(f'<li data-i="{n}"><b>{t}</b> {d}</li>' for n, (t, d, c) in enumerate(g["items"]))
        lines = "".join(f'<div class="l4" data-i="{n}"><span class="p">$</span> {e(c, quote=False)}</div>' for n, (t, d, c) in enumerate(g["items"]))
        panels.append(panel(4, g, i, f'<div class="g4"><div><p class="fv-lead">{g["lead"]}</p><ol>{items}</ol>{more(g)}</div><pre class="term4"><code>{lines}</code></pre></div>'))
    return tabs(4, "tabs4") + "".join(panels)


def v5():
    head = ['<div class="term5"><div class="bar5" role="tablist">']
    for i, g in enumerate(GROUPS):
        head.append(f'<button class="fv-tab" role="tab" type="button" data-v="5" data-group="{g["key"]}" aria-selected="{str(i == 0).lower()}"><span class="fv-ico">{ICON[g["key"]]}</span>{g["file"]}</button>')
    head.append("</div>")
    panels = []
    for i, g in enumerate(GROUPS):
        lines = "".join(f'<div class="l5"><span class="c"># <b>{t}</b> {d}</span><span><span class="p">$</span> {e(c, quote=False)}</span></div>' for t, d, c in g["items"])
        panels.append(panel(5, g, i, f'<pre><code>{lines}</code></pre>'))
    return "".join(head) + "".join(panels) + "</div>"


def v6():
    out = []
    for g in GROUPS:
        tiles = "".join(f'<div class="t6"><b>{t}</b><span>{d}</span>{cmd(c)}</div>' for t, d, c in g["items"])
        out.append(f'<div class="grp6"><div class="head6"><span class="fv-ico">{ICON[g["key"]]}</span><span class="fv-name">{g["name"]}</span><span class="fv-short">{g["short"]}</span></div><p class="fv-lead">{g["lead"]}</p><div class="g6">{tiles}</div>{more(g)}</div>')
    return "".join(out)


variants = [v1(), v2(), v3(), v4(), v5(), v6()]
block = (
    '<section id="features" style="padding-top:0">\n  <div class="wrap">\n'
    '    <h2 class="big" id="feat-title">One tool for every side of your messenger</h2>\n'
    '    <p class="intro">Your own account, your bots and the groups you run. The same commands in Telegram and MAX.</p>\n'
    + "".join(f'    <div class="fv fv{n}" data-variant="{n}"{"" if n == 6 else " hidden"}>{body}</div>\n' for n, body in enumerate(variants, 1))
    + "  </div>\n</section>\n"
)

src = page.read_text()
src = re.sub(r'<section id="features".*?</section>\n', lambda _: block, src, count=1, flags=re.S)
page.write_text(src)
print("features: 6 layouts written")

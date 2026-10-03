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

GROUPS = [{'key': 'personal',
  'name': 'Personal account',
  'short': 'Your chats, history and contacts',
  'lead': 'Connect your own account, just like adding another device. Access your chats, history, groups, channels and contacts.',
  'more': ('How to use your account →', 'usage'),
  'file': 'account.sh',
  'items': [('Unread messages in one place.',
             "See incoming messages without marking them as read.",
             'tg inbox'),
            ('Keep track of agreements.',
             'Review what you and others have promised since your last check-in.',
             'tg review --since-time 7d'),
            ('Find it, even with a typo.',
             'Search your local chat archive by full words, partial words or approximate spelling.',
             'tg messages search "contract"'),
            ('News from your subscriptions.',
             'Ask your agent for a digest of the channels you follow, on the topics you choose, with links to the '
             'posts.',
             'tg review --chat "Tech news" --since-time 1d'),
            ('Voice notes as text.',
             'Transcribe with Telegram or a speech model running on your computer.',
             'tg messages transcribe "Mum" 8812 --local'),
            ('Send later.',
             'Telegram delivers your message on schedule, even when your laptop is closed.',
             'tg messages send me "Call Mum" --at-time 2h')]},
 {'key': 'bots',
  'name': 'Bots',
  'short': 'Customers, teams and announcements',
  'lead': 'Use Telegram and MAX bots to reach customers and teams: announcements, helpful replies and simple actions.',
  'more': ('How to set up a bot →', 'bot'),
  'file': 'bots.sh',
  'items': [('Group broadcasts.',
             'Ask your agent to send an announcement to the groups and channels you choose.',
             'max sales bot chats list'),
            ('Personalised messages.',
             'Let your agent tailor each message using the customer details you provide.',
             'max sales bot messages send user:4815162342 "Anna, your order is ready"'),
            ('Replies with context.',
             'Give your agent a knowledge base or conversation history to help it answer customer questions.',
             'max support bot messages list "Support" --limit 20'),
            ('Team notifications.',
             'Keep people informed about requests, results and changes, with the files they need.',
             'max sales bot messages send "Team" "Build is ready" --file report.pdf'),
            ('Buttons and clear choices.',
             'Help people choose an action, open a link or respond with a tap.',
             'max sales bot commands set start=Start help=Help'),
            ('Control what gets sent.',
             'Choose who the bot may contact and check which sends succeeded or need attention.',
             'max sales bot sends list')],
  'more_tool': 'max'},
 {'key': 'groups',
  'name': 'Groups you run',
  'short': 'Questions, discussions and community health',
  'lead': 'Keep your community useful: unanswered questions, clear decisions and conversations that follow your '
          'rules.',
  'more': ('How to run a group →', 'groups'),
  'file': 'groups.sh',
  'items': [('Question monitoring.',
             'Find questions left without an answer so members get the help they came for.',
             'tg review --chat "Hiking" --unanswered'),
            ('Group activity.',
             'Who joined, left, was added or removed, and who did it.',
             'tg chats events "Hiking" --since-time 7d'),
            ('Keep discussions on track.',
             'Ask your agent to flag spam, insults and conflicts so you can step in early.',
             'tg review --chat "Hiking" --since-time 1d'),
            ('Moderation by your rules.',
             'Choose which violations to flag, which messages to delete and when to remove a participant.',
             'max chats check "Residents"'),
            ('Discussion summaries.',
             'Get the decisions, open questions and next steps without rereading the whole conversation.',
             'tg review --chat "Hiking" --since-time 7d'),
            ('Group management.',
             'Delegate routine invitations, admin changes and invite-link updates to your agent.',
             'tg chats create "Hiking 2027" @sofia')]}]

e = html.escape


def cmd(text):
    return f"<code>{e(text, quote=False)}</code>"


def more(g):
    label, slug = g["more"]
    return f'<a class="more" href="https://wirecat.dev/en/docs/{g.get("more_tool", "tg")}/{slug}">{label}</a>'


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
        tiles = "".join(f'<div class="t6"><b>{t}</b><span>{d}</span></div>' for t, d, c in g["items"])
        out.append(f'<div class="grp6"><div class="head6"><span class="fv-ico">{ICON[g["key"]]}</span><span class="fv-name">{g["name"]}</span><span class="fv-short">{g["short"]}</span></div><p class="fv-lead">{g["lead"]}</p><div class="g6">{tiles}</div>{more(g)}</div>')
    return "".join(out)


variants = [v1(), v2(), v3(), v4(), v5(), v6()]
block = (
    '<section id="features" style="padding-top:0">\n  <div class="wrap">\n'
    '    <h2 class="big" id="feat-title">Less busywork in your chats</h2>\n'
    '    <p class="intro">Keep track of agreements, help customers and keep your groups useful. Ask your agent to work through Telegram and MAX.</p>\n'
    + "".join(f'    <div class="fv fv{n}" data-variant="{n}"{"" if n == 6 else " hidden"}>{body}</div>\n' for n, body in enumerate(variants, 1))
    + "  </div>\n</section>\n"
)

src = page.read_text()
src = re.sub(r'<section id="features".*?</section>\n', lambda _: block, src, count=1, flags=re.S)
page.write_text(src)
print("features: 6 layouts written")

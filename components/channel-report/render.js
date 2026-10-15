export function renderReport(root, Chart, DATA) {
  const $ = (id) => root.querySelector(`#${id}`)
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim()
  const fmt = (n) =>
    n == null
      ? "—"
      : n >= 1e6
        ? `${(n / 1e6).toFixed(1)}M`
        : n >= 1e4
          ? `${Math.round(n / 1e3)}k`
          : n.toLocaleString("en-US")
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
  // Single-quoted href: the cli-docs link checker reads double-quoted hrefs in the page source as local links.
  const anchor = (url, text) => `<a href='${esc(url)}' target="_blank" rel="noopener">${text}</a>`
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const o = DATA.overview
  const tiles = (list) => list.map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join("")
  const table = (head, rows) =>
    `<tr>${head.map(([h, n]) => `<th${n ? ' class="n"' : ""}>${h}</th>`).join("")}</tr>` +
    rows.map((r) => `<tr>${r.map((c, i) => `<td${head[i][1] ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")
  const pct = (v) => (v == null ? "—" : `${v}%`)

  $("about").textContent = `${DATA.about.split("\n")[0]} This report reads every post from ${o.first} to ${o.last}.`
  const pf = DATA.profile
  const link = (s) =>
    s.startsWith("@")
      ? `<a href="https://t.me/${s.slice(1)}" target="_blank" rel="noopener">${esc(s)}</a>`
      : anchor(s, esc(s.replace(/^https?:\/\//, "")))
  $("profile").innerHTML = [
    ["Created", pf.created ? `${pf.created}, ${pf.years} years ago` : null],
    [
      "Earliest post",
      pf.created && pf.firstPost.date.slice(0, 4) !== pf.created.slice(0, 4)
        ? `${anchor(pf.firstPost.link, pf.firstPost.date)}; nothing older survives`
        : anchor(pf.firstPost.link, pf.firstPost.date),
    ],
    ["Longest silence", `${pf.pauseDays} days, until ${pf.pauseEnded}`],
    ["Live voice chats", pf.calls ? `${pf.calls}, the last on ${pf.lastCall}` : null],
    ["Links", pf.links.length ? pf.links.map(link).join(" · ") : null],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join("")
  $("kpis").innerHTML = tiles([
    [fmt(o.subs), "subscribers today"],
    [fmt(o.posts), "posts analysed"],
    [o.perWeek, "posts a week, last 90 days"],
    [fmt(o.recentMedViews), "median views, last 90 days"],
    [pct(o.recentReach), "of subscribers see a typical post"],
    [pct(o.recentER), "median engagement, last 90 days"],
    [fmt(o.totalFwd), "forwards, all time"],
    [fmt(o.totalCom), "comments, all time"],
  ])

  $("tYearly").innerHTML = table(
    [
      ["Year"],
      ["Posts", 1],
      ["Median views", 1],
      ["Median ER", 1],
      ["Forwards", 1],
      ["Comments", 1],
      ["Polls", 1],
      ["Avg length", 1],
      ["Negative", 1],
    ],
    DATA.yearly.map((y) => [
      y.y,
      y.n,
      fmt(y.views),
      pct(y.er),
      fmt(y.fwd),
      fmt(y.com),
      y.polls,
      fmt(y.avgLen),
      pct(y.neg),
    ]),
  )

  const heatMax = DATA.heat.flat().reduce((a, b) => Math.max(a, b), 0)
  $("heat").innerHTML =
    `<div class="lbl"></div>` +
    Array.from({ length: 24 }, (_, h) => `<div>${h % 3 === 0 ? h : ""}</div>`).join("") +
    DATA.heat
      .map(
        (row, d) =>
          `<div class="lbl">${DAYS[d]}</div>` +
          row
            .map(
              (n, h) =>
                `<div class="c" style="opacity:${n ? 0.08 + (0.92 * n) / heatMax : 0.03}" title="${DAYS[d]} ${h}:00 UTC: ${n} posts"></div>`,
            )
            .join(""),
      )
      .join("")

  $("tThemes").innerHTML = table(
    [
      ["Theme"],
      ["Posts", 1],
      ["Avg lift", 1],
      ["Hit rate", 1],
      ["Median ER", 1],
      ["Forwards / 1k views", 1],
      ["Comments / 1k views", 1],
      ["Forwards per reaction", 1],
    ],
    DATA.themes
      .filter((t) => t.n >= 3)
      .sort((a, b) => b.hit - a.hit)
      .map((t) => [t.name, t.n, t.lift, pct(t.hit), pct(t.er), t.fwdPer1k, t.comPer1k, t.fwdPerReact]),
  )
  $("tOpeners").innerHTML = table(
    [["Opening"], ["Posts", 1], ["Avg lift", 1], ["Hit rate", 1], ["Forwards / 1k", 1], ["Comments / 1k", 1]],
    DATA.openers
      .filter((t) => t.n)
      .map((t) => [t.name, t.n, t.lift ?? "—", pct(t.hit), t.fwdPer1k ?? "—", t.comPer1k ?? "—"]),
  )

  const pr = DATA.promo
  $("promo").textContent = pr.n
    ? `${pr.n} posts carry an ad mark, a promo code or a referral link. Their average lift is ${pr.lift} against 1.0 for a normal post. Telegram's own sponsored messages are not part of a channel's history, so they cannot be counted.`
    : "No post carries an ad mark, a promo code or a referral link. Telegram's own sponsored messages are not part of a channel's history, so they cannot be counted."
  const linkRow = (r) => `<span class="pill">${r.kind}</span> ${anchor(r.link, esc(r.text))}`
  $("tPromo").innerHTML = pr.n
    ? table(
        [["Date", 1], ["Post"], ["Views", 1], ["Lift", 1], ["Forwards", 1]],
        pr.rows.map((r) => [r.date, linkRow(r), fmt(r.views), `${r.lift}×`, fmt(r.fwd)]),
      )
    : ""

  const TABS = {
    topLift: [
      "Beat their period",
      "Views ÷ the median of the 40 nearest posts: posts that reached beyond the usual audience. The last 14 days are left out.",
    ],
    topViews: ["Most viewed", "Raw views."],
    topFwd: ["Most forwarded", "Forwards: readers found the post useful enough to pass on."],
    topCom: ["Most discussed", "Comments in the linked discussion group."],
    controversial: ["Most divisive", "Share of 💩 👎 🤬 🤡 🤮 😡 among reactions, posts with 30+ reactions."],
    flops: ["Underperformed", "Lowest lift in the last two years, the last 14 days left out."],
  }
  const tabs = $("tabs")
  const showTab = (key) => {
    tabs.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-selected", b.dataset.k === key)
    })
    const neg = key === "controversial"
    $("tTop").innerHTML = table(
      [
        ["Date", 1],
        ["Post"],
        ["Views", 1],
        ["Lift", 1],
        ["Reactions", 1],
        ["Forwards", 1],
        ["Comments", 1],
        ...(neg ? [["Negative", 1]] : []),
      ],
      DATA[key].map((r) => [
        r.date,
        linkRow(r),
        fmt(r.views),
        `<span class="${r.lift >= 1.5 ? "up" : r.lift < 0.8 ? "down" : ""}">${r.lift}×</span>`,
        fmt(r.react),
        fmt(r.fwd),
        fmt(r.com),
        ...(neg ? [`<span class="down">${r.neg}%</span>`] : []),
      ]),
    )
    $("tabCap").textContent = TABS[key][1]
  }
  tabs.innerHTML = Object.entries(TABS)
    .map(([k, [l]]) => `<button role="tab" data-k="${k}">${l}</button>`)
    .join("")
  const onTab = (e) => e.target.dataset.k && showTab(e.target.dataset.k)
  tabs.addEventListener("click", onTab)
  showTab("topLift")

  const c = DATA.community
  if (c) {
    $("communityKpis").innerHTML = tiles([
      [fmt(c.comments), `comments under ${c.posts} posts`],
      [fmt(c.people), "different people commented"],
      [pct(c.onceShare), "of them commented only once"],
      [pct(c.top10Share), "of comments come from the top 10% of commenters"],
      [fmt(c.returning), "came back under 3+ posts"],
      [`${c.authorComments}`, `author replies, under ${c.authorPosts} posts`],
      [c.firstMinutes == null ? "—" : `${c.firstMinutes} min`, "median wait for the first comment"],
      [pct(c.replyShare), "of comments answer another comment"],
    ])
    $("communityCap").textContent =
      "Bars: commenters by how many comments each wrote in the period. Readers are counted, never named."
  } else {
    $("communityFig").hidden = true
  }

  const p = DATA.polls
  $("polls").innerHTML = p.top
    .map((q) => {
      const max = q.answers.reduce((m, a) => Math.max(m, a[1]), 1)
      const answers = q.answers.length
        ? q.answers
            .map(
              ([t, n]) =>
                `<div class="bar"><div>${esc(t)}<i style="width:${(n / max) * 100}%"></i></div><span class="n">${fmt(n)}</span></div>`,
            )
            .join("")
        : `<div class="muted">Answer counts hidden until this account votes.</div>`
      return `<div class="poll"><div>${anchor(q.link, esc(q.text))} <span class="muted">· ${q.date} · ${fmt(q.voters)} votes · ${q.rate}% of viewers voted</span></div>${answers}</div>`
    })
    .join("")

  $("domains").innerHTML = DATA.domains.map(([d, n]) => `<span>${esc(d)}<b>${n}</b></span>`).join("")
  $("handles").innerHTML = DATA.handles.map(([h, n]) => `<span>@${esc(h)}<b>${n}</b></span>`).join("")

  const charts = []
  const draw = () => {
    for (const ch of charts) ch.destroy()
    charts.length = 0
    const ink = css("--ink"),
      muted = css("--muted"),
      line = css("--line"),
      acc = css("--accent"),
      warm = css("--warm"),
      good = css("--good")
    Chart.defaults.color = muted
    Chart.defaults.borderColor = line
    Chart.defaults.font.family = css("--body")
    Chart.defaults.font.size = 12
    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: ink, boxWidth: 12 } } },
    }
    const mk = (id, cfg) => charts.push(new Chart($(id), { ...cfg, options: { ...base, ...cfg.options } }))
    const liftHit = (id, rows, label) =>
      mk(id, {
        data: {
          labels: rows.map((r) => `${r[label]} (${r.n})`),
          datasets: [
            { type: "bar", label: "Avg lift", data: rows.map((r) => r.lift), backgroundColor: acc, yAxisID: "y" },
            {
              type: "line",
              label: "Hit rate %",
              data: rows.map((r) => r.hit),
              borderColor: warm,
              backgroundColor: warm,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          scales: { y: { min: 0.6 }, y1: { position: "right", beginAtZero: true, grid: { display: false } } },
        },
      })

    mk("cMonthly", {
      data: {
        labels: DATA.monthly.map((m) => m.m),
        datasets: [
          {
            type: "bar",
            label: "Posts",
            data: DATA.monthly.map((m) => m.n),
            backgroundColor: `${acc}55`,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Median views",
            data: DATA.monthly.map((m) => m.views),
            borderColor: warm,
            backgroundColor: warm,
            pointRadius: 0,
            tension: 0.3,
            spanGaps: true,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        scales: {
          x: { ticks: { maxTicksLimit: 12 } },
          y: { title: { display: true, text: "posts" } },
          y1: { position: "right", grid: { display: false }, title: { display: true, text: "views" } },
        },
      },
    })
    liftHit(
      "cGap",
      DATA.byGap.filter((r) => r.n),
      "b",
    )
    liftHit(
      "cLoad",
      DATA.byDayLoad.filter((r) => r.n),
      "b",
    )
    const days = DATA.byWeekday.map((d) => ({ ...d, b: DAYS[d.d] }))
    liftHit("cWeekday", days, "b")
    liftHit(
      "cHour",
      DATA.byHour.filter((h) => h.n >= 15).map((h) => ({ ...h, b: String(h.h) })),
      "b",
    )
    mk("cKind", {
      type: "bar",
      data: {
        labels: DATA.byKind.map((k) => `${k.k} (${k.n})`),
        datasets: [
          { label: "Reactions", data: DATA.byKind.map((k) => k.reactPer1k), backgroundColor: acc },
          { label: "Forwards", data: DATA.byKind.map((k) => k.fwdPer1k), backgroundColor: warm },
          { label: "Comments", data: DATA.byKind.map((k) => k.comPer1k), backgroundColor: good },
        ],
      },
    })
    const len = DATA.byLength.filter((b) => b.n >= 20)
    mk("cLen", {
      data: {
        labels: len.map((b) => `${b.b} (${b.n})`),
        datasets: [
          {
            type: "bar",
            label: "Forwards / 1k views",
            data: len.map((b) => b.fwdPer1k),
            backgroundColor: warm,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Hit rate %",
            data: len.map((b) => b.hit),
            borderColor: acc,
            backgroundColor: acc,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true }, y1: { position: "right", beginAtZero: true, grid: { display: false } } },
      },
    })
    const palette = [acc, warm, good, css("--bad"), muted, "#8e5bd6", "#2aa3b5", "#b5892a", "#d65b9e"]
    const yrs = Object.keys(DATA.themes[0].byYear)
    const perYear = Object.fromEntries(DATA.yearly.map((y) => [String(y.y), y.n]))
    const open = o.last.slice(0, 4)
    mk("cThemeYears", {
      type: "line",
      data: {
        labels: yrs.map((y) => (y === open ? `${y} (to ${o.last.slice(5)})` : y)),
        datasets: DATA.themes
          .filter((t) => t.n >= 3)
          .map((t, i) => ({
            label: t.name,
            data: yrs.map((y) => (perYear[y] ? Math.round((t.byYear[y] / perYear[y]) * 100) : null)),
            borderColor: palette[i % palette.length],
            backgroundColor: palette[i % palette.length],
            tension: 0.25,
          })),
      },
      options: { scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${v}%` } } } },
    })
    $("themeCap").textContent =
      "Share of the year's posts that touch each theme. A post can touch several, so a year adds up to more than 100%."
    if (c)
      mk("cCommenters", {
        type: "bar",
        data: {
          labels: ["1 comment", "2–3", "4–9", "10–29", "30+"],
          datasets: [{ label: "Commenters", data: c.distribution, backgroundColor: acc }],
        },
        options: { plugins: { legend: { display: false } } },
      })
    const py = p.byYear.filter((y) => y.n)
    mk("cPollRate", {
      data: {
        labels: py.map((y) => y.y),
        datasets: [
          { type: "bar", label: "Polls", data: py.map((y) => y.n), backgroundColor: `${acc}55`, yAxisID: "y" },
          {
            type: "line",
            label: "Median % of viewers voting",
            data: py.map((y) => y.rate),
            borderColor: warm,
            backgroundColor: warm,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true }, y1: { position: "right", beginAtZero: true, grid: { display: false } } },
      },
    })
    mk("cReact", {
      type: "bar",
      data: {
        labels: DATA.reactions.map((r) => r.e),
        datasets: [{ label: "Reactions", data: DATA.reactions.map((r) => r.n), backgroundColor: acc }],
      },
      options: { indexAxis: "y", plugins: { legend: { display: false } } },
    })
  }
  draw()
  const observer = new MutationObserver(draw)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => {
    observer.disconnect()
    tabs.removeEventListener("click", onTab)
    for (const ch of charts) ch.destroy()
  }
}

export function renderReport(root, Chart, DATA, T) {
  const $ = (id) => root.querySelector(`#${id}`)
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim()
  const compact = new Intl.NumberFormat(T.locale, { notation: "compact", maximumFractionDigits: 1 })
  const num = (n) => (n == null ? "—" : n.toLocaleString(T.locale))
  const fmt = (n) => (n == null ? "—" : n >= 1e4 ? compact.format(n) : num(n))
  const label = (s) => T.labels[s] ?? s
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
  // Single-quoted href: the cli-docs link checker reads double-quoted hrefs in the page source as local links.
  const anchor = (url, text) => `<a href='${esc(url)}' target="_blank" rel="noopener">${text}</a>`
  const DAYS = T.days
  const o = DATA.overview
  const tiles = (list) => list.map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join("")
  const table = (head, rows) =>
    `<tr>${head.map(([h, n]) => `<th${n ? ' class="n"' : ""}>${h}</th>`).join("")}</tr>` +
    rows.map((r) => `<tr>${r.map((c, i) => `<td${head[i][1] ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")
  const pct = (v) => (v == null ? "—" : `${num(v)}%`)
  const head = (labels, text = [0]) => labels.map((h, i) => [h, !text.includes(i)])

  $("about").textContent = DATA.about.split("\n")[0] + T.about(o.first, o.last)
  const pf = DATA.profile
  const link = (s) =>
    s.startsWith("@")
      ? `<a href="https://t.me/${s.slice(1)}" target="_blank" rel="noopener">${esc(s)}</a>`
      : anchor(s, esc(s.replace(/^https?:\/\//, "")))
  const P = T.profile
  $("profile").innerHTML = [
    [P.created, pf.created ? P.createdValue(pf.created, num(pf.years)) : null],
    [
      P.earliest,
      pf.created && pf.firstPost.date.slice(0, 4) !== pf.created.slice(0, 4)
        ? `${anchor(pf.firstPost.link, pf.firstPost.date)}${P.nothingOlder}`
        : anchor(pf.firstPost.link, pf.firstPost.date),
    ],
    [P.silence, P.silenceValue(num(pf.pauseDays), pf.pauseEnded)],
    [P.calls, pf.calls ? P.callsValue(num(pf.calls), pf.lastCall) : null],
    [P.links, pf.links.length ? pf.links.map(link).join(" · ") : null],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join("")
  $("kpis").innerHTML = tiles(
    [
      fmt(o.subs),
      fmt(o.posts),
      num(o.perWeek),
      fmt(o.recentMedViews),
      pct(o.recentReach),
      pct(o.recentER),
      fmt(o.totalFwd),
      fmt(o.totalCom),
    ].map((v, i) => [v, T.kpis[i]]),
  )

  $("tYearly").innerHTML = table(
    head(T.yearly),
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
                `<div class="c" style="opacity:${n ? 0.08 + (0.92 * n) / heatMax : 0.03}" title="${T.heatTitle(DAYS[d], h, n)}"></div>`,
            )
            .join(""),
      )
      .join("")

  $("tThemes").innerHTML = table(
    head(T.themeHead),
    DATA.themes
      .filter((t) => t.n >= 3)
      .sort((a, b) => b.hit - a.hit)
      .map((t) => [
        label(t.name),
        num(t.n),
        num(t.lift),
        pct(t.hit),
        pct(t.er),
        num(t.fwdPer1k),
        num(t.comPer1k),
        num(t.fwdPerReact),
      ]),
  )
  $("tOpeners").innerHTML = table(
    head(T.openerHead),
    DATA.openers
      .filter((t) => t.n)
      .map((t) => [label(t.name), num(t.n), num(t.lift), pct(t.hit), num(t.fwdPer1k), num(t.comPer1k)]),
  )

  const pr = DATA.promo
  $("promo").textContent = pr.n ? T.promo(num(pr.n), num(pr.lift)) : T.promoNone
  const linkRow = (r) => `<span class="pill">${label(r.kind)}</span> ${anchor(r.link, esc(r.text))}`
  $("tPromo").innerHTML = pr.n
    ? table(
        head(T.promoHead, [1]),
        pr.rows.map((r) => [r.date, linkRow(r), fmt(r.views), `${num(r.lift)}×`, fmt(r.fwd)]),
      )
    : ""

  const TABS = T.tabs
  const tabs = $("tabs")
  const showTab = (key) => {
    tabs.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-selected", b.dataset.k === key)
    })
    const neg = key === "controversial"
    $("tTop").innerHTML = table(
      head([...T.topHead, ...(neg ? [T.negative] : [])], [1]),
      DATA[key].map((r) => [
        r.date,
        linkRow(r),
        fmt(r.views),
        `<span class="${r.lift >= 1.5 ? "up" : r.lift < 0.8 ? "down" : ""}">${num(r.lift)}×</span>`,
        fmt(r.react),
        fmt(r.fwd),
        fmt(r.com),
        ...(neg ? [`<span class="down">${pct(r.neg)}</span>`] : []),
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
    const postsOf = { 0: c.posts, 5: c.authorPosts }
    $("communityKpis").innerHTML = tiles(
      [
        fmt(c.comments),
        fmt(c.people),
        pct(c.onceShare),
        pct(c.top10Share),
        fmt(c.returning),
        num(c.authorComments),
        c.firstMinutes == null ? "—" : T.minutes(num(c.firstMinutes)),
        pct(c.replyShare),
      ].map((v, i) => [v, T.community[i].replace("{posts}", num(postsOf[i]))]),
    )
    $("communityCap").textContent = T.communityCap
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
        : `<div class="muted">${T.pollHidden}</div>`
      return `<div class="poll"><div>${anchor(q.link, esc(q.text))} <span class="muted">· ${T.pollMeta(q.date, fmt(q.voters), pct(q.rate))}</span></div>${answers}</div>`
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
    const C = T.chart
    const base = {
      locale: T.locale,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: ink, boxWidth: 12 } } },
    }
    const mk = (id, cfg) => charts.push(new Chart($(id), { ...cfg, options: { ...base, ...cfg.options } }))
    const liftHit = (id, rows, key) =>
      mk(id, {
        data: {
          labels: rows.map((r) => `${r[key]} (${num(r.n)})`),
          datasets: [
            { type: "bar", label: C.avgLift, data: rows.map((r) => r.lift), backgroundColor: acc, yAxisID: "y" },
            {
              type: "line",
              label: C.hitRate,
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
            label: C.posts,
            data: DATA.monthly.map((m) => m.n),
            backgroundColor: `${acc}55`,
            yAxisID: "y",
          },
          {
            type: "line",
            label: C.medianViews,
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
          y: { title: { display: true, text: C.axisPosts } },
          y1: { position: "right", grid: { display: false }, title: { display: true, text: C.axisViews } },
        },
      },
    })
    liftHit(
      "cGap",
      DATA.byGap.filter((r) => r.n).map((r) => ({ ...r, b: label(r.b) })),
      "b",
    )
    liftHit(
      "cLoad",
      DATA.byDayLoad.filter((r) => r.n).map((r) => ({ ...r, b: label(r.b) })),
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
        labels: DATA.byKind.map((k) => `${label(k.k)} (${num(k.n)})`),
        datasets: [
          { label: C.reactions, data: DATA.byKind.map((k) => k.reactPer1k), backgroundColor: acc },
          { label: C.forwards, data: DATA.byKind.map((k) => k.fwdPer1k), backgroundColor: warm },
          { label: C.comments, data: DATA.byKind.map((k) => k.comPer1k), backgroundColor: good },
        ],
      },
    })
    const len = DATA.byLength.filter((b) => b.n >= 20)
    mk("cLen", {
      data: {
        labels: len.map((b) => `${label(b.b)} (${num(b.n)})`),
        datasets: [
          {
            type: "bar",
            label: C.fwdPer1k,
            data: len.map((b) => b.fwdPer1k),
            backgroundColor: warm,
            yAxisID: "y",
          },
          {
            type: "line",
            label: C.hitRate,
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
        labels: yrs.map((y) => (y === open ? C.openYear(y, o.last.slice(5)) : y)),
        datasets: DATA.themes
          .filter((t) => t.n >= 3)
          .map((t, i) => ({
            label: label(t.name),
            data: yrs.map((y) => (perYear[y] ? Math.round((t.byYear[y] / perYear[y]) * 100) : null)),
            borderColor: palette[i % palette.length],
            backgroundColor: palette[i % palette.length],
            tension: 0.25,
          })),
      },
      options: { scales: { y: { beginAtZero: true, ticks: { callback: (v) => `${v}%` } } } },
    })
    $("themeCap").textContent = C.themeCap
    if (c)
      mk("cCommenters", {
        type: "bar",
        data: {
          labels: C.commenterBuckets,
          datasets: [{ label: C.commenters, data: c.distribution, backgroundColor: acc }],
        },
        options: { plugins: { legend: { display: false } } },
      })
    const py = p.byYear.filter((y) => y.n)
    mk("cPollRate", {
      data: {
        labels: py.map((y) => y.y),
        datasets: [
          { type: "bar", label: C.polls, data: py.map((y) => y.n), backgroundColor: `${acc}55`, yAxisID: "y" },
          {
            type: "line",
            label: C.pollRate,
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
        datasets: [{ label: C.reactions, data: DATA.reactions.map((r) => r.n), backgroundColor: acc }],
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

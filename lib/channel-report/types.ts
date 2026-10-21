export type Lang = "en" | "ru" | "es"
type Tagged = { tag: "good" | "bad" | "try"; text: string }
type Tab = [label: string, caption: string]

// Prose strings mark bold runs with **…**. Data labels (themes, openers, buckets, formats) are keyed by the
// English value in data.json; the channel's own posts, polls and description stay as written.
export type ChannelReportCopy = {
  meta: string
  titleBefore: string
  titleAfter: string
  channel: string
  toc: {
    numbers: string
    reading: string
    growth: string
    rhythm: string
    content: string
    posts: string
    readers: string
    method: string
  }
  numbers: { title: string; findings: string[] }
  reading: {
    title: string
    note: string
    channelTitle: string
    channel: string[]
    readersTitle: string
    readers: string[]
    tags: { good: string; bad: string; try: string }
    worksTitle: string
    works: Tagged[]
    fixTitle: string
    fixes: Tagged[]
    tryTitle: string
    tries: Tagged[]
  }
  growth: { title: string; monthly: string; monthlyCap: string; yearly: string; yearlyCap: string }
  rhythm: {
    title: string
    gap: string
    gapCap: string
    load: string
    loadCap: string
    heat: string
    heatCap: string
    weekday: string
    hour: string
    hourCap: string
  }
  content: {
    title: string
    kind: string
    length: string
    lengthCap: string
    themes: string
    themesCap: string
    themeMix: string
    openers: string
    openersCap: string
    promo: string
  }
  posts: { title: string }
  readers: {
    title: string
    comments: string
    polls: string
    pollsCap: string
    reactions: string
    biggestPolls: string
    biggestPollsCap: string
  }
  links: { title: string; sites: string; handles: string }
  method: { title: string; notes: string[] }
  render: {
    locale: string
    about: (first: string, last: string) => string
    profile: {
      created: string
      createdValue: (date: string, years: string) => string
      earliest: string
      nothingOlder: string
      silence: string
      silenceValue: (days: string, until: string) => string
      calls: string
      callsValue: (n: string, last: string) => string
      links: string
    }
    kpis: string[]
    yearly: string[]
    days: string[]
    heatTitle: (day: string, hour: number, n: number) => string
    themeHead: string[]
    openerHead: string[]
    promo: (n: number, lift: string) => string
    promoNone: string
    promoHead: string[]
    tabs: Record<"topLift" | "topViews" | "topFwd" | "topCom" | "controversial" | "flops", Tab>
    topHead: string[]
    negative: string
    community: string[]
    communityCap: string
    minutes: (n: string) => string
    pollHidden: string
    pollMeta: (date: string, votes: string, rate: string) => string
    chart: {
      avgLift: string
      hitRate: string
      posts: string
      medianViews: string
      axisPosts: string
      axisViews: string
      reactions: string
      forwards: string
      comments: string
      fwdPer1k: string
      openYear: (year: string, to: string) => string
      themeCap: string
      commenterBuckets: string[]
      commenters: string
      polls: string
      pollRate: string
    }
    labels: Record<string, string>
  }
}

"use client"

import { Fragment, useEffect, useRef } from "react"
import { channelReportCopy, type Lang } from "@/lib/channel-report"
import "./channel-report.css"

function Rich({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) =>
    part.startsWith("**") ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string never reorder.
      <b key={i}>{part.slice(2, -2)}</b>
    ) : part.startsWith("`") ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string never reorder.
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string never reorder.
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function Tagged({
  items,
  tags,
}: {
  items: { tag: "good" | "bad" | "try"; text: string }[]
  tags: Record<string, string>
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.text}>
          <span className={item.tag === "try" ? "tag" : `tag ${item.tag}`}>{tags[item.tag]}</span>
          <Rich text={item.text} />
        </li>
      ))}
    </ul>
  )
}

export function ChannelReport({ lang = "en" }: { lang?: Lang }) {
  const root = useRef<HTMLDivElement>(null)
  const t = channelReportCopy[lang] ?? channelReportCopy.en

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false
    Promise.all([import("./chart"), import("./render.js"), import("./data.json")]).then(
      ([{ default: Chart }, { renderReport }, { default: data }]) => {
        if (!cancelled && root.current) cleanup = renderReport(root.current, Chart, data, t.render)
      },
    )
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [t])

  const r = t.reading
  return (
    <div ref={root} className="channel-report not-prose">
      <header>
        <p className="meta">{t.meta}</p>
        <p className="title">
          {t.titleBefore}
          <span className="handle">@AI_DeepLearning</span>
          {t.titleAfter}
        </p>
        <div className="lede">
          <p id="about" />
          <div className="panel">
            <h3>{t.channel}</h3>
            <dl className="facts" id="profile" />
          </div>
        </div>
        <ul className="toc">
          {Object.entries(t.toc).map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </header>

      <div className="kpis" id="kpis" />

      <section id="numbers">
        <h2>{t.numbers.title}</h2>
        <ol className="findings facts">
          {t.numbers.findings.map((text) => (
            <li key={text}>
              <p>
                <Rich text={text} />
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="reading">
        <h2>{r.title}</h2>
        <p className="muted">
          <Rich text={r.note} />
        </p>

        <div className="split">
          <div className="panel insight">
            <h3>{r.channelTitle}</h3>
            <ul>
              {r.channel.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
          <div className="panel insight">
            <h3>{r.readersTitle}</h3>
            <ul>
              {r.readers.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel insight">
          <h3>{r.worksTitle}</h3>
          <Tagged items={r.works} tags={r.tags} />
        </div>

        <div className="panel insight">
          <h3>{r.fixTitle}</h3>
          <Tagged items={r.fixes} tags={r.tags} />
        </div>

        <div className="panel insight">
          <h3>{r.tryTitle}</h3>
          <Tagged items={r.tries} tags={r.tags} />
        </div>
      </section>

      <section id="growth">
        <h2>{t.growth.title}</h2>
        <div className="fig">
          <h3>{t.growth.monthly}</h3>
          <div className="chart tall">
            <canvas id="cMonthly" />
          </div>
          <p className="cap">{t.growth.monthlyCap}</p>
        </div>
        <div className="fig">
          <h3>{t.growth.yearly}</h3>
          <div className="tbl">
            <table id="tYearly" />
          </div>
          <p className="cap">{t.growth.yearlyCap}</p>
        </div>
      </section>

      <section id="rhythm">
        <h2>{t.rhythm.title}</h2>
        <div className="grid2">
          <div className="fig">
            <h3>{t.rhythm.gap}</h3>
            <div className="chart">
              <canvas id="cGap" />
            </div>
            <p className="cap">{t.rhythm.gapCap}</p>
          </div>
          <div className="fig">
            <h3>{t.rhythm.load}</h3>
            <div className="chart">
              <canvas id="cLoad" />
            </div>
            <p className="cap">{t.rhythm.loadCap}</p>
          </div>
        </div>
        <div className="fig">
          <h3>{t.rhythm.heat}</h3>
          <div className="heat" id="heat" />
          <p className="cap">{t.rhythm.heatCap}</p>
        </div>
        <div className="grid2">
          <div className="fig">
            <h3>{t.rhythm.weekday}</h3>
            <div className="chart">
              <canvas id="cWeekday" />
            </div>
          </div>
          <div className="fig">
            <h3>{t.rhythm.hour}</h3>
            <div className="chart">
              <canvas id="cHour" />
            </div>
            <p className="cap">{t.rhythm.hourCap}</p>
          </div>
        </div>
      </section>

      <section id="content">
        <h2>{t.content.title}</h2>
        <div className="grid2">
          <div className="fig">
            <h3>{t.content.kind}</h3>
            <div className="chart">
              <canvas id="cKind" />
            </div>
          </div>
          <div className="fig">
            <h3>{t.content.length}</h3>
            <div className="chart">
              <canvas id="cLen" />
            </div>
            <p className="cap">{t.content.lengthCap}</p>
          </div>
        </div>
        <div className="fig">
          <h3>{t.content.themes}</h3>
          <div className="tbl">
            <table id="tThemes" />
          </div>
          <p className="cap">{t.content.themesCap}</p>
        </div>
        <div className="fig">
          <h3>{t.content.themeMix}</h3>
          <div className="chart tall">
            <canvas id="cThemeYears" />
          </div>
          <p className="cap" id="themeCap" />
        </div>
        <div className="fig">
          <h3>{t.content.openers}</h3>
          <div className="tbl">
            <table id="tOpeners" />
          </div>
          <p className="cap">{t.content.openersCap}</p>
        </div>
        <div className="fig">
          <h3>{t.content.promo}</h3>
          <p id="promo" />
          <div className="tbl">
            <table id="tPromo" />
          </div>
        </div>
      </section>

      <section id="posts">
        <h2>{t.posts.title}</h2>
        <div className="fig">
          <div className="tabs" role="tablist" id="tabs" />
          <div className="tbl">
            <table id="tTop" />
          </div>
          <p className="cap" id="tabCap" />
        </div>
      </section>

      <section id="readers">
        <h2>{t.readers.title}</h2>
        <div className="fig" id="communityFig">
          <h3>{t.readers.comments}</h3>
          <div className="kpis" id="communityKpis" />
          <div className="chart">
            <canvas id="cCommenters" />
          </div>
          <p className="cap" id="communityCap" />
        </div>
        <div className="grid2">
          <div className="fig">
            <h3>{t.readers.polls}</h3>
            <div className="chart">
              <canvas id="cPollRate" />
            </div>
            <p className="cap">{t.readers.pollsCap}</p>
          </div>
          <div className="fig">
            <h3>{t.readers.reactions}</h3>
            <div className="chart tall">
              <canvas id="cReact" />
            </div>
          </div>
        </div>
        <div className="fig">
          <h3>{t.readers.biggestPolls}</h3>
          <div id="polls" />
          <p className="cap">{t.readers.biggestPollsCap}</p>
        </div>
      </section>

      <section id="links">
        <h2>{t.links.title}</h2>
        <div className="grid2">
          <div className="fig">
            <h3>{t.links.sites}</h3>
            <div className="chips" id="domains" />
          </div>
          <div className="fig">
            <h3>{t.links.handles}</h3>
            <div className="chips" id="handles" />
          </div>
        </div>
      </section>

      <section id="method">
        <h2>{t.method.title}</h2>
        <ul className="notes">
          {t.method.notes.map((text) => (
            <li key={text}>
              <Rich text={text} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

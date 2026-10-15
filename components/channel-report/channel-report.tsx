"use client"

import { useEffect, useRef } from "react"
import "./channel-report.css"

export function ChannelReport() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false
    Promise.all([import("chart.js/auto"), import("./render.js"), import("./data.json")]).then(
      ([{ default: Chart }, { renderReport }, { default: data }]) => {
        if (!cancelled && root.current) cleanup = renderReport(root.current, Chart, data)
      },
    )
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div ref={root} className="channel-report not-prose">
      <header>
        <p className="meta">Telegram channel audit · data pulled 2026-10-15</p>
        <p className="title">
          Inside <span className="handle">@AI_DeepLearning</span>
        </p>
        <div className="lede">
          <p id="about" />
          <div className="panel">
            <h3>The channel</h3>
            <dl className="facts" id="profile" />
          </div>
        </div>
        <ul className="toc">
          <li>
            <a href="#numbers">What the numbers say</a>
          </li>
          <li>
            <a href="#reading">What to do</a>
          </li>
          <li>
            <a href="#growth">Over time</a>
          </li>
          <li>
            <a href="#rhythm">Rhythm</a>
          </li>
          <li>
            <a href="#content">Content</a>
          </li>
          <li>
            <a href="#posts">Top posts</a>
          </li>
          <li>
            <a href="#readers">Readers</a>
          </li>
          <li>
            <a href="#method">Method</a>
          </li>
        </ul>
      </header>

      <div className="kpis" id="kpis" />

      <section id="numbers">
        <h2>What the numbers say</h2>
        <ol className="findings facts">
          <li>
            <p>
              <b>23.9% of subscribers see a typical post.</b> The median post of the last 90 days got 4.1k views; the
              channel has 17.3k subscribers.
            </p>
          </li>
          <li>
            <p>
              <b>Median views per post peaked in 2024 at 8.1k; 2026 stands at 4.8k.</b> Posts per year: 2017 89, 2020
              31, 2021 172, 2022 445, 2023 249, 2024 220, 2025 203, 2026 151 (busiest: 2022).
            </p>
          </li>
          <li>
            <p>
              <b>Posts that follow another within &lt; 3 h average 1.0× lift; after 2+ days of quiet, 1.03×.</b> 0.0%
              against 2.4% break out (1.5× or more).
            </p>
          </li>
          <li>
            <p>
              <b>Long posts get shared most.</b> Posts of 300–800 characters get 4.6 forwards per 1,000 views; posts of
              no text get 2.7.
            </p>
          </li>
          <li>
            <p>
              <b>Polls (10) trade sharing for talk.</b> 0.0 forwards per 1,000 views against 1.2 for text posts; 1.4
              comments against 0.3. 0.0% of polls break out.
            </p>
          </li>
          <li>
            <p>
              <b>Strongest theme: Vision-language & LLMs</b> (1.3% of 78 posts break out).{" "}
              <b>Weakest: Robots & driving</b> (0.0% of 86).
            </p>
          </li>
          <li>
            <p>
              <b>Best opening: «Code released» / repo under a licence</b>, 2.5% break out against 0.9% for all posts
              (197 posts).
            </p>
          </li>
          <li>
            <p>
              <b>26 people wrote 144 comments under posts since 2025-10-16.</b> The top 10% of them wrote 55%; 54%
              commented once. The author replied 49 times, under 34 of 71 posts.
            </p>
          </li>
        </ol>
      </section>

      <section id="reading">
        <h2>What we think it means, and what to do</h2>
        <p className="muted">
          Written by an outside reader from public data only. The numbers are measured; lines marked <b>our guess</b>{" "}
          are interpretation, and you know the reasons better than we do.
        </p>

        <div className="split">
          <div className="panel insight">
            <h3>Your channel, as the data shows it</h3>
            <ul>
              <li>
                One author, one format, nine years. Since 2022 almost every post is the same card: an emoji-framed
                title, two lines on a new paper, then Review, Paper, Project and Code links. 1,218 of 1,582 posts open
                this way, and 1,112 carry a short video.
              </li>
              <li>
                Readers keep and pass on more than they react. The channel has 26.3k forwards against 20.1k reactions:
                1.3 forwards for every reaction. For a paper digest this is the signal that counts. People save a paper
                or send it to a colleague.
              </li>
              <li>
                The subject is still computer vision first. Pose, motion and avatars (496 posts) and 3D reconstruction
                (432) lead. Vision-language models and LLMs are a small theme, but they grew from 12 posts in 2022 to 22
                in 2025.
              </li>
            </ul>
          </div>
          <div className="panel insight">
            <h3>Your readers</h3>
            <ul>
              <li>
                For them Telegram is the main source, not a copy of LinkedIn. In your January 2025 poll, 297 of 573
                voters picked Telegram as their favourite source of AI updates, and 185 picked LinkedIn.
              </li>
              <li>
                A typical post now reaches 24% of the 17.3k subscribers: 4.1k views at the median over the last 90 days.
              </li>
              <li>
                The comment section is small by design. Comments are open only to members you accept into the discussion
                group (your September 2025 poll asked about this and got 524 votes). From 16 Oct 2025 on, 26 people
                wrote 144 comments under 71 posts. One reader wrote 52 of them, more than a third. You answered 49
                times, under 34 posts. The first comment usually comes 45 minutes after the post.
              </li>
            </ul>
          </div>
        </div>

        <div className="panel insight">
          <h3>What works</h3>
          <ul>
            <li>
              <span className="tag good">works</span>
              <b>Code that is out today.</b> 197 posts say the code is released or name its licence ("Repo under Apache
              2.0💙"). Readers forward them 5.3 times per 1,000 views, against 4.0 for the whole channel and 4.6 for the
              108 posts where the code is only "announced". Breakouts are too rare here to compare: 5 of the 197, and 15
              of all 1,582 posts.
            </li>
            <li>
              <span className="tag good">works</span>
              <b>Big learning resources travel furthest.</b> The four most-forwarded posts are not single papers. They
              are a guide to modern computer vision (160 forwards), a Stanford course on generative AI (139), Meta's
              Segment Anything (126) and this month's "Computer Vision ultimate collection" (122). The last one is
              already the most-forwarded post of 2026, at a time when views are at their lowest.
            </li>
            <li>
              <span className="tag good">works</span>
              <b>Vision-language and LLM posts get shared.</b> They have the highest forwards per reaction of any theme
              (1.69) and 4.9 forwards per 1,000 views. There are only 78 of them, so there is room to grow.
            </li>
            <li>
              <span className="tag good">works</span>
              <b>Your own voice.</b> The 17 posts where you write as yourself ("Dear friends", "Hi everyone") get 11.4
              reactions per 1,000 views. One of them, the June 2025 note about a break, has 455 reactions on its own.
              Without it, the other 16 still get 6.8, more than twice the channel's 3.0. Readers care about the person
              behind the digest. These posts are rarely forwarded (0.6 per 1,000 views), which is expected: they are for
              the people already here.
            </li>
            <li>
              <span className="tag good">works</span>
              <b>One post a day.</b> On days with a single post, 2.1% of posts break out and readers forward 4.5 per
              1,000 views. On days with two or more posts, none of 877 broke out, and forwards drop to 3.0–3.5.
            </li>
          </ul>
        </div>

        <div className="panel insight">
          <h3>What could be better</h3>
          <ul>
            <li>
              <span className="tag bad">fix</span>
              <b>Reach never came back after the 2025 break.</b> From May to July 2025 the channel posted 3 times. In
              the six months before the break, the median post got 8.4k views, 17 reactions and 36 forwards. In the six
              months after it, 5.0k views, 11 reactions and 22 forwards: about 40% less on every count. September 2026
              is lower still, at 4.0k. <b>Our guess:</b> during the quiet months some readers muted the channel or left,
              and the posts since then reach a smaller active audience. The subscriber history that would show it is in
              Telegram's admin statistics, which we can't see.
            </li>
            <li>
              <span className="tag bad">fix</span>
              <b>Telegram shows the same shape as your October post about LinkedIn.</b> You wrote there that engagement
              grew while impressions fell. Here too, the median engagement rate rose from 0.6% in 2022–2024 to 0.8% in
              2026, while median views fell 41% from 2024 and median reactions per post fell from 17 to 12. Telegram has
              no feed algorithm for channels: a post reaches the subscribers who still open the channel. Here the fall
              starts at the 2025 break.
            </li>
            <li>
              <span className="tag bad">fix</span>
              <b>Most links hide where they go.</b> The posts carry 1,845 short or LinkedIn links (t.ly 643, bit.ly 524,
              lnkd.in 466, linkedin.com 212), against 178 direct arXiv links and 143 direct GitHub links. A Telegram
              reader who taps "Review" lands on LinkedIn. <b>Our guess:</b> that is the point, since LinkedIn is your
              main platform. But the readers who voted for Telegram want the paper and the code, and a forward with a
              bare t.ly link tells the next person nothing.
            </li>
            <li>
              <span className="tag bad">fix</span>
              <b>Bursts of live posts fall flat.</b> On 24–25 September 2025 the channel sent 39 messages, most of them
              photos from an Nvidia event in Milan. All 8 of the weakest posts of the last two years come from those two
              days, at 0.67–0.82× their period's views.
            </li>
            <li>
              <span className="tag bad">fix</span>
              <b>Bare links did nothing.</b> The 139 link-only posts of 2021–22 got 0.7 forwards and 0.2 reactions per
              1,000 views. The channel grew only after the move to the paper card in 2022, when median views went from
              232 to 2.8k.
            </li>
          </ul>
        </div>

        <div className="panel insight">
          <h3>Experiments worth running</h3>
          <ul>
            <li>
              <span className="tag">try</span>
              <b>Direct links first for four weeks.</b> Put the arXiv and GitHub links at the top and the LinkedIn
              review last. Compare forwards per 1,000 views with the four weeks before.
            </li>
            <li>
              <span className="tag">try</span>
              <b>Wait for the code.</b> Post a paper when its code is out, and put "code + licence" in the first line.
              Keep "announced" papers for a weekly round-up. The data shows that released code is what readers pass on.
            </li>
            <li>
              <span className="tag">try</span>
              <b>A monthly resource post.</b> Courses, surveys and collections are the four most-forwarded posts ever.
              One a month, with the best papers of the month, costs little and fits the format that travels.
            </li>
            <li>
              <span className="tag">try</span>
              <b>Turn events into one post.</b> Cover a conference in one album or one evening summary instead of a
              stream of photos.
            </li>
            <li>
              <span className="tag">try</span>
              <b>Ask the quiet majority again.</b> 524 people voted on the comment setting and 433 on what to post next.
              A short "what did you build with a paper from here?" post, with comments open for a week, would show
              whether the readers who forward also want to talk.
            </li>
          </ul>
        </div>
      </section>

      <section id="growth">
        <h2>Output and views over time</h2>
        <div className="fig">
          <h3>Posts per month and median views per post</h3>
          <div className="chart tall">
            <canvas id="cMonthly" />
          </div>
          <p className="cap">
            Bars: posts in the month. Line: median current views of those posts. The last month is still collecting
            views.
          </p>
        </div>
        <div className="fig">
          <h3>Year by year</h3>
          <div className="tbl">
            <table id="tYearly" />
          </div>
          <p className="cap">
            ER (engagement rate) = (reactions + forwards + comments) ÷ views, median per post. Negative = share of 💩 👎
            🤬 🤡 🤮 😡 among all reactions that year.
          </p>
        </div>
      </section>

      <section id="rhythm">
        <h2>Does posting more often cost views?</h2>
        <div className="grid2">
          <div className="fig">
            <h3>Lift by time since the previous post</h3>
            <div className="chart">
              <canvas id="cGap" />
            </div>
            <p className="cap">
              Lift = a post's views ÷ the median views of its 40 nearest posts; 1.0 is a normal post for its period.
              Line: share of posts that reach 1.5× or more.
            </p>
          </div>
          <div className="fig">
            <h3>Lift by posts on the same day</h3>
            <div className="chart">
              <canvas id="cLoad" />
            </div>
            <p className="cap">Every post of a busy day counts toward that day's bucket.</p>
          </div>
        </div>
        <div className="fig">
          <h3>When posts go out (UTC)</h3>
          <div className="heat" id="heat" />
          <p className="cap">Darker cell = more posts in that slot. Madrid is UTC+1 in winter and UTC+2 in summer.</p>
        </div>
        <div className="grid2">
          <div className="fig">
            <h3>Lift by weekday</h3>
            <div className="chart">
              <canvas id="cWeekday" />
            </div>
          </div>
          <div className="fig">
            <h3>Lift by hour (UTC)</h3>
            <div className="chart">
              <canvas id="cHour" />
            </div>
            <p className="cap">Hours with fewer than 15 posts are hidden: too few to trust.</p>
          </div>
        </div>
      </section>

      <section id="content">
        <h2>What earns attention</h2>
        <div className="grid2">
          <div className="fig">
            <h3>Per 1,000 views, by format</h3>
            <div className="chart">
              <canvas id="cKind" />
            </div>
          </div>
          <div className="fig">
            <h3>By text length</h3>
            <div className="chart">
              <canvas id="cLen" />
            </div>
            <p className="cap">
              Characters of text, polls left out. Bars: forwards per 1,000 views. Line: share of posts reaching 1.5×
              lift.
            </p>
          </div>
        </div>
        <div className="fig">
          <h3>Themes</h3>
          <div className="tbl">
            <table id="tThemes" />
          </div>
          <p className="cap">
            Keyword matching on the text, so a post can count toward several themes. Hit rate = share of posts with lift
            ≥ 1.5. Forwards per reaction: above 1, readers pass the post on more than they react to it, which usually
            means a useful post rather than a pleasant one.
          </p>
        </div>
        <div className="fig">
          <h3>Theme mix over time</h3>
          <div className="chart tall">
            <canvas id="cThemeYears" />
          </div>
          <p className="cap" id="themeCap" />
        </div>
        <div className="fig">
          <h3>How a post opens</h3>
          <div className="tbl">
            <table id="tOpeners" />
          </div>
          <p className="cap">Patterns in the first line. The last row is the whole channel, for comparison.</p>
        </div>
        <div className="fig">
          <h3>Referral and sponsored posts</h3>
          <p id="promo" />
          <div className="tbl">
            <table id="tPromo" />
          </div>
        </div>
      </section>

      <section id="posts">
        <h2>The posts that mattered</h2>
        <div className="fig">
          <div className="tabs" role="tablist" id="tabs" />
          <div className="tbl">
            <table id="tTop" />
          </div>
          <p className="cap" id="tabCap" />
        </div>
      </section>

      <section id="readers">
        <h2>Who is reading, and how they take part</h2>
        <div className="fig" id="communityFig">
          <h3>The comment section, posts since 2025-10-16</h3>
          <div className="kpis" id="communityKpis" />
          <div className="chart">
            <canvas id="cCommenters" />
          </div>
          <p className="cap" id="communityCap" />
        </div>
        <div className="grid2">
          <div className="fig">
            <h3>Polls: how many viewers vote</h3>
            <div className="chart">
              <canvas id="cPollRate" />
            </div>
            <p className="cap">Median votes ÷ views per poll, by year. Bars: polls that year.</p>
          </div>
          <div className="fig">
            <h3>Reactions, all time</h3>
            <div className="chart tall">
              <canvas id="cReact" />
            </div>
          </div>
        </div>
        <div className="fig">
          <h3>Biggest polls</h3>
          <div id="polls" />
          <p className="cap">
            Each answer's count shows only for polls this account voted in; the total shows for all.
          </p>
        </div>
      </section>

      <section id="links">
        <h2>Where the channel points</h2>
        <div className="grid2">
          <div className="fig">
            <h3>Linked sites</h3>
            <div className="chips" id="domains" />
          </div>
          <div className="fig">
            <h3>Mentioned accounts</h3>
            <div className="chips" id="handles" />
          </div>
        </div>
      </section>

      <section id="method">
        <h2>How this was measured</h2>
        <ul className="notes">
          <li>
            Source: every post the channel returns today, read with the tg CLI from a member account. Deleted posts are
            gone. Posts without a view count (the earliest ones and service messages) are left out. An album counts as
            one post.
          </li>
          <li>
            Views, reactions, forwards and comments are today's totals. Old posts reached a smaller audience, so
            comparisons use lift (views ÷ median of the 40 nearest posts), not raw views.
          </li>
          <li>
            Telegram gives the subscriber count only for today, and the channel's official statistics only to its
            admins. So there is no subscriber growth curve, no source of new subscribers and no view-through rate per
            hour.
          </li>
          <li>Themes, openers and sponsored posts come from keyword matching. They are rough.</li>
          <li>Comments: every comment under posts since 2025-10-16. Readers are counted, never named.</li>
          <li>
            Times are UTC. Made with our internal script on the public <code>tg</code> commands; the recipe is in the
            cli-docs guide "Group and channel analytics".
          </li>
        </ul>
      </section>
    </div>
  )
}

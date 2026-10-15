---
title: "Group and channel analytics"
description: "A recipe for a full report on a public Telegram channel: reach, what readers share, themes, posting rhythm, polls and comments, with an example report."
---

Use this recipe when you want to understand a Telegram channel: your own, a competitor's or one you plan to
advertise in. Your agent reads the channel's public posts with the tg command-line tool and writes a report: how
many subscribers see a post, which posts readers pass on, which themes and formats work, and what to try next. You
need a Telegram account that can open the channel. You do not need to be an admin.

## What you get

See the [example report on @AI_DeepLearning](/channel-report-example.html), an English channel of 17k
subscribers that reviews computer-vision papers. It covers 1,582 posts from 2017 to October 2026 and one year of
comments. It shows:

- **Reach:** the share of subscribers who see a typical post, and how views changed by month and by year.
- **Lift:** each post's views compared with the posts around it, so old and new posts can be compared fairly.
  A post with lift 1.5 or more "breaks out".
- **What readers share:** forwards and reactions per 1,000 views, by format, length, theme and opening line.
- **Rhythm:** posting days and hours, and what happens on days with one post against days with three.
- **Polls and comments:** turnout, the biggest polls, how many people comment and how often the author answers.
- **A reading:** what works, what could be better and experiments to run, each backed by a number.

The example found, for instance, that readers forward posts with released code more often (5.3 times per 1,000
views, against 4.0 for the channel), and that views fell about 40% after a three-month pause in posting and did not
come back.

We made the example with our own internal script. The script is not published. The steps below use only public tg
commands, so your agent can produce the same kind of report.

## Before you start

- tg is installed and logged in to your Telegram account. See [Installation](./installation.mdx).
- Your account can open the channel. A public channel is enough; you do not have to join it.
- An AI agent that can run commands on your computer. See [Connect your agent](./agents.mdx).
- For a scripted analysis, Python 3.11 or later. Your agent can also analyse the data without a script.

## Ask your agent

```text prompt
Use tg CLI. Make an analytics report on the Telegram channel @example_channel. Read all its posts, the polls and the comments under posts of the last 90 days. Save the raw data in a local folder. Then measure reach, lift, forwards and reactions per 1,000 views, themes, posting rhythm, polls and comments, and write a one-page HTML report with charts and what you think it means. Count commenters but never name them. Read only: do not join, react, vote or comment.
```

Replace `@example_channel` with the channel you want. For a channel on another subject, tell the agent its themes;
see [Adapt the themes](#adapt-the-themes).

## What happens

1. **The agent reads the channel.** It asks Telegram for the channel's title, description and subscriber count.
2. **It reads every post, 100 at a time.** Each post comes with its views, forwards, reactions and comment count.
3. **It reads the polls and the comments.** It opens the comments only under recent posts that have some.
4. **It saves the raw data on your computer.** Nothing is sent anywhere else.
5. **It analyses the data and writes the report.** This step does not touch Telegram.

All the steps only read. The agent does not join the channel, react, vote or comment.

## How long it takes

Reading posts takes about 1 minute per 1,000 posts. Comments take about 1 minute per 15 posts that have comments.
For the example, the posts took about 1 minute, and one year of comments (71 posts) took about 3 minutes. The
analysis and the written report take the agent another few minutes.

Keep the comment period short for a large channel. Each post with comments is one more request to Telegram, and
Telegram may ask the account to wait if there are too many.

## The commands your agent runs

Here the profile is called `personal`. Use the name of your own profile.

```sh
tg personal --json chats show @example_channel
tg personal --json messages list @example_channel --limit 100
tg personal --json messages list @example_channel 'id<1201' --limit 100
tg personal --json messages comments @example_channel 1250 --limit 100
tg personal --json polls show @example_channel 1189
```

- `chats show` gives the title, the description and the subscriber count (`participants_count`).
- `messages list` gives the newest 100 posts. To read older posts, add `id<N`, where N is the oldest id on the
  previous page. Repeat until a page comes back empty.
- An album (several photos or videos sent together) arrives as several messages with the same `groupedId` in
  `provider_metadata`. Count it as one post.
- Each post has `views`, `forwards` and `comments` in `provider_metadata`, and its reactions in `reactions`. Polls
  carry their question and total votes in `provider_metadata.poll`.
- `messages comments` gives the comments under one post. Each comment has its author's name, so keep these files
  private.
- `polls show` gives one poll's answers with their vote counts, when Telegram shows them to your account.

## Check the result

A complete report says how many posts it read and from which date. Compare that number with the id of the newest
post. The gap is deleted posts, extra album parts and service messages, such as "channel created" or a pinned
message. Service messages have no views and are not posts. In the example, the newest id was 1758 and the report
counted 1,582 posts.

The report should tell measured numbers apart from guesses. A sentence such as "views fell after the break" is a
measurement. "Some readers muted the channel" is a guess: Telegram does not show it.

## What it cannot see

- **Subscriber history.** Telegram gives the subscriber count only for today. Growth, where subscribers come from
  and views by hour are in the channel's official statistics, which only admins can open.
- **Deleted posts.** They are gone from the history.
- **Answers of some polls.** For a poll your account did not vote in, Telegram can give only the total.
- **Old views.** The earliest posts of some channels have no view count.

## Adapt the themes

The report finds themes and opening lines by keywords. A list made for one channel does not fit another. Give your
agent the themes in your request, for example:

```text prompt
Themes for this channel: 3D reconstruction (3D, NeRF, mesh, depth), human pose and motion (pose, motion, avatar), image and video generation (diffusion, GAN, text-to-video), LLMs (LLM, VLM, GPT). Also count posts that say the code is released and posts that say it is only announced.
```

Read the posts first, then choose keywords. Check a few posts in each theme. Keywords are rough: "motion" also
finds a robot's motion.

## For a group

The same commands read a group's messages, but a group has no views or forwards per message. For your own group,
measure activity, active people and unanswered questions; see [Group admins](./group-admins.md).

## Privacy

- **Keep the raw data on your computer.** Comments carry the names and usernames of the people who wrote them.
- **Do not publish readers' names.** Count commenters; do not list them. Before you share a report, check it for
  usernames, links to people's profiles, phone numbers and email addresses. In the example report, readers are
  only counted.
- **Posts are public, people are not.** Quoting a channel's own posts is fine. A quote from a comment can identify a
  private person: leave it out or ask them first.

Next, compare two channels: run the same request for a second channel with the same themes, and ask your agent to put
the two reports side by side.

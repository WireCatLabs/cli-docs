"use client"

import { Mail, Map as MapIcon, Signpost, Tags } from "lucide-react"
import { BlogWidget } from "@/components/blog/blog-layout"
import { DiscordIcon, GitHubIcon, TelegramIcon } from "@/components/brand-icons"
import { ideaPath, issuesUrl } from "@/lib/ideas"
import { boardWords } from "@/lib/ideas/board-words"
import { type IdeaStatus, tagName } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import siteConfig from "@/site.config.json"
import { StatusIcon } from "../status-label"
import type { Board } from "./use-board"

const lanes: { status: IdeaStatus; key: "in_progress" | "planned" | "done" }[] = [
  { status: "in_progress", key: "in_progress" },
  { status: "planned", key: "planned" },
  { status: "done", key: "done" },
]

/** Shipped ideas newest first, the rest by votes; three each, with a link to the whole status. */
function Roadmap({ board }: { board: Board }) {
  const words = boardWords(board.lang)
  return (
    <BlogWidget title={words.roadmapTitle} icon={<MapIcon aria-hidden="true" />} className="ideas-roadmap">
      {lanes.map(({ status, key }) => {
        const found = board.all
          .filter((idea) => idea.status === status)
          .sort((a, b) =>
            status === "done"
              ? (b.statusChangedAt ?? b.createdAt).localeCompare(a.statusChangedAt ?? a.createdAt)
              : b.votes - a.votes,
          )
        return (
          <div key={status} className="ideas-lane" data-status={status}>
            <h3>
              <StatusIcon status={status} />
              {words.roadmap[key]}
              <span className="blog-count">{found.length}</span>
            </h3>
            {found.length > 0 ? (
              <ul>
                {found.slice(0, 3).map((idea) => (
                  <li key={idea.id}>
                    <a
                      href={ideaPath(board.lang, idea.id)}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
                        event.preventDefault()
                        board.select(idea.id)
                      }}
                    >
                      {idea.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ideas-lane-empty">{words.laneEmpty}</p>
            )}
            {found.length > 3 && (
              <button type="button" className="board-link-button" onClick={() => board.setQuery({ status })}>
                {words.seeAll(found.length)}
              </button>
            )}
          </div>
        )
      })}
    </BlogWidget>
  )
}

function TagFilter({ board }: { board: Board }) {
  const words = boardWords(board.lang)
  if (!board.tags.length) return null
  const count = (slug: string) => board.all.filter((idea) => idea.tags.some((tag) => tag.slug === slug)).length
  return (
    <BlogWidget title={words.tags} icon={<Tags aria-hidden="true" />}>
      <ul className="ideas-tag-list">
        {board.tags
          .filter((tag) => !board.all.length || count(tag.slug) > 0 || board.query.tag === tag.slug)
          .map((tag) => {
            const on = board.query.tag === tag.slug
            return (
              <li key={tag.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => board.setQuery({ tag: on ? undefined : tag.slug })}
                >
                  <span>#{tagName(tag, board.lang)}</span>
                  <span className="blog-count">{count(tag.slug)}</span>
                </button>
              </li>
            )
          })}
      </ul>
    </BlogWidget>
  )
}

export function IdeasSidebar({ board }: { board: Board }) {
  const words = ideasWords(board.lang)
  const own = boardWords(board.lang)
  return (
    <>
      <Roadmap board={board} />
      <TagFilter board={board} />
      <BlogWidget title={words.where} icon={<Signpost aria-hidden="true" />} className="ideas-where">
        <p>{own.whereShort}</p>
        <ul className="blog-icon-links">
          <li>
            <a href={issuesUrl(board.query.tool)} target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              {words.whereBugsLink}
            </a>
          </li>
          <li>
            <a href={siteConfig.community.discord} target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
              Discord
            </a>
          </li>
          {board.lang === "ru" && (
            <li>
              <a href={siteConfig.community.telegramGroup} target="_blank" rel="noopener noreferrer">
                <TelegramIcon />
                Telegram
              </a>
            </li>
          )}
        </ul>
      </BlogWidget>
      <p className="ideas-emails">
        <Mail aria-hidden="true" />
        {words.emails}
      </p>
    </>
  )
}

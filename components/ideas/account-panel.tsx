"use client"

import { ChevronUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ideas, ideasPath, maskEmail } from "@/lib/ideas"
import type { Idea, Member } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { MemberAvatar } from "./member-bar"
import { StatusLabel } from "./status-label"
import { signInHref, useMember } from "./use-member"

const shownVotes = 8

/** Who is signed in, the ideas they voted for, sign-out and account deletion. */
export function AccountPanel({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const account = words.account
  const member = useMember()
  const [deleted, setDeleted] = useState(false)

  if (deleted)
    return (
      <section className="ideas-panel" aria-labelledby="account-title">
        <h1 id="account-title" tabIndex={-1} ref={(heading) => heading?.focus()}>
          {account.done}
        </h1>
        <Link className="ideas-button ideas-button-quiet" href={ideasPath(lang)}>
          {account.browse}
        </Link>
      </section>
    )

  return (
    <section className="ideas-panel ideas-account" aria-labelledby="account-title" aria-busy={member === undefined}>
      <h1 id="account-title">{account.title}</h1>
      {member === null && (
        <>
          <p>{account.signInFirst}</p>
          <Link className="ideas-button" href={signInHref(lang, ideasPath(lang, "account"))}>
            {account.signInAction}
          </Link>
        </>
      )}
      {member && (
        <>
          <Identity lang={lang} member={member} />
          <Votes lang={lang} />
          <DeleteAccount lang={lang} onDeleted={() => setDeleted(true)} />
        </>
      )}
    </section>
  )
}

function Identity({ lang, member }: { lang: string; member: Member }) {
  const words = ideasWords(lang)
  const [failure, setFailure] = useState("")
  const signOut = () =>
    ideas.signOut().then(
      () => window.location.assign(ideasPath(lang)),
      (error) => setFailure(errorText(lang, error, words.signIn.failed)),
    )
  return (
    <div className="ideas-identity">
      <MemberAvatar member={member} />
      <div>
        {member.name && <p className="ideas-identity-name">{member.name}</p>}
        <p className="ideas-identity-email">
          {words.account.signedInAs} {maskEmail(member.email)}
        </p>
      </div>
      <button type="button" className="ideas-button ideas-button-quiet" onClick={signOut}>
        {words.signIn.signOut}
      </button>
      {failure && (
        <p className="ideas-error" role="alert">
          {failure}
        </p>
      )}
    </div>
  )
}

function Votes({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const [voted, setVoted] = useState<{ ideas: Idea[]; total: number } | null>()
  useEffect(() => {
    ideas.list({ sort: "new", voted: true, perPage: shownVotes }).then(
      (page) => setVoted({ ideas: page.ideas, total: page.total }),
      () => setVoted(null),
    )
  }, [])

  return (
    <section className="ideas-account-votes" aria-labelledby="account-votes">
      <h2 id="account-votes">{words.account.votesTitle}</h2>
      {voted === undefined && <p className="ideas-quiet">{words.loading}</p>}
      {voted === null && <p className="ideas-error">{words.down}</p>}
      {voted && voted.total === 0 && (
        <p className="ideas-quiet">
          {words.account.votesEmpty} <Link href={ideasPath(lang)}>{words.account.browse}</Link>
        </p>
      )}
      {voted && voted.total > 0 && (
        <ul className="ideas-voted">
          {voted.ideas.map((idea) => (
            <li key={idea.id}>
              <span className="ideas-voted-count" title={`${idea.votes} ${words.votes(idea.votes)}`}>
                <ChevronUp aria-hidden="true" />
                {idea.votes}
              </span>
              <Link href={`${ideasPath(lang)}?id=${encodeURIComponent(idea.id)}`}>{idea.title}</Link>
              <StatusLabel lang={lang} status={idea.status} />
            </li>
          ))}
        </ul>
      )}
      {voted && voted.total > voted.ideas.length && (
        <p className="ideas-quiet">{words.account.votesMore(voted.total - voted.ideas.length)}</p>
      )}
    </section>
  )
}

function DeleteAccount({ lang, onDeleted }: { lang: string; onDeleted: () => void }) {
  const account = ideasWords(lang).account
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [failure, setFailure] = useState("")
  const remove = async () => {
    setDeleting(true)
    try {
      await ideas.deleteAccount()
      onDeleted()
    } catch (error) {
      setFailure(errorText(lang, error, account.failed))
    }
    setDeleting(false)
  }
  return (
    <div className="ideas-danger">
      {confirming ? (
        <section aria-labelledby="account-confirm">
          <h2 id="account-confirm">{account.confirm}</h2>
          <p>{account.confirmText}</p>
          <div className="ideas-actions">
            <button type="button" className="ideas-button ideas-button-danger" disabled={deleting} onClick={remove}>
              {deleting ? account.deleting : account.yes}
            </button>
            <button type="button" className="ideas-button ideas-button-quiet" onClick={() => setConfirming(false)}>
              {account.no}
            </button>
          </div>
          {failure && (
            <p className="ideas-error" role="alert">
              {failure}
            </p>
          )}
        </section>
      ) : (
        <button type="button" className="ideas-text-button" onClick={() => setConfirming(true)}>
          {account.delete}
        </button>
      )}
    </div>
  )
}

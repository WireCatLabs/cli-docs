"use client"

import { useEffect, useState } from "react"
import { ideas, ideasPath, returnPath } from "@/lib/ideas"
import type { Member } from "@/lib/ideas/types"

export const memberChanged = "wirecat-ideas-member"

/** undefined while the session is loading, null when signed out or when the API cannot say. */
export function useMember() {
  const [member, setMember] = useState<Member | null>()
  useEffect(() => {
    let current = true
    const load = () =>
      ideas
        .member()
        .then((value) => current && setMember(value))
        .catch(() => current && setMember(null))
    load()
    window.addEventListener(memberChanged, load)
    return () => {
      current = false
      window.removeEventListener(memberChanged, load)
    }
  }, [])
  return member
}

/** This page as a sign-in `return_to`, once mounted, so links built from it match the static HTML first. */
export function useReturnPath(lang: string) {
  const [path, setPath] = useState(ideasPath(lang))
  useEffect(() => setPath(returnPath(lang, window.location.pathname, window.location.search)), [lang])
  return path
}

export const signInHref = (lang: string, next: string) =>
  `${ideasPath(lang, "sign-in")}?next=${encodeURIComponent(next)}`

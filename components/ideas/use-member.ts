"use client"

import { useEffect, useState } from "react"
import { ideas } from "@/lib/ideas"
import type { Member } from "@/lib/ideas/types"

/** undefined while the session is loading, null when signed out. */
export function useMember() {
  const [member, setMember] = useState<Member | null>()
  useEffect(() => {
    let current = true
    ideas
      .member()
      .then((value) => current && setMember(value))
      .catch(() => current && setMember(null))
    return () => {
      current = false
    }
  }, [])
  return member
}

/** The page's path and query once mounted, so links built from it match the static HTML first. */
export function useCurrentPath(fallback: string) {
  const [path, setPath] = useState(fallback)
  useEffect(() => setPath(`${window.location.pathname}${window.location.search}`), [])
  return path
}

"use client"
import { useEffect } from "react"

// The single Memo page these anchors belonged to became the Memo section; released READMEs still link them.
const moved: Record<string, string> = {
  "try-it-with-your-agent": "installation",
  "before-you-start": "installation",
  "install-memo": "installation",
  "add-your-notes": "notes#add-a-folder",
  "choose-a-folder": "notes#add-a-folder",
  "files-memo-can-read": "notes#files-memo-can-read",
  "import-the-folder-you-choose": "notes#add-a-folder",
  "find-something-in-your-files": "notes#find-your-notes",
  "create-your-own-notes": "notes#write-your-own-notes",
  "read-edit-and-remove-a-note": "notes#read-edit-and-remove-a-note",
  "export-your-notes-to-files": "notes#save-your-notes-as-files",
  "tag-your-sources": "tags",
  "find-and-remove-labels": "tags#find-things-by-tag",
  "ask-for-the-context-you-need": "people#everything-about-a-person",
  "keep-conclusions-and-review-proposals": "memories",
  "add-email": "mail",
  "check-the-result": "troubleshooting",
  "if-something-is-missing": "troubleshooting",
}

export function MemoAnchorRedirect({ lang }: { lang: string }) {
  useEffect(() => {
    const follow = () => {
      const target = moved[window.location.hash.slice(1)]
      if (target) window.location.replace(`/${lang}/docs/memo/${target}`)
    }
    follow()
    window.addEventListener("hashchange", follow)
    return () => window.removeEventListener("hashchange", follow)
  }, [lang])
  return null
}

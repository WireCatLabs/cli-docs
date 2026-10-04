"use client"

import type { SharedProps } from "fumadocs-ui/components/dialog/search"
import { i18nProvider } from "fumadocs-ui/i18n"
import { RootProvider } from "fumadocs-ui/provider/next"
import dynamic from "next/dynamic"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { translations } from "@/lib/layout.shared"

const SearchDialog = dynamic(() => import("@/components/search"), { ssr: false })

function DeferredSearch(props: SharedProps) {
  const [opened, setOpened] = useState(false)
  const previous = useRef(false)
  const trigger = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (props.open && !previous.current) {
      trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setOpened(true)
    } else if (!props.open && previous.current && trigger.current?.isConnected) trigger.current.focus()
    previous.current = props.open
  }, [props.open])
  return opened || props.open ? <SearchDialog {...props} /> : null
}

export function DocsProvider({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <RootProvider i18n={i18nProvider(translations, lang)} search={{ SearchDialog: DeferredSearch }}>
      {children}
    </RootProvider>
  )
}

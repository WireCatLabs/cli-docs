"use client"

import { useEffect, useState } from "react"
import { copyFeedbackEvent } from "@/lib/copy-feedback"
import styles from "./copy-feedback.module.css"

const messages = {
  en: { copied: "Copied. Paste it where you need it.", failed: "Copy failed. Select the text and copy it manually." },
  ru: {
    copied: "Скопировано. Вставьте текст там, где он нужен.",
    failed: "Не удалось скопировать. Выделите текст и скопируйте вручную.",
  },
  es: {
    copied: "Copiado. Pégalo donde lo necesites.",
    failed: "No se pudo copiar. Selecciona el texto y cópialo manualmente.",
  },
}

export function CopyFeedback({ lang }: { lang: string }) {
  const [message, setMessage] = useState("")
  const [sequence, setSequence] = useState(0)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const notify = (event: Event) => {
      const words = messages[lang as keyof typeof messages] ?? messages.en
      setMessage((event as CustomEvent<boolean>).detail ? words.copied : words.failed)
      setSequence((value) => value + 1)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(""), 2800)
    }
    window.addEventListener(copyFeedbackEvent, notify)
    return () => {
      window.removeEventListener(copyFeedbackEvent, notify)
      clearTimeout(timer)
    }
  }, [lang])
  return (
    <div
      className={`${styles.toast} ${message ? styles.visible : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-copy-feedback
    >
      <span key={sequence}>{message}</span>
    </div>
  )
}

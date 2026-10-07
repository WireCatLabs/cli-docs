"use client"

import { useState } from "react"
import { locator, searchDemo } from "@/lib/search-playground/engine"

const copy = {
  en: {
    button: "Prepare the meeting brief",
    title: "Atlas project · meeting brief",
    deadline: "Invoice deadline: Friday, October 9.",
    next: "The final invoice will be sent after the review.",
    context: "Tuesday was too early: the client needs time to review.",
    sources: "Messages behind the brief",
    note: "Built-in sample conversation. Everything runs in this browser; no account or AI service is connected.",
  },
  ru: {
    button: "Подготовить встречу",
    title: "Проект Atlas · подготовка к встрече",
    deadline: "Срок по счёту: пятница, 9 октября.",
    next: "Итоговый счёт отправят после проверки.",
    context: "Вторник оказался слишком ранним сроком: клиенту нужно время на проверку.",
    sources: "Сообщения-источники",
    note: "Встроенная переписка для демонстрации. Всё работает в браузере, без аккаунта и обращения к ИИ-сервису.",
  },
  es: {
    button: "Preparar la reunión",
    title: "Proyecto Atlas · resumen para la reunión",
    deadline: "Fecha de la factura: viernes, 9 de octubre.",
    next: "La factura final se enviará después de la revisión.",
    context: "El martes era demasiado pronto: el cliente necesita tiempo para revisar.",
    sources: "Mensajes del resumen",
    note: "Conversación de muestra integrada. Todo funciona en el navegador, sin cuenta ni servicio de IA.",
  },
}

export function MeetingBriefDemo({ lang = "en" }: { lang?: string }) {
  const words = copy[lang as keyof typeof copy] ?? copy.en
  const [hits, setHits] = useState<ReturnType<typeof searchDemo> | null>(null)
  return (
    <section className="meeting-brief-demo my-6 rounded-xl border bg-fd-card p-5" aria-label={words.title}>
      <p>{words.note}</p>
      <button
        type="button"
        className="mt-3 rounded-lg bg-fd-primary px-4 py-3 font-semibold text-fd-primary-foreground"
        onClick={() => setHits(searchDemo('chat:"Atlas project" AND ("deadline confirmed" OR "final invoice")'))}
      >
        {words.button}
      </button>
      <div aria-live="polite" className="mt-5">
        {hits && (
          <>
            <h3>{words.title}</h3>
            <ul>
              <li>{words.deadline}</li>
              <li>{words.next}</li>
              <li>{words.context}</li>
            </ul>
            <p className="font-semibold">{words.sources}</p>
            {hits.map(({ message }) => (
              <blockquote key={message.id}>
                <p lang="en">{message.text}</p>
                <code>{locator(message)}</code>
              </blockquote>
            ))}
          </>
        )}
      </div>
    </section>
  )
}

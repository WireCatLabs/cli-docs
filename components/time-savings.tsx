"use client"

import { useId, useState } from "react"
import { defaultTimings, estimateTime, type Timings } from "@/lib/time-savings"

const copy = {
  ru: {
    title: "Сколько времени можно вернуть",
    intro: "Подставьте свой объём переписки и сравните ручной разбор с работой через агента.",
    inputs: ["Сообщений в день", "Активных чатов в день", "Ответов в день"],
    assumptions: "Как считаем — измените под себя",
    timing: [
      "Чтение сообщения вручную, сек",
      "Поиск контекста на чат, сек",
      "Написание ответа вручную, мин",
      "Чтение сводки агента в день, мин",
      "Проверка контекста на чат, сек",
      "Проверка черновика ответа, мин",
    ],
    saving: "Можно освободить",
    day: "мин в день",
    month: "ч в месяц",
    monthly: "При 22 рабочих днях",
    manual: "Вручную",
    assisted: "С агентом",
    minutes: "мин",
    slower: "При этих условиях быстрее вручную",
    difference: "На",
    quality: "Ответ с контекстом",
    qualityText:
      "Агент находит прошлые договорённости и готовит черновик. Вы проверяете исходные сообщения и решаете, что отправить.",
    note: "Это расчёт по вашим допущениям, а не замер скорости или точности. Время установки и загрузки истории не включено.",
  },
  en: {
    title: "How much time could you get back?",
    intro: "Enter your daily chat activity and compare manual work with working through your agent.",
    inputs: ["Messages per day", "Active chats per day", "Replies per day"],
    assumptions: "How we calculate — make it yours",
    timing: [
      "Read a message manually, sec",
      "Find context per chat, sec",
      "Write a reply manually, min",
      "Read the agent’s daily summary, min",
      "Check context per chat, sec",
      "Review a drafted reply, min",
    ],
    saving: "Time you could free up",
    day: "min per day",
    month: "hours per month",
    monthly: "Based on 22 working days",
    manual: "Manually",
    assisted: "With your agent",
    minutes: "min",
    slower: "Manual work is faster with these assumptions",
    difference: "By",
    quality: "Reply with the context",
    qualityText:
      "Your agent finds earlier agreements and drafts a reply. You check the source messages and decide what to send.",
    note: "An estimate using your assumptions, not a speed or accuracy benchmark. Setup and history downloads are excluded.",
  },
  es: {
    title: "¿Cuánto tiempo podrías recuperar?",
    intro: "Introduce tu actividad diaria y compara el trabajo manual con el trabajo a través de tu agente.",
    inputs: ["Mensajes al día", "Chats activos al día", "Respuestas al día"],
    assumptions: "Cómo calculamos: ajústalo a tu caso",
    timing: [
      "Leer un mensaje a mano, seg",
      "Buscar contexto por chat, seg",
      "Escribir una respuesta a mano, min",
      "Leer el resumen diario del agente, min",
      "Revisar contexto por chat, seg",
      "Revisar un borrador de respuesta, min",
    ],
    saving: "Tiempo que podrías recuperar",
    day: "min al día",
    month: "horas al mes",
    monthly: "Con 22 días laborables",
    manual: "A mano",
    assisted: "Con tu agente",
    minutes: "min",
    slower: "Con estos valores, a mano es más rápido",
    difference: "Por",
    quality: "Responde con el contexto",
    qualityText:
      "Tu agente encuentra acuerdos anteriores y prepara un borrador. Tú revisas los mensajes originales y decides qué enviar.",
    note: "Estimación basada en tus valores, no una medición de velocidad o precisión. No incluye instalación ni descarga del historial.",
  },
}
const timingKeys = Object.keys(defaultTimings) as (keyof Timings)[]

export function TimeSavings({ lang }: { lang: string }) {
  const id = useId()
  const text = copy[lang as keyof typeof copy] ?? copy.en
  const [volume, setVolume] = useState([200, 12, 6])
  const [timings, setTimings] = useState(defaultTimings)
  const result = estimateTime(volume[0], volume[1], volume[2], timings)
  const number = (value: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(value)
  const saving = result.saved >= 0
  return (
    <section id="time-savings" className="savings-section">
      <div className="wrap">
        <h2 className="big">{text.title}</h2>
        <p className="intro">{text.intro}</p>
        <div className="savings-grid">
          <div className="savings-controls">
            {volume.map((value, index) => (
              <div className="savings-control" key={text.inputs[index]}>
                <label htmlFor={`${id}-volume-${index}`}>
                  {text.inputs[index]} <output>{number(value)}</output>
                </label>
                <input
                  id={`${id}-volume-${index}`}
                  type="range"
                  min={0}
                  max={[1000, 50, 50][index]}
                  step={index === 0 ? 10 : 1}
                  value={value}
                  onChange={(event) =>
                    setVolume(volume.map((current, i) => (i === index ? Number(event.target.value) : current)))
                  }
                />
              </div>
            ))}
            <details className="savings-assumptions">
              <summary>{text.assumptions}</summary>
              <div className="savings-timings">
                {timingKeys.map((key, index) => (
                  <label key={key} htmlFor={`${id}-${key}`}>
                    <span>{text.timing[index]}</span>
                    <input
                      id={`${id}-${key}`}
                      type="number"
                      min={0}
                      max={120}
                      step={0.5}
                      value={timings[key]}
                      onChange={(event) =>
                        setTimings({ ...timings, [key]: Math.min(120, Math.max(0, Number(event.target.value))) })
                      }
                    />
                  </label>
                ))}
              </div>
            </details>
          </div>
          <div className="savings-result" aria-live="polite" aria-atomic="true">
            <p className="savings-label">{saving ? text.saving : text.slower}</p>
            <p className="savings-total">
              <strong>
                {saving ? "≈" : `${text.difference} `}
                {number(Math.abs(result.saved))}
              </strong>{" "}
              <span>{text.day}</span>
            </p>
            {saving && (
              <p className="savings-month">
                ≈{number(result.monthlyHours)} {text.month} <small>{text.monthly}</small>
              </p>
            )}
            <dl className="savings-comparison">
              <div>
                <dt>{text.manual}</dt>
                <dd>
                  {number(result.manual)} {text.minutes}
                </dd>
              </div>
              <div>
                <dt>{text.assisted}</dt>
                <dd>
                  {number(result.assisted)} {text.minutes}
                </dd>
              </div>
            </dl>
            <p className="savings-quality">
              <b>{text.quality}</b>
              {text.qualityText}
            </p>
          </div>
        </div>
        <p className="savings-note">{text.note}</p>
      </div>
    </section>
  )
}

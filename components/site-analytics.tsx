"use client"

import type { PostHog } from "posthog-js"
import { useEffect, useState } from "react"
import {
  analyticsEnabled,
  applyConsent,
  openConsentEvent,
  posthogOptions,
  startConsentedFeatures,
} from "@/lib/analytics"
import { enableSiteEvents } from "@/lib/site-events"
import siteConfig from "@/site.config.json"
import styles from "./site-analytics.module.css"

const words = {
  en: {
    label: "Analytics choice",
    text: "We count visits without cookies. May we also remember your device and record sessions, with all text hidden, to improve the site?",
    privacy: "Privacy",
    accept: "Accept",
    decline: "Decline",
  },
  ru: {
    label: "Выбор аналитики",
    text: "Мы считаем посещения без cookie. Разрешите также запоминать ваше устройство и записывать сессии со скрытым текстом, чтобы улучшать сайт?",
    privacy: "Конфиденциальность",
    accept: "Разрешить",
    decline: "Отказаться",
  },
  es: {
    label: "Elección de analítica",
    text: "Contamos las visitas sin cookies. ¿Podemos también recordar tu dispositivo y grabar sesiones, con todo el texto oculto, para mejorar el sitio?",
    privacy: "Privacidad",
    accept: "Aceptar",
    decline: "Rechazar",
  },
}

export function SiteAnalytics({ lang }: { lang: string }) {
  const [posthog, setPosthog] = useState<PostHog>()
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    if (!analyticsEnabled(window.location.hostname)) return
    let cancelled = false
    const load = async () => {
      try {
        const { default: client } = await import("posthog-js")
        if (cancelled) return
        client.init(siteConfig.analytics.posthogKey, posthogOptions)
        startConsentedFeatures(client)
        enableSiteEvents(client)
        setPosthog(client)
        setBannerOpen(client.get_explicit_consent_status() === "pending")
      } catch {}
    }
    const idle = window.requestIdleCallback?.(() => void load()) ?? window.setTimeout(() => void load(), 1)
    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
    }
  }, [])

  useEffect(() => {
    if (!posthog) return
    const open = () => setBannerOpen(true)
    window.addEventListener(openConsentEvent, open)
    return () => window.removeEventListener(openConsentEvent, open)
  }, [posthog])

  if (!posthog || !bannerOpen) return null
  const copy = words[lang as keyof typeof words] ?? words.en
  const choose = (accepted: boolean) => {
    applyConsent(posthog, accepted)
    setBannerOpen(false)
  }
  return (
    <section className={styles.banner} aria-label={copy.label} data-consent-banner>
      <p>
        {copy.text}{" "}
        <a href={`/${lang}/privacy`} className={styles.link}>
          {copy.privacy}
        </a>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => choose(true)}>
          {copy.accept}
        </button>
        <button type="button" className={styles.button} onClick={() => choose(false)}>
          {copy.decline}
        </button>
      </div>
    </section>
  )
}

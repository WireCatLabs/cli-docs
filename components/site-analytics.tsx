"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import siteConfig from "@/site.config.json"

const { yandexMetrikaId, googleMeasurementId } = siteConfig.analytics
const siteHostname = new URL(siteConfig.url).hostname

type MetrikaWindow = Window & {
  ym?: (id: number, method: string, url: string, options: { referer: string; title: string }) => void
}

export function SiteAnalytics() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)
  const [metrikaReady, setMetrikaReady] = useState(false)
  const previousUrl = useRef<string | undefined>(undefined)

  useEffect(() => {
    setEnabled(window.location.hostname === siteHostname)
  }, [])

  useEffect(() => {
    if (!enabled || !metrikaReady) return
    const url = new URL(pathname, siteConfig.url).href
    if (previousUrl.current === url) return
    ;(window as MetrikaWindow).ym?.(yandexMetrikaId, "hit", url, {
      referer: previousUrl.current ?? document.referrer,
      title: document.title,
    })
    previousUrl.current = url
  }, [enabled, metrikaReady, pathname])

  return (
    <>
      {enabled && (
        <>
          <Script id="wirecat-metrika" strategy="afterInteractive" onReady={() => setMetrikaReady(true)}>
            {`(function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
              k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${yandexMetrikaId}','ym');
            ym(${yandexMetrikaId},'init',{ssr:true,defer:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
          </Script>
          <Script
            id="wirecat-google-tag"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="wirecat-google-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${googleMeasurementId}');`}
          </Script>
        </>
      )}
      <noscript>
        <div>
          {/* biome-ignore lint/performance/noImgElement: Metrika needs the original pixel request without image optimization. */}
          <img
            src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
            width="1"
            height="1"
          />
        </div>
      </noscript>
    </>
  )
}

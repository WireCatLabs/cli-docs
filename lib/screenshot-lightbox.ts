export type LightboxWords = { previous: string; next: string; close: string }

const icon = (path: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`

/**
 * Every `button[data-lightbox-item]` inside a `[data-lightbox]` group opens one shared dialog that cycles through
 * that group's shots. The trigger holds the themed images and sits in a figure whose figcaption is the caption.
 */
export function bindScreenshotLightbox(root: HTMLElement, words: LightboxWords, signal: AbortSignal) {
  for (const group of root.querySelectorAll<HTMLElement>("[data-lightbox]")) {
    const items = [...group.querySelectorAll<HTMLButtonElement>("button[data-lightbox-item]")]
    if (!items.length) continue
    const dialog = document.createElement("dialog")
    dialog.className = "shot-lightbox"
    dialog.innerHTML = `<figure class="desktop-shot"><div class="desktop-shot-frame"></div><figcaption><span class="shot-lightbox-caption"></span><span class="shot-lightbox-position" aria-live="polite"></span></figcaption></figure><div class="shot-lightbox-controls"><button type="button" class="shot-lightbox-step" data-step="-1">${icon("m15 18-6-6 6-6")}</button><button type="button" class="shot-lightbox-step" data-step="1">${icon("m9 18 6-6-6-6")}</button><button type="button" class="shot-lightbox-close">${icon("M18 6 6 18M6 6l12 12")}<span></span></button></div>`
    const [previous, next] = dialog.querySelectorAll<HTMLButtonElement>(".shot-lightbox-step")
    previous.setAttribute("aria-label", words.previous)
    next.setAttribute("aria-label", words.next)
    const close = dialog.querySelector<HTMLButtonElement>(".shot-lightbox-close")
    const closeLabel = close?.querySelector("span")
    if (closeLabel) closeLabel.textContent = words.close
    if (items.length === 1) for (const button of [previous, next]) button.hidden = true
    group.append(dialog)
    const frame = dialog.querySelector<HTMLElement>(".desktop-shot-frame")
    const caption = dialog.querySelector<HTMLElement>(".shot-lightbox-caption")
    const position = dialog.querySelector<HTMLElement>(".shot-lightbox-position")
    let current = 0
    const show = (index: number) => {
      current = (index + items.length) % items.length
      const item = items[current]
      const text = item.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? ""
      if (frame)
        frame.replaceChildren(
          ...[...item.querySelectorAll("img")].map((image) => {
            const copy = image.cloneNode() as HTMLImageElement
            copy.loading = "eager"
            // A screen not yet captured in this language falls back to the English shot, as the page does.
            copy.addEventListener("error", () => {
              const english = copy.src.replace(/-(?:ru|es)\.webp$/, "-en.webp")
              if (english !== copy.src) copy.src = english
            })
            return copy
          }),
        )
      if (caption) caption.textContent = text
      if (position) position.textContent = `${current + 1} / ${items.length}`
      dialog.setAttribute("aria-label", text)
    }
    for (const [index, item] of items.entries())
      item.addEventListener(
        "click",
        () => {
          show(index)
          dialog.showModal()
        },
        { signal },
      )
    previous.addEventListener("click", () => show(current - 1), { signal })
    next.addEventListener("click", () => show(current + 1), { signal })
    close?.addEventListener("click", () => dialog.close(), { signal })
    dialog.addEventListener(
      "click",
      (event) => {
        if (event.target === dialog) dialog.close()
      },
      { signal },
    )
    dialog.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault()
          show(current + (event.key === "ArrowLeft" ? -1 : 1))
        }
      },
      { signal },
    )
    let startX: number | undefined
    dialog.addEventListener(
      "pointerdown",
      (event) => {
        startX = event.isPrimary ? event.clientX : undefined
      },
      { signal },
    )
    dialog.addEventListener(
      "pointerup",
      (event) => {
        if (startX === undefined || event.pointerType === "mouse") return
        const distance = event.clientX - startX
        if (Math.abs(distance) > 48) show(current + (distance > 0 ? -1 : 1))
        startX = undefined
      },
      { signal },
    )
    // Focus lands on the shot the reader was looking at, which may not be the one they opened.
    dialog.addEventListener("close", () => items[current].focus(), { signal })
    signal.addEventListener("abort", () => dialog.remove())
  }
}

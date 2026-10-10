/** Native details menus share dismissal and focus return on every surface. */
export function bindDisclosureMenus(root: HTMLElement, selector: string, signal: AbortSignal) {
  const menus = [...root.querySelectorAll<HTMLDetailsElement>(selector)]
  for (const menu of menus)
    menu.addEventListener(
      "toggle",
      () => {
        if (menu.open) {
          for (const other of menus) if (other !== menu) other.open = false
          const options = menu.querySelector<HTMLElement>(".language-options")
          if (options) {
            const rect = menu.getBoundingClientRect()
            menu.dataset.placement =
              rect.bottom + options.offsetHeight + 6 > innerHeight && rect.top > options.offsetHeight + 6
                ? "above"
                : "below"
          }
        }
      },
      { signal },
    )
  document.addEventListener(
    "click",
    (event) => {
      for (const menu of menus)
        if (menu.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false
    },
    { signal },
  )
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return
      const menu = menus.find((item) => item.open)
      if (!menu) return
      menu.open = false
      menu.querySelector<HTMLElement>("summary")?.focus()
      event.preventDefault()
      event.stopPropagation()
    },
    { signal },
  )
}

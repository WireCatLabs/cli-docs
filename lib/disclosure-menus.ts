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
          fitPanel(menu)
        }
      },
      { signal },
    )
  addEventListener(
    "resize",
    () => {
      for (const menu of menus) if (menu.open) fitPanel(menu)
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

// The panel's CSS anchors it to one side of its button, but where the button lands depends on the page
// and the width, so the panel can run past the screen or a parent that clips overflow.
function fitPanel(menu: HTMLDetailsElement) {
  const panel = menu.querySelector<HTMLElement>(".connect-panel")
  if (!panel) return
  panel.style.translate = ""
  const gutter = 16
  let min = gutter
  let max = innerWidth - gutter
  for (let node = menu.parentElement; node; node = node.parentElement) {
    if (getComputedStyle(node).overflowX === "visible") continue
    const box = node.getBoundingClientRect()
    min = Math.max(min, box.left)
    max = Math.min(max, box.right)
  }
  const rect = panel.getBoundingClientRect()
  let shift = 0
  if (rect.right > max) shift = max - rect.right
  if (rect.left + shift < min) shift = min - rect.left
  if (shift) panel.style.translate = `${Math.round(shift)}px 0`
}

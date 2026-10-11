const theme = document.querySelector(".theme-switch")
function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark)
  theme?.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`)
}
try { setTheme(localStorage.getItem("wirecat-next-theme") === "dark") } catch {}
theme?.addEventListener("click", () => {
  const dark = !document.documentElement.classList.contains("dark")
  setTheme(dark)
  try { localStorage.setItem("wirecat-next-theme", dark ? "dark" : "light") } catch {}
})
const demo = document.querySelector(".example")
const tabs = Array.from(document.querySelectorAll("[data-example]"))
function selectExample(id, focus = false) {
  tabs.forEach(tab => {
    const active = tab.dataset.example === id
    tab.setAttribute("aria-selected", String(active))
    tab.tabIndex = active ? 0 : -1
    if (active && focus) tab.focus()
  })
  demo?.querySelectorAll(".example-panel").forEach(panel => { panel.hidden = !panel.id.endsWith(`-panel-${id}`) })
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectExample(tab.dataset.example))
  tab.addEventListener("keydown", event => {
    let next
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = tabs.length - 1
    if (next !== undefined) { event.preventDefault(); selectExample(tabs[next].dataset.example, true) }
  })
})
document.querySelectorAll("[data-jump-example]").forEach(button => {
  button.addEventListener("click", () => {
    selectExample(button.dataset.jumpExample)
    demo?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block:"start"})
  })
})
let toastTimer
function notify(message) {
  const toast = document.querySelector(".toast")
  if (!toast) return
  toast.textContent = message
  toast.classList.add("visible")
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400)
}
document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(button.dataset.copy); notify(button.id === "copy-install" ? "Installation command copied" : "Request copied") }
    catch { notify("Clipboard unavailable. Select the text and copy it manually.") }
  })
})
document.querySelectorAll("[data-provider]").forEach(button => {
  button.addEventListener("click", () => {
    const command = `npm i -g @wirecat/${button.dataset.provider}-cli`
    document.querySelectorAll("[data-provider]").forEach(tab => tab.setAttribute("aria-pressed", String(tab === button)))
    document.querySelector("#install-command").textContent = command
    document.querySelector("#copy-install").dataset.copy = command
  })
})

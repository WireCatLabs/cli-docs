const notify = (text) => {
  const toast = document.querySelector(".toast")
  if (!toast) return
  toast.textContent = text
  toast.classList.add("visible")
  clearTimeout(notify.timer)
  notify.timer = setTimeout(() => toast.classList.remove("visible"), 2400)
}

const themeButton = document.querySelector(".theme-toggle")
const setTheme = (dark) => {
  document.documentElement.classList.toggle("dark", dark)
  themeButton?.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`)
}
try { setTheme(localStorage.getItem("wirecat-preview-theme") === "dark") } catch {}
themeButton?.addEventListener("click", () => {
  const dark = !document.documentElement.classList.contains("dark")
  setTheme(dark)
  try { localStorage.setItem("wirecat-preview-theme", dark ? "dark" : "light") } catch {}
})
document.querySelector("#variant")?.addEventListener("change", (event) => {
  window.location.assign(`/${event.target.value}`)
})

function selectCase(demo, key, focus = false) {
  demo.querySelectorAll("[data-case]").forEach((tab) => {
    const selected = tab.dataset.case === key
    tab.setAttribute("aria-selected", String(selected))
    tab.tabIndex = selected ? 0 : -1
    if (selected && focus) tab.focus()
  })
  demo.querySelectorAll(".demo-panel").forEach((panel) => { panel.hidden = panel.id !== `panel-${key}` })
}
document.querySelectorAll(".demo").forEach((demo) => {
  const tabs = Array.from(demo.querySelectorAll("[data-case]"))
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCase(demo, tab.dataset.case))
    tab.addEventListener("keydown", (event) => {
      let next
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length
      if (event.key === "Home") next = 0
      if (event.key === "End") next = tabs.length - 1
      if (next !== undefined) { event.preventDefault(); selectCase(demo, tabs[next].dataset.case, true) }
    })
  })
})
document.querySelectorAll("[data-show-case]").forEach((button) => {
  button.addEventListener("click", () => {
    const demo = document.querySelector(".audience-demo .demo")
    selectCase(demo, button.dataset.showCase)
    document.querySelector("#audience-demo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })
  })
})

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy)
      const label = button.getAttribute("aria-label") ?? button.textContent
      button.setAttribute("aria-label", "Copied")
      if (!button.querySelector("svg")) button.textContent = "Copied"
      notify(button.id === "copy-install" ? "Installation command copied" : "Request copied")
      setTimeout(() => {
        button.setAttribute("aria-label", label)
        if (!button.querySelector("svg")) button.textContent = label
      }, 1800)
    } catch { notify("Clipboard unavailable. Select the command or request and copy it manually.") }
  })
})
document.querySelectorAll("[data-install]").forEach((button) => {
  button.addEventListener("click", () => {
    const provider = button.dataset.install
    const command = `npm i -g @wirecat/${provider}-cli`
    document.querySelectorAll("[data-install]").forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)))
    document.querySelector("#install-command").textContent = command
    document.querySelector("#copy-install").dataset.copy = command
    document.querySelector(".install-description").textContent = `${provider} connects your ${provider === "tg" ? "Telegram" : "MAX"} account to your terminal and agent.`
    document.querySelector(".install-guide").href = `https://wirecat.dev/en/docs/installation#${provider}`
  })
})

const stageTabs = Array.from(document.querySelectorAll("[data-stage]"))
function selectStage(index, focus = false) {
  stageTabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index))
    tab.tabIndex = i === index ? 0 : -1
    if (i === index && focus) tab.focus()
    document.querySelector(`#workflow-${tab.dataset.stage}`).hidden = i !== index
  })
}
stageTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStage(index))
  tab.addEventListener("keydown", (event) => {
    let next
    if (event.key === "ArrowRight") next = (index + 1) % stageTabs.length
    if (event.key === "ArrowLeft") next = (index + stageTabs.length - 1) % stageTabs.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = stageTabs.length - 1
    if (next !== undefined) { event.preventDefault(); selectStage(next, true) }
  })
})

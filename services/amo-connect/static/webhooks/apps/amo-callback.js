// The Redirect URI of the integration amoCRM's button creates, so amoCRM lands here and the browser goes on to
// amo's local port, which amo put in front of the state. The code is useless without the integration's secret key,
// which only amo claims. A file, not an inline script, so the page's CSP can refuse inline code.
const params = new URLSearchParams(location.search)
history.replaceState(null, "", location.pathname)
const state = params.get("state") ?? ""
const port = Number(state.split(".")[0])
const status = document.getElementById("status")
const showManual = () => {
  document.getElementById("answer").textContent = params.toString()
  document.getElementById("manual").hidden = false
}
const local = Number.isInteger(port) && port >= 1024 && port <= 65535
if (local && (params.has("code") || params.has("error"))) {
  location.replace(`http://127.0.0.1:${port}/callback?${params}`)
  setTimeout(showManual, 3000)
} else if (params.has("error")) {
  status.textContent = `amoCRM did not sign you in: ${params.get("error_description") ?? params.get("error")}`
} else if (params.has("code")) {
  status.textContent = "amoCRM signed you in."
  showManual()
} else {
  status.textContent =
    "This page finishes an amoCRM sign-in for amo. Start one with " +
    "amo <profile> session start --host <your account> --one-click."
}

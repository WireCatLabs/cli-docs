// A static site has no server to read Accept-Language, so the first page picks the language here.
;(() => {
  const languages = ["en", "ru", "es"]
  const wanted = (navigator.languages || [navigator.language]).map((tag) => (tag || "").slice(0, 2).toLowerCase())
  location.replace(`/${wanted.find((code) => languages.includes(code)) ?? "en"}`)
})()

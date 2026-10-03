// Wallpaper tiles for the thread variants. Paths only: an SVG data URI cannot load web fonts.
window.WirePatterns = (() => {
  const wrap = (size, ink, body, width = 2) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body.replaceAll("INK", ink)}</svg>`

  const tiles = {
    doodles: {
      label: "Doodles",
      size: 220,
      body: `<path d="M22 40l40-16-12 40-9-14z"/><path d="M41 50l21-26"/>
        <path d="M140 24h46a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10h-30l-12 10v-10h-4a10 10 0 0 1-10-10V34a10 10 0 0 1 10-10z"/>
        <path d="M30 140l10-14 10 14m16 0l10-14 10 14M28 140c0 22 50 22 50 0"/>
        <path d="M150 130l6 18h19l-15 11 6 18-16-11-16 11 6-18-15-11h19z"/>
        <path d="M96 96c8-8 20-8 28 0m-20 6c4-4 8-4 12 0"/><circle cx="110" cy="110" r="2"/>
        <path d="M180 190h22m-11-11v22"/><path d="M90 196c6-10 14-10 20 0s14 10 20 0"/>`,
    },
    wires: {
      label: "Wires",
      size: 240,
      body: `<path d="M-10 40c40 0 40 50 80 50s40-50 80-50 40 50 80 50 40-50 30-50"/>
        <path d="M-10 160c40 0 40 50 80 50s40-50 80-50 40 50 80 50"/>
        <rect x="64" y="84" width="14" height="12" rx="2"/><path d="M68 84v-5m6 5v-5"/>
        <rect x="150" y="204" width="14" height="12" rx="2"/><path d="M154 216v5m6-5v5"/>
        <circle cx="200" cy="120" r="5"/><circle cx="30" cy="120" r="2"/>`,
    },
    ticks: {
      label: "Read ticks",
      size: 120,
      body: `<path d="M14 30l6 6 12-14M24 36l1 1 12-14"/><path d="M74 90l6 6 12-14M84 96l1 1 12-14"/>
        <circle cx="90" cy="30" r="1.6"/><circle cx="30" cy="90" r="1.6"/>`,
    },
    prompts: {
      label: "Prompts",
      size: 200,
      body: `<path d="M20 30l12 10-12 10M40 52h16"/>
        <path d="M128 22v40M140 30c-4-6-22-6-22 4s22 6 22 16-18 10-22 4"/>
        <path d="M44 120c-8 0-8 6-8 12s-6 8-6 8 6 2 6 8 0 12 8 12M76 120c8 0 8 6 8 12s6 8 6 8-6 2-6 8 0 12-8 12"/>
        <path d="M130 150l6 6 12-14M140 156l1 1 12-14"/>
        <path d="M160 92h20"/>`,
    },
    bubbles: {
      label: "Bubbles",
      size: 180,
      body: `<path d="M20 26h48a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H40l-10 9v-9h-10a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8z"/>
        <path d="M160 116h-40a8 8 0 0 0-8 8v12a8 8 0 0 0 8 8h22l9 8v-8h9a8 8 0 0 0 8-8v-12a8 8 0 0 0-8-8z"/>
        <path d="M30 42h30M30 50h18M124 128h24M124 136h12"/>`,
    },
    paws: {
      label: "Paws",
      size: 200,
      body: `<g transform="translate(40 50) rotate(-20)"><ellipse cx="0" cy="8" rx="9" ry="7"/><circle cx="-11" cy="-6" r="3.5"/><circle cx="-4" cy="-12" r="3.5"/><circle cx="4" cy="-12" r="3.5"/><circle cx="11" cy="-6" r="3.5"/></g>
        <g transform="translate(140 150) rotate(25)"><ellipse cx="0" cy="8" rx="9" ry="7"/><circle cx="-11" cy="-6" r="3.5"/><circle cx="-4" cy="-12" r="3.5"/><circle cx="4" cy="-12" r="3.5"/><circle cx="11" cy="-6" r="3.5"/></g>
        <path d="M150 40h28m-14-14v28" opacity="0.6"/>`,
    },
    waves: {
      label: "Voice waves",
      size: 160,
      body: `<path d="M10 40v0M18 34v12M26 28v24M34 36v8M42 24v32M50 32v16M58 38v4"/>
        <path d="M90 120v0M98 112v16M106 104v32M114 116v8M122 108v24M130 114v12M138 118v4"/>`,
      width: 2.4,
    },
    marks: {
      label: "Monogram",
      size: 120,
      body: `<path d="M18 46V26l8 8 6-8 6 8 8-8v20"/><path d="M78 106V86l8 8 6-8 6 8 8-8v20"/>`,
    },
    dots: {
      label: "Dots",
      size: 48,
      body: `<circle cx="12" cy="12" r="1.6" fill="INK"/><circle cx="36" cy="36" r="1.6" fill="INK"/>`,
      width: 1.6,
    },
    planes: {
      label: "Paper planes",
      size: 240,
      body: `<path d="M40 60l36-14-10 34-8-12z"/><path d="M58 68l18-22"/>
        <path d="M40 60c-20 10-30 30-20 50" stroke-dasharray="2 8"/>
        <path d="M170 170l30-12-8 28-7-10z"/><path d="M185 176l15-18"/>
        <path d="M170 170c-24 4-40-10-44-30" stroke-dasharray="2 8"/>`,
    },
  }

  const url = (name, ink) => {
    const tile = tiles[name] ?? tiles.doodles
    return `url("data:image/svg+xml,${encodeURIComponent(wrap(tile.size, ink, tile.body, tile.width))}")`
  }

  const apply = (element, name, ink) => {
    const tile = tiles[name] ?? tiles.doodles
    element.style.backgroundImage = url(name, ink)
    element.style.backgroundSize = `${tile.size}px ${tile.size}px`
  }

  return { tiles, url, apply }
})()

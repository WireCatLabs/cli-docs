const shapes = {
  plane: `<path d="M0 0l36-14-10 34-8-12z"/><path d="M18 8l18-22"/><path d="M0 0c-18 8-26 24-18 40" stroke-dasharray="2 8"/>`,
  sleeping: `<path d="M-22 8c0-12 12-18 26-16 12 2 18 8 18 16z"/><path d="M-22 8h44"/><path d="M-18 -2l-2-9 7 5M-10 -7l3-7 3 8"/><path d="M-15 1q2 2 4 0"/><path d="M22 8c5 0 7-6 2-9"/><path d="M26 -16h6l-6 6h6M34 -26h4l-4 4h4"/>`,
}

// Seeded, so every build draws the same tile.
export function wallpaper(ink = "#232a2c", size = 400) {
  let seed = 11
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const spots: [number, number][] = []
  let body = ""
  for (let i = 0; i < 10; i++) {
    let x = 0
    let y = 0
    let tries = 0
    do {
      x = 24 + rnd() * (size - 48)
      y = 24 + rnd() * (size - 48)
      tries++
    } while (tries < 60 && spots.some(([a, b]) => Math.hypot(a - x, b - y) < 92))
    spots.push([x, y])
    const angle = Math.round(rnd() * 70 - 35)
    const scale = (0.55 + rnd() * 0.3).toFixed(2)
    const shape = i % 2 === 0 ? shapes.plane : shapes.sleeping
    body += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${angle}) scale(${scale})">${shape}</g>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: `${size}px ${size}px`,
  }
}

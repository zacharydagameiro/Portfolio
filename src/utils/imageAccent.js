const IMAGE_GLOW_CACHE = new Map()

export const DEFAULT_GLOW_RGB = '148, 163, 184'

const clampRgbChannel = (value) => Math.max(0, Math.min(255, Math.round(value)))
const clampUnit = (value) => Math.max(0, Math.min(1, value))

const rgbToHsl = (r, g, b) => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }

  const lightness = (max + min) / 2
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  return { h: hue, s: saturation, l: lightness }
}

const hslToRgb = (h, s, l) => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const huePrime = ((h % 360) + 360) % 360 / 60
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1))

  let red = 0
  let green = 0
  let blue = 0

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma
    green = x
  } else if (huePrime >= 1 && huePrime < 2) {
    red = x
    green = chroma
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma
    blue = x
  } else if (huePrime >= 3 && huePrime < 4) {
    green = x
    blue = chroma
  } else if (huePrime >= 4 && huePrime < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  const match = l - chroma / 2
  return [(red + match) * 255, (green + match) * 255, (blue + match) * 255]
}

const formatRgb = (r, g, b) => `${clampRgbChannel(r)}, ${clampRgbChannel(g)}, ${clampRgbChannel(b)}`

const enhanceAccentColor = (r, g, b) => {
  const { h, s, l } = rgbToHsl(r, g, b)
  const boostedSaturation = clampUnit(Math.max(0.3, s * 1.1 + 0.02))
  const adjustedLightness = clampUnit(Math.min(0.68, Math.max(0.33, l * 1.02)))
  const [nextR, nextG, nextB] = hslToRgb(h, boostedSaturation, adjustedLightness)
  return formatRgb(nextR, nextG, nextB)
}

export const getImageGlowRgb = (imageUrl) =>
  new Promise((resolve) => {
    if (!imageUrl || typeof document === 'undefined') {
      resolve(null)
      return
    }

    if (IMAGE_GLOW_CACHE.has(imageUrl)) {
      resolve(IMAGE_GLOW_CACHE.get(imageUrl))
      return
    }

    const image = new Image()
    image.decoding = 'async'
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      try {
        const sampleSize = 36
        const canvas = document.createElement('canvas')
        canvas.width = sampleSize
        canvas.height = sampleSize
        const context = canvas.getContext('2d', { willReadFrequently: true })

        if (!context) {
          IMAGE_GLOW_CACHE.set(imageUrl, null)
          resolve(null)
          return
        }

        context.drawImage(image, 0, 0, sampleSize, sampleSize)
        const { data } = context.getImageData(0, 0, sampleSize, sampleSize)

        const getWeightedAverage = (allowExtremeLuma = false) => {
          let red = 0
          let green = 0
          let blue = 0
          let totalWeight = 0

          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3] / 255
            if (alpha < 0.08) continue

            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

            if (!allowExtremeLuma && (luma < 22 || luma > 236)) continue

            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const saturation = max === 0 ? 0 : (max - min) / max
            const weight = 0.28 + saturation * 1.25 + alpha * 0.45

            red += r * weight
            green += g * weight
            blue += b * weight
            totalWeight += weight
          }

          if (totalWeight <= 0) return null

          return formatRgb(red / totalWeight, green / totalWeight, blue / totalWeight)
        }

        const hueBinCount = 30
        const hueBinSize = 360 / hueBinCount
        const hueBins = Array.from({ length: hueBinCount }, () => ({
          weight: 0,
          red: 0,
          green: 0,
          blue: 0,
          sat: 0,
          light: 0,
          count: 0
        }))

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3] / 255
          if (alpha < 0.08) continue

          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const chroma = max - min
          const value = max / 255

          if (chroma < 16 || value < 0.14 || value > 0.95) continue

          const { h, s, l } = rgbToHsl(r, g, b)
          if (s < 0.18 || l < 0.12 || l > 0.86) continue

          const weight = alpha * (0.35 + s * 1.65) * (0.45 + chroma / 255) * (0.55 + Math.min(l, 0.8))
          const binIndex = Math.min(hueBinCount - 1, Math.floor(h / hueBinSize))
          const bin = hueBins[binIndex]

          bin.weight += weight
          bin.red += r * weight
          bin.green += g * weight
          bin.blue += b * weight
          bin.sat += s * weight
          bin.light += l * weight
          bin.count += 1
        }

        let highlightRgb = null
        let bestScore = 0

        hueBins.forEach((bin) => {
          if (bin.weight <= 0 || bin.count < 3) return

          const avgSaturation = bin.sat / bin.weight
          const avgLightness = bin.light / bin.weight
          const score = bin.weight * (0.65 + avgSaturation * 1.6) * (0.72 + avgLightness * 0.8)
          if (score <= bestScore) return

          bestScore = score
          highlightRgb = enhanceAccentColor(bin.red / bin.weight, bin.green / bin.weight, bin.blue / bin.weight)
        })

        const glowRgb = highlightRgb || getWeightedAverage(false) || getWeightedAverage(true)
        IMAGE_GLOW_CACHE.set(imageUrl, glowRgb)
        resolve(glowRgb)
      } catch {
        IMAGE_GLOW_CACHE.set(imageUrl, null)
        resolve(null)
      }
    }

    image.onerror = () => {
      IMAGE_GLOW_CACHE.set(imageUrl, null)
      resolve(null)
    }

    image.src = imageUrl
  })

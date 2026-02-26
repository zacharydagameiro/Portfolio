import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toProjectLink, getProjectLinkText } from '../utils/projectLinks'
import { resolveAssetUrl } from '../utils/assetUrl'

const CATEGORY_LABELS = {
  'ml-ai': 'ML / AI',
  school: 'School',
  bio: 'Bio',
  mini: 'Mini',
  freelance: 'Freelance'
}

const getCategoryIconColorClass = (category) =>
  category === 'ml-ai'
    ? 'text-violet-500'
    : category === 'mini'
      ? 'text-pink-500'
    : category === 'bio'
      ? 'text-emerald-500'
    : category === 'school'
      ? 'text-amber-500'
      : category === 'freelance'
        ? 'text-sky-500'
        : 'text-slate-300'

const ProjectLinkIcon = ({ type, className = 'h-3.5 w-3.5' }) => {
  if (type === 'google') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.6 0 9.3-4 9.3-9.6 0-.6-.1-1.1-.2-1.6H12Z"
        />
        <path
          fill="#34A853"
          d="M2.2 12c0 5.4 4.4 9.8 9.8 9.8 5.6 0 9.3-4 9.3-9.6 0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6Z"
        />
        <path fill="#FBBC05" d="M4.5 7.4 7.7 9.7c.9-1.8 2.5-3 4.3-3 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2c-3.8 0-7.2 2.2-8.8 5.2Z" />
        <path fill="#4285F4" d="M2.2 12c0 1.6.4 3.2 1.3 4.6l3.4-2.6c-.3-.6-.5-1.3-.5-2s.2-1.4.5-2L3.5 7.4A9.5 9.5 0 0 0 2.2 12Z" />
      </svg>
    )
  }

  if (type === 'github') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 0C3.58 0 0 3.58 0 8a8.002 8.002 0 0 0 5.47 7.59c.4.08.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.95-.82-1.15-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.56 7.56 0 0 1 8 3.8c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.002 8.002 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    )
  }

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12A8.25 8.25 0 0 1 12 3.75m0 0A8.25 8.25 0 0 1 20.25 12M12 3.75c2.2 2.12 3.5 5.02 3.5 8.25S14.2 18.13 12 20.25m0-16.5c-2.2 2.12-3.5 5.02-3.5 8.25S9.8 18.13 12 20.25m-7.85-5.25h15.7"
      />
    </svg>
  )
}

const getProjectLinkType = (link, fallbackType) => {
  if (!link || typeof link.url !== 'string') return fallbackType
  const url = link.url.toLowerCase()
  if (/(?:^|\.)google\./.test(url) || /run\.app/.test(url)) return 'google'
  if (url.includes('github.com')) return 'github'
  return fallbackType
}

const IMAGE_GLOW_CACHE = new Map()
const DEFAULT_GLOW_RGB = '148, 163, 184'

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

const getImageGlowRgb = (imageUrl) =>
  new Promise((resolve) => {
    if (!imageUrl) {
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

export function ProjectIcon({ category, className = 'h-4 w-4' }) {
  // Default: folder (general project)
  if (!category) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>
    )
  }

  if (category === 'ml-ai') {
    // Simple \"brain/ML\" style node graph icon
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 6.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm9 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-9 10.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm9 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 9l0 6m9-6 0 6M9.75 7.5h4.5m-4.5 9h4.5"
        />
      </svg>
    )
  }

  if (category === 'school') {
    // Graduation cap
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 3 9.75 5.25L12 13.5 2.25 8.25 12 3Zm0 10.5L5.21 10.01a48.42 48.42 0 0 0-.46 5.489A2.25 2.25 0 0 0 6.99 17.7a23.91 23.91 0 0 0 6.02.8c2.09 0 4.12-.27 6.02-.8a2.25 2.25 0 0 0 2.24-2.201 48.42 48.42 0 0 0-.46-5.489L12 13.5Z"
        />
      </svg>
    )
  }

  if (category === 'freelance') {
    // Briefcase / work icon
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7.5V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1.5m-9 0h12A2.25 2.25 0 0 1 20.25 9.75v7.5A2.25 2.25 0 0 1 18 19.5H6A2.25 2.25 0 0 1 3.75 17.25v-7.5A2.25 2.25 0 0 1 6 7.5Zm3.75 4.5h4.5"
        />
      </svg>
    )
  }

  if (category === 'bio') {
    // Bio / life science icon
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3.75h6m-5.25 0v4.2L5.7 14.58a3 3 0 0 0 2.55 4.67h7.5a3 3 0 0 0 2.55-4.67l-4.05-6.63v-4.2M9 15h6"
        />
      </svg>
    )
  }

  if (category === 'mini') {
    // Sparkle / quick-win project icon
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.75 13.5 8.25 18 9.75 13.5 11.25 12 15.75 10.5 11.25 6 9.75 10.5 8.25 12 3.75Zm6 9.75.75 2.25L21 16.5l-2.25.75L18 19.5l-.75-2.25L15 16.5l2.25-.75L18 13.5Zm-12 0 .75 2.25L9 16.5l-2.25.75L6 19.5l-.75-2.25L3 16.5l2.25-.75L6 13.5Z"
        />
      </svg>
    )
  }

  // Fallback to folder
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  )
}

export default function ProjectCard({ project, listSearch = '' }) {
  const { slug, title, caption, shortDescription, description, year, tags, repoUrl, demoUrl, category, categories, coverImageUrl, featured } = project
  const cardBlurb = shortDescription || description
  const resolvedCoverImageUrl = resolveAssetUrl(coverImageUrl)
  const hasCoverImage = Boolean(resolvedCoverImageUrl)
  const [imageGlowRgb, setImageGlowRgb] = useState(null)
  const demoLink = toProjectLink(demoUrl)
  const repoLink = toProjectLink(repoUrl)

  useEffect(() => {
    let isCanceled = false

    if (!hasCoverImage) {
      setImageGlowRgb(null)
      return () => {
        isCanceled = true
      }
    }

    getImageGlowRgb(resolvedCoverImageUrl).then((glowRgb) => {
      if (isCanceled) return
      setImageGlowRgb(glowRgb || DEFAULT_GLOW_RGB)
    })

    return () => {
      isCanceled = true
    }
  }, [hasCoverImage, resolvedCoverImageUrl])

  const cardStyle = useMemo(() => {
    if (!hasCoverImage) return undefined
    return {
      '--project-glow-rgb': imageGlowRgb || DEFAULT_GLOW_RGB
    }
  }, [hasCoverImage, imageGlowRgb])

  const categoryIcons = (() => {
    const input = []
    if (Array.isArray(categories)) input.push(...categories)
    if (category) input.push(category)

    const normalized = input
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)

    const unique = []
    normalized.forEach((item) => {
      if (!unique.includes(item)) unique.push(item)
    })

    return unique.length > 0 ? unique : [null]
  })()

  return (
    <Link
      to={`/projects/${slug}${listSearch}`}
      style={cardStyle}
      className={`project-card relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-slate-50 p-5 transition hover:-translate-y-0.5 ${
        hasCoverImage ? 'project-card--with-image' : ''
      }`}
    >
      {featured && (
        <span
          className="absolute right-3 top-3 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 bg-amber-100/95 text-amber-700 shadow-sm"
          title="Featured project"
          aria-label="Featured project"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.1 3.385a1 1 0 0 0 .95.69h3.56c.969 0 1.371 1.24.588 1.81l-2.88 2.093a1 1 0 0 0-.364 1.118l1.1 3.386c.3.921-.755 1.688-1.539 1.118l-2.88-2.093a1 1 0 0 0-1.175 0l-2.88 2.093c-.784.57-1.838-.197-1.539-1.118l1.1-3.386a1 1 0 0 0-.364-1.118L2.85 8.812c-.783-.57-.38-1.81.588-1.81h3.56a1 1 0 0 0 .95-.69l1.1-3.385Z" />
          </svg>
        </span>
      )}

      {hasCoverImage && (
        <div className="project-card__media mb-3 overflow-hidden rounded-lg border bg-slate-100">
          <img
            src={resolvedCoverImageUrl}
            alt={`${title} cover`}
            loading="lazy"
            decoding="async"
            className="h-32 w-full object-cover transition duration-200 hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
          {caption && <p className="mt-0.5 text-sm text-slate-500">{caption}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {categoryIcons.map((cat, index) => (
            <span
              key={`${cat || 'default'}-${index}`}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 ${getCategoryIconColorClass(cat)}`}
              title={cat ? CATEGORY_LABELS[cat] || cat : 'General project'}
              aria-label={cat ? CATEGORY_LABELS[cat] || cat : 'General project'}
            >
              <ProjectIcon category={cat} className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 min-h-0 flex-1">
        {cardBlurb ? <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{cardBlurb}</p> : <span className="block" aria-hidden />}
      </div>
      <div className="mt-3 flex shrink-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
          <span className="text-[11px] text-slate-400">{year}</span>
        </div>
        {(demoLink || repoLink) && (
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
            {repoLink && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(repoLink.url, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex min-w-0 max-w-full flex-1 items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                title={getProjectLinkText(repoLink)}
              >
                <ProjectLinkIcon type={getProjectLinkType(repoLink, 'repo')} className="mr-1.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="min-w-0 truncate">{getProjectLinkText(repoLink)}</span>
                <span className="ml-1" aria-hidden>
                  ↗
                </span>
              </button>
            )}
            {demoLink && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(demoLink.url, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex min-w-0 max-w-full flex-1 items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                title={getProjectLinkText(demoLink)}
              >
                <ProjectLinkIcon type={getProjectLinkType(demoLink, 'demo')} className="mr-1.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="min-w-0 truncate">{getProjectLinkText(demoLink)}</span>
                <span className="ml-1" aria-hidden>
                  ↗
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

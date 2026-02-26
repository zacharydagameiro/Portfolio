import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import projectsData from '../data/projects.json'
import { ProjectIcon } from '../components/ProjectCard.jsx'
import { SITE_DESCRIPTION } from '../data/siteMeta'
import { toProjectLink, getProjectLinkText } from '../utils/projectLinks'
import { resolveAssetUrl } from '../utils/assetUrl'

const DEFAULT_TITLE = 'Zachary Gameiro — CS Portfolio'
const DEFAULT_PROJECT_IMAGE = resolveAssetUrl('/profile.jpg')
const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i

const ExternalLinkIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5h6m0 0v6m0-6L10.5 13.5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6H8.25A3.75 3.75 0 0 0 4.5 9.75v6A3.75 3.75 0 0 0 8.25 19.5h6A3.75 3.75 0 0 0 18 15.75V13.5"
    />
  </svg>
)

const SidebarLinkIcon = ({ type, className = 'h-4 w-4' }) => {
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

  if (type === 'repo') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 0C3.58 0 0 3.58 0 8a8.002 8.002 0 0 0 5.47 7.59c.4.08.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.95-.82-1.15-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.56 7.56 0 0 1 8 3.8c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.002 8.002 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    )
  }

  if (type === 'case-study') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 7.5v9A2.25 2.25 0 0 1 17.25 18.75H6.75A2.25 2.25 0 0 1 4.5 16.5v-9A2.25 2.25 0 0 1 6.75 5.25h10.5A2.25 2.25 0 0 1 19.5 7.5Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9h7.5m-7.5 3h7.5m-7.5 3h4.5" />
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

const upsertMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  const existed = Boolean(tag)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  const previousContent = tag.getAttribute('content')
  tag.setAttribute('content', content)
  return { tag, existed, previousContent }
}

export default function ProjectPage() {
  const { slug } = useParams()
  const location = useLocation()
  const backToProjectsUrl = location.search ? `/projects${location.search}` : '/projects'
  const project = projectsData.find((p) => p.slug === slug)
  const metaDescription = project?.valueProp || project?.shortDescription || project?.longDescription || project?.description || SITE_DESCRIPTION
  const metaTitle = project ? `${project.title} | Zachary Gameiro` : DEFAULT_TITLE
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${location.pathname}${location.search}`
      : location.pathname
  const metaImageSource = resolveAssetUrl(project?.coverImageUrl || DEFAULT_PROJECT_IMAGE)
  const metaImage =
    typeof window !== 'undefined' ? new URL(metaImageSource, window.location.origin).href : metaImageSource
  const currentProjectIndex = projectsData.findIndex((p) => p.slug === slug)
  const previousProject = currentProjectIndex > 0 ? projectsData[currentProjectIndex - 1] : null
  const nextProject =
    currentProjectIndex >= 0 && currentProjectIndex < projectsData.length - 1
      ? projectsData[currentProjectIndex + 1]
      : null
  const screenshotsList = Array.isArray(project?.screenshots)
    ? project.screenshots.map((item) => ({
        ...item,
        src: resolveAssetUrl(item?.src),
        poster: resolveAssetUrl(item?.poster)
      }))
    : []
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const isLightboxOpen = lightboxIndex !== null && screenshotsList.length > 0
  const activeScreenshot = isLightboxOpen ? screenshotsList[lightboxIndex] : null
  const isVideoMedia = (item) => {
    if (!item || typeof item !== 'object') return false
    if (item.type === 'video') return true
    if (item.type === 'image') return false
    return VIDEO_FILE_PATTERN.test(item.src || '')
  }

  useEffect(() => {
    document.title = project ? `${project.title} | Zachary Gameiro` : DEFAULT_TITLE
  }, [project])

  useEffect(() => {
    const metaUpdates = [
      ['name', 'description', metaDescription],
      ['property', 'og:title', metaTitle],
      ['property', 'og:description', metaDescription],
      ['property', 'og:type', 'article'],
      ['property', 'og:url', pageUrl],
      ['property', 'og:image', metaImage],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', metaTitle],
      ['name', 'twitter:description', metaDescription],
      ['name', 'twitter:image', metaImage],
    ]

    const records = metaUpdates.map(([attribute, key, content]) =>
      upsertMetaTag(attribute, key, content)
    )

    return () => {
      records.forEach(({ tag, existed, previousContent }) => {
        if (existed) {
          if (previousContent === null) {
            tag.removeAttribute('content')
          } else {
            tag.setAttribute('content', previousContent)
          }
          return
        }
        tag.remove()
      })
    }
  }, [metaDescription, metaTitle, pageUrl, metaImage])

  useEffect(() => {
    setLightboxIndex(null)
  }, [slug])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
        return
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => {
          if (current === null || screenshotsList.length === 0) return current
          return (current - 1 + screenshotsList.length) % screenshotsList.length
        })
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => {
          if (current === null || screenshotsList.length === 0) return current
          return (current + 1) % screenshotsList.length
        })
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isLightboxOpen, screenshotsList.length])

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold text-slate-900">Project not found</h1>
        <Link to={backToProjectsUrl} className="mt-4 inline-block text-slate-600 hover:text-slate-900 underline">
          Back to projects
        </Link>
      </div>
    )
  }

  const {
    title,
    caption,
    shortDescription,
    longDescription,
    description,
    motivation,
    year,
    tags,
    repoUrl,
    demoUrl,
    category,
    coverImageUrl,
    valueProp,
    stack,
    status,
    highlights,
    architectureSteps,
    architectureNotes,
    challenges,
    results,
    references,
    nextSteps,
    artifacts,
    caseStudyUrl
  } = project

  const iconColorClass =
    category === 'ml-ai'
      ? 'text-violet-500'
      : category === 'mini'
        ? 'text-pink-400'
      : category === 'bio'
        ? 'text-emerald-400'
      : category === 'school'
        ? 'text-amber-500'
        : category === 'freelance'
          ? 'text-sky-500'
          : 'text-slate-100'

  const bannerGradient =
    category === 'ml-ai'
      ? 'from-violet-600 to-violet-900'
      : category === 'mini'
        ? 'from-pink-600 to-rose-800'
      : category === 'bio'
        ? 'from-emerald-600 to-teal-800'
      : category === 'school'
        ? 'from-amber-500 to-orange-700'
        : category === 'freelance'
          ? 'from-sky-500 to-sky-800'
          : 'from-slate-700 to-slate-900'

  const resolvedCoverImageUrl = resolveAssetUrl(coverImageUrl)
  const hasCover = Boolean(resolvedCoverImageUrl)
  const demoLink = toProjectLink(demoUrl)
  const repoLink = toProjectLink(repoUrl)
  const caseStudyLink = toProjectLink(caseStudyUrl)
  const sidebarLinks = useMemo(() => {
    const links = []
    if (demoLink) {
      const isGoogleHosted = /(?:^|\.)google\./i.test(demoLink.url) || /run\.app/i.test(demoLink.url)
      links.push({
        key: 'demo',
        href: demoLink.url,
        title: getProjectLinkText(demoLink),
        text: getProjectLinkText(demoLink),
        type: isGoogleHosted ? 'google' : 'demo',
        useMonoText: false
      })
    }
    if (repoLink) {
      links.push({
        key: 'repo',
        href: repoLink.url,
        title: repoLink.url,
        text: repoLink.url,
        type: 'repo',
        useMonoText: true
      })
    }
    if (caseStudyLink) {
      links.push({
        key: 'case-study',
        href: caseStudyLink.url,
        title: getProjectLinkText(caseStudyLink),
        text: getProjectLinkText(caseStudyLink),
        type: 'case-study',
        useMonoText: false
      })
    }
    return links
  }, [caseStudyLink, demoLink, repoLink])
  const hasHeroLinks = Boolean(demoLink || repoLink || caseStudyLink)
  const problemText = longDescription || description || shortDescription
  const heroValueProp = valueProp || shortDescription

  const primaryStack =
    Array.isArray(stack) && stack.length > 0 ? stack.join(', ') : tags?.length ? tags.slice(0, 3).join(', ') : ''

  const quickFacts = []
  if (primaryStack) quickFacts.push({ label: 'Stack', value: primaryStack })

  const sidebarStackItems =
    Array.isArray(stack) && stack.length > 0 ? stack : Array.isArray(tags) && tags.length > 0 ? tags : []
  const hasArchitecture =
    (Array.isArray(architectureSteps) && architectureSteps.length > 0) ||
    (Array.isArray(architectureNotes) && architectureNotes.length > 0)
  const hasMotivation = typeof motivation === 'string' && motivation.trim().length > 0
  const hasResults = Array.isArray(results) && results.length > 0
  const hasReferences = Array.isArray(references) && references.length > 0
  const hasScreenshots = screenshotsList.length > 0
  const sectionNavItems = useMemo(
    () =>
      [
        { id: 'overview', label: 'Overview', enabled: true },
        { id: 'motivation', label: 'Motivation', enabled: hasMotivation },
        { id: 'architecture', label: 'Architecture', enabled: hasArchitecture },
        { id: 'results', label: 'Results', enabled: hasResults },
        { id: 'references', label: 'References', enabled: hasReferences },
        { id: 'next', label: 'Next', enabled: true },
      ].filter((item) => item.enabled),
    [hasArchitecture, hasMotivation, hasReferences, hasResults]
  )

  const heroHeightClass = hasHeroLinks
    ? 'min-h-[20rem] sm:min-h-[19rem] lg:min-h-0'
    : 'min-h-[16rem] sm:min-h-[17rem] lg:min-h-0'

  const handleSectionJump = (sectionId) => {
    const sectionEl = document.getElementById(sectionId)
    if (!sectionEl) return
    sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleShowPreviousScreenshot = () => {
    setLightboxIndex((current) => {
      if (current === null || screenshotsList.length === 0) return current
      return (current - 1 + screenshotsList.length) % screenshotsList.length
    })
  }

  const handleShowNextScreenshot = () => {
    setLightboxIndex((current) => {
      if (current === null || screenshotsList.length === 0) return current
      return (current + 1) % screenshotsList.length
    })
  }

  return (
    <article className="overflow-x-clip pb-12">
      {/* Wider container on desktop; remove “boxed in whitespace” feel */}
      {/* Keep one consistent top offset across breakpoints */}
      <div className="mx-auto max-w-6xl -mt-6 px-0 sm:px-6 lg:px-4">
        {/* Back link above the hero across all breakpoints */}
        <div className="px-4 sm:px-0">
          <Link to={backToProjectsUrl} className="mb-4 inline-block text-sm text-slate-600 hover:text-slate-900">
            ← Back to projects
          </Link>
        </div>

        {/* HERO / COVER */}
        <div
          className={[
            'relative overflow-hidden bg-gradient-to-br',
            bannerGradient,

            // Height: allow more room on smaller screens but shrink on desktop
            heroHeightClass,

            // Mobile: keep equal side padding and cap width to viewport minus gutters
            'mx-auto w-full max-w-[calc(100vw-2rem)] rounded-2xl',

            // Desktop/tablet: normal layout
            'sm:mx-0 sm:max-w-none sm:w-auto',

            // Spacing: flush on mobile, keep gap on desktop
            'mb-0 sm:mb-10'
          ].join(' ')}
        >
          {hasCover && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${resolvedCoverImageUrl})` }}
                aria-hidden
              />

              {/* Stronger overlays for readability (key fix) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-900/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-transparent" />
            </>
          )}

          {!hasCover && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
            </>
          )}

          <div className="relative h-full">
            <div className="flex h-full w-full flex-col justify-end px-4 py-6 sm:px-8 sm:py-6">
              {/* Row 1: icon in the top-left */}
              <div className="flex">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/60 ring-2 ring-white/10">
                  <ProjectIcon category={category} className={`h-5 w-5 ${iconColorClass}`} />
                </div>
              </div>

              {/* Row 2+ on mobile, row 2 on desktop: content + links */}
              <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-4">
                {/* Text block constrained to left “safe zone” */}
                <div className="max-w-xl">
                  {/* Glass panel behind text (major readability upgrade) */}
                  <div className="min-w-0 rounded-2xl bg-slate-950/35 px-4 py-3 backdrop-blur-md ring-1 ring-white/10 sm:px-5 sm:py-4">
                    <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-3xl md:text-4xl">
                      {title}
                    </h1>

                    {caption && <p className="mt-1 text-sm text-slate-100/90 sm:text-base">{caption}</p>}

                    {heroValueProp && <p className="mt-2 text-sm text-slate-100/95 sm:text-base">{heroValueProp}</p>}

                    {(year || quickFacts.length > 0 || status) && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden text-[11px] text-slate-100/85 sm:flex-nowrap sm:gap-y-0 sm:whitespace-nowrap">
                        {year && <span className="shrink-0 font-semibold uppercase tracking-wide">{year}</span>}

                        {status && (
                          <span className="inline-flex shrink-0 items-center rounded-full bg-slate-950/45 px-2 py-0.5 font-medium text-slate-50">
                            {status}
                          </span>
                        )}

                        {quickFacts.map((fact) => (
                          <span
                            key={fact.label}
                            className={fact.label === 'Stack' ? 'flex min-w-0 items-center gap-1 overflow-hidden' : 'flex shrink-0 items-center gap-1'}
                          >
                            <span className="shrink-0 font-semibold uppercase tracking-wide">{fact.label}</span>
                            <span
                              className={fact.label === 'Stack' ? 'min-w-0 truncate opacity-80' : 'opacity-80'}
                              title={fact.value}
                            >
                              • {fact.value}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {(repoLink || demoLink || caseStudyLink) && (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {demoLink && (
                      <a
                        href={demoLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-sky-100 underline decoration-white/40 underline-offset-2 hover:text-white"
                        title={getProjectLinkText(demoLink)}
                      >
                        <span className="max-w-[16rem] truncate">{getProjectLinkText(demoLink)}</span>{' '}
                        <span className="ml-1" aria-hidden>↗</span>
                      </a>
                    )}
                    {caseStudyLink && (
                      <a
                        href={caseStudyLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/15 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-50 backdrop-blur hover:bg-slate-950/60"
                        title={getProjectLinkText(caseStudyLink)}
                      >
                        <span className="max-w-[14rem] truncate">{getProjectLinkText(caseStudyLink)}</span>{' '}
                        <span className="ml-1" aria-hidden>↗</span>
                      </a>
                    )}
                    {repoLink && (
                      <a
                        href={repoLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/15 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-50 backdrop-blur hover:bg-slate-950/60"
                        title={getProjectLinkText(repoLink)}
                      >
                        <span className="max-w-[14rem] truncate">{getProjectLinkText(repoLink)}</span>{' '}
                        <span className="ml-1" aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body padding returns on mobile so text isn’t edge-to-edge */}
        <div className="px-4 sm:px-0">
          {/* Keep the overlap look only on sm+ */}
          <div className="mt-6 sm:-mt-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(240px,1fr)]">
              <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {sectionNavItems.length > 0 && (
                  <nav
                    aria-label="Project sections"
                    className="-mt-1 flex flex-wrap gap-2 border-b border-slate-100 pb-4"
                  >
                    {sectionNavItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSectionJump(item.id)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                )}

                <section id="overview" className="scroll-mt-28">
                  <h2 className="text-base font-semibold text-slate-900">At a glance</h2>
                  <div className="mt-3 grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">What it does</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{problemText}</p>
                    </div>
                    {Array.isArray(highlights) && highlights.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">Highlights</h3>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                          {highlights.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                {hasMotivation && (
                  <section id="motivation" className="scroll-mt-28">
                    <h2 className="text-base font-semibold text-slate-900">Motivation</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{motivation}</p>
                  </section>
                )}

                {hasArchitecture && (
                  <section id="architecture" className="scroll-mt-28">
                    <h2 className="text-base font-semibold text-slate-900">Architecture</h2>
                    {Array.isArray(architectureSteps) && architectureSteps.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        {architectureSteps.map((step, index) => (
                          <div key={step} className="flex items-center gap-2">
                            <div className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800">{step}</div>
                            {index < architectureSteps.length - 1 && (
                              <span className="text-slate-400" aria-hidden>→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {Array.isArray(architectureNotes) && architectureNotes.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                        {architectureNotes.map((note) => (
                          <li key={note} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )}

                {Array.isArray(challenges) && challenges.length > 0 && (
                  <section>
                    <h2 className="text-base font-semibold text-slate-900">Challenges &amp; tradeoffs</h2>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                      {challenges.map((challenge) => (
                        <li key={challenge} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {hasResults && (
                  <section id="results" className="scroll-mt-28">
                    <h2 className="text-base font-semibold text-slate-900">Results</h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {results.map((result) =>
                        typeof result === 'string' ? (
                          <div
                            key={result}
                            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                          >
                            {result}
                          </div>
                        ) : (
                          <div
                            key={`${result.label}-${result.value}`}
                            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                          >
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                              {result.label}
                            </div>
                            <div className="mt-0.5 text-sm font-medium text-slate-900">{result.value}</div>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}

                {hasReferences && (
                  <section id="references" className="scroll-mt-28">
                    <h2 className="text-base font-semibold text-slate-900">References &amp; credits</h2>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                      {references.map((reference) => (
                        <li key={`${reference.label}-${reference.href}`} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>
                            <a
                              href={reference.href}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
                            >
                              {reference.label}
                            </a>
                            {reference.note ? ` — ${reference.note}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section id="next" className="scroll-mt-28">
                  <h2 className="text-base font-semibold text-slate-900">What I’d do next</h2>
                  {Array.isArray(nextSteps) && nextSteps.length > 0 ? (
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                      {nextSteps.map((step) => (
                        <li key={step} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      With more time, I’d deepen the instrumentation (logging, metrics, tests) and round out documentation
                      so this could be dropped into a team codebase with minimal onboarding.
                    </p>
                  )}
                </section>

                {(hasScreenshots || (Array.isArray(artifacts) && artifacts.length > 0)) ? (
                  <section>
                    <h2 className="text-base font-semibold text-slate-900">Links &amp; artifacts</h2>
                    {hasScreenshots && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {screenshotsList.map((shot, index) => (
                          <figure key={shot.src} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => setLightboxIndex(index)}
                              className="group block w-full text-left"
                              aria-label={`Open media ${index + 1}`}
                            >
                              {isVideoMedia(shot) ? (
                                <video
                                  src={shot.src}
                                  poster={shot.poster || undefined}
                                  muted
                                  loop
                                  autoPlay
                                  playsInline
                                  preload="metadata"
                                  className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                                  aria-label={shot.alt || `Project video ${index + 1}`}
                                />
                              ) : (
                                <img
                                  src={shot.src}
                                  alt={shot.alt || ''}
                                  className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                                />
                              )}
                            </button>
                            {shot.caption && (
                              <figcaption className="px-3 py-2 text-xs text-slate-600">{shot.caption}</figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                    {Array.isArray(artifacts) && artifacts.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                        {artifacts.map((artifact) => (
                          <li key={artifact.label}>
                            <a
                              href={artifact.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
                            >
                              <span>{artifact.label}</span>
                              <span aria-hidden>↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ) : null}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="space-y-4">
                    {sidebarLinks.length > 0 && (
                      <div>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links</h2>
                        <ul className="mt-2 space-y-2">
                          {sidebarLinks.map((item) => (
                            <li key={item.key}>
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex min-w-0 items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                title={item.title}
                              >
                                <span className="flex min-w-0 flex-1 items-start gap-2">
                                  <SidebarLinkIcon type={item.type} className="h-4 w-4 shrink-0 text-slate-500" />
                                  <span
                                    className={`min-w-0 max-w-full ${
                                      item.useMonoText ? 'font-mono text-[11px] leading-4 break-all' : 'truncate font-medium'
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                </span>
                                <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project info</h2>
                      <dl className="mt-2 space-y-1 text-sm text-slate-600">
                        {status && (
                          <div className="flex items-center justify-between">
                            <dt className="text-slate-500">Status</dt>
                            <dd className="font-medium text-slate-900">{status}</dd>
                          </div>
                        )}
                        {year && (
                          <div className="flex items-center justify-between">
                            <dt className="text-slate-500">Year</dt>
                            <dd className="font-medium text-slate-900">{year}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {sidebarStackItems.length > 0 && (
                      <div>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stack</h2>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {sidebarStackItems.map((item) => (
                            <li
                              key={item}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </div>
              </aside>
            </div>

            {(previousProject || nextProject) && (
              <nav className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between" aria-label="Project navigation">
                {previousProject && (
                  <Link
                    to={`/projects/${previousProject.slug}${location.search}`}
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">← Previous project</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 group-hover:text-slate-950">{previousProject.title}</p>
                  </Link>
                )}

                {nextProject && (
                  <Link
                    to={`/projects/${nextProject.slug}${location.search}`}
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:text-right"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Next project →</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 group-hover:text-slate-950">{nextProject.title}</p>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>

      {isLightboxOpen && activeScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} media viewer`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close media viewer"
          />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-200">
              <span>
                Media {lightboxIndex + 1} of {screenshotsList.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="inline-flex items-center rounded-full border border-white/25 bg-slate-900/60 px-3 py-1 text-xs font-medium text-white hover:bg-slate-900/80"
              >
                Close
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
              {isVideoMedia(activeScreenshot) ? (
                <video
                  src={activeScreenshot.src}
                  poster={activeScreenshot.poster || undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="max-h-[76vh] w-full object-contain"
                />
              ) : (
                <img src={activeScreenshot.src} alt={activeScreenshot.alt || ''} className="max-h-[76vh] w-full object-contain" />
              )}

              {screenshotsList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handleShowPreviousScreenshot}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-slate-900/65 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900/85"
                    aria-label="Previous media"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={handleShowNextScreenshot}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-slate-900/65 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900/85"
                    aria-label="Next media"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {activeScreenshot.caption && (
              <p className="mt-2 text-center text-sm text-slate-200">{activeScreenshot.caption}</p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

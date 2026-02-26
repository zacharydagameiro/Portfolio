import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import projectsData from '../data/projects.json'
import { ProjectIcon } from '../components/ProjectCard.jsx'
import { SITE_DESCRIPTION } from '../data/siteMeta'
import { toProjectLink, getProjectLinkText } from '../utils/projectLinks'

const DEFAULT_TITLE = 'Zachary Gameiro — CS Portfolio'
const DEFAULT_PROJECT_IMAGE = '/profile.jpg'
const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i

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
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`
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
  const metaImage =
    typeof window !== 'undefined'
      ? new URL(project?.coverImageUrl || DEFAULT_PROJECT_IMAGE, window.location.origin).href
      : project?.coverImageUrl || DEFAULT_PROJECT_IMAGE
  const currentProjectIndex = projectsData.findIndex((p) => p.slug === slug)
  const previousProject = currentProjectIndex > 0 ? projectsData[currentProjectIndex - 1] : null
  const nextProject =
    currentProjectIndex >= 0 && currentProjectIndex < projectsData.length - 1
      ? projectsData[currentProjectIndex + 1]
      : null
  const screenshotsList = Array.isArray(project?.screenshots) ? project.screenshots : []
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

  const hasCover = Boolean(coverImageUrl)
  const demoLink = toProjectLink(demoUrl)
  const repoLink = toProjectLink(repoUrl)
  const caseStudyLink = toProjectLink(caseStudyUrl)
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
    <article className="pb-12">
      {/* Wider container on desktop; remove “boxed in whitespace” feel */}
      {/* Negative top margin cancels Layout's mobile padding so the hero hugs the header */}
      <div className="mx-auto max-w-6xl -mt-10 px-0 sm:mt-0 sm:px-6 lg:px-4">
        {/* Desktop/tablet back link above the hero */}
        <div className="hidden px-4 sm:block sm:px-0">
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

            // Mobile: full-bleed cover
            'w-screen rounded-none',
            'left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]',

            // Desktop/tablet: normal layout
            'sm:left-auto sm:right-auto sm:mx-0 sm:w-auto sm:rounded-2xl',

            // Spacing: flush on mobile, keep gap on desktop
            'mb-0 sm:mb-10'
          ].join(' ')}
        >
          {hasCover && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImageUrl})` }}
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
              {/* Mobile row 1: back button (left) + icon (right) */}
              <div className="flex items-start justify-between sm:hidden">
                <Link
                  to={backToProjectsUrl}
                  className="inline-flex items-center rounded-full bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-50 backdrop-blur hover:bg-slate-950/60"
                >
                  ← Back
                </Link>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/60 ring-2 ring-white/10">
                  <ProjectIcon category={category} className={`h-5 w-5 ${iconColorClass}`} />
                </div>
              </div>

              {/* Desktop row 1: icon in the top-left */}
              <div className="hidden sm:flex">
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
                      <div className="mt-3 flex items-center gap-x-4 overflow-hidden whitespace-nowrap text-[11px] text-slate-100/85">
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
                    {(demoLink || repoLink || caseStudyLink) && (
                      <div>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {demoLink && (
                            <a
                              href={demoLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-xs font-semibold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700"
                              title={getProjectLinkText(demoLink)}
                            >
                              <span className="max-w-[12rem] truncate">{getProjectLinkText(demoLink)}</span>{' '}
                              <span className="ml-1" aria-hidden>↗</span>
                            </a>
                          )}
                          {repoLink && (
                            <a
                              href={repoLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50"
                              title={getProjectLinkText(repoLink)}
                            >
                              <span className="max-w-[12rem] truncate">{getProjectLinkText(repoLink)}</span>{' '}
                              <span className="ml-1" aria-hidden>↗</span>
                            </a>
                          )}
                          {caseStudyLink && (
                            <a
                              href={caseStudyLink.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50"
                              title={getProjectLinkText(caseStudyLink)}
                            >
                              <span className="max-w-[12rem] truncate">{getProjectLinkText(caseStudyLink)}</span>{' '}
                              <span className="ml-1" aria-hidden>↗</span>
                            </a>
                          )}
                        </div>
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

                    <div>
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50"
                      >
                        Download resume <span className="ml-1" aria-hidden>↗</span>
                      </a>
                    </div>
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

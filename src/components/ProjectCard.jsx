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
  const demoLink = toProjectLink(demoUrl)
  const repoLink = toProjectLink(repoUrl)
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
      className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
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
        <div className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
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
          <div className="flex flex-wrap gap-2">
            {demoLink && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(demoLink.url, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                title={getProjectLinkText(demoLink)}
              >
                <span className="max-w-[11rem] truncate">{getProjectLinkText(demoLink)}</span>
                <span className="ml-1" aria-hidden>
                  ↗
                </span>
              </button>
            )}
            {repoLink && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(repoLink.url, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                title={getProjectLinkText(repoLink)}
              >
                <span className="max-w-[11rem] truncate">{getProjectLinkText(repoLink)}</span>
                <span className="ml-1" aria-hidden>
                  ↗
                </span>
              </button>
            )}
            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              Case study
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

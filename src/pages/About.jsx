import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import aboutData from '../data/about.json'
import Modal from '../components/Modal.jsx'
import { ABOUT_LAST_UPDATED } from '../data/siteMeta'
import { resolveAssetUrl } from '../utils/assetUrl'
import { getResumes } from '../utils/resumes'

const education = aboutData.education || []
const experience = aboutData.experience || []
const bio = aboutData.bio ?? aboutData.about
const bioParagraphs = Array.isArray(bio) ? bio : bio ? [bio] : []

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
  if (type === 'github') {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 0C3.58 0 0 3.58 0 8a8.002 8.002 0 0 0 5.47 7.59c.4.08.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.95-.82-1.15-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.56 7.56 0 0 1 8 3.8c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.002 8.002 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.83v1.71h.05c.53-1 1.84-2.06 3.79-2.06 4.06 0 4.81 2.67 4.81 6.14V21h-4v-5.53c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-4V9Z" />
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

export default function About() {
  useEffect(() => {
    document.title = 'About | Zachary Gameiro'
  }, [])

  const [selectedEducation, setSelectedEducation] = useState(null)
  const [selectedExperience, setSelectedExperience] = useState(null)

  const handleEducationClick = (item) => setSelectedEducation(item)
  const closeEducationModal = () => setSelectedEducation(null)

  const handleExperienceClick = (item) => setSelectedExperience(item)
  const closeExperienceModal = () => setSelectedExperience(null)

  // Sidebar info (safe defaults so it never breaks if fields are missing)
  const contact = aboutData.contact || {}
  const locations = useMemo(() => {
    const loc = aboutData.location
    if (Array.isArray(loc)) return loc.filter(Boolean)
    if (typeof loc === 'string' && loc.trim()) return [loc.trim()]
    // if your about.json has location(s) nested somewhere else, it won't crash
    return []
  }, [])

  const languages = useMemo(() => {
    const langs = aboutData.languages
    if (Array.isArray(langs)) {
      return langs
        .map((item) => (typeof item === 'string' ? item : item?.label))
        .filter((item) => typeof item === 'string' && item.trim())
    }
    if (typeof langs === 'string' && langs.trim()) return [langs.trim()]
    return []
  }, [])

  const resumes = useMemo(() => {
    return getResumes()
  }, [])

  const quickFacts = useMemo(() => {
    // Optional fields you can add to about.json:
    // aboutData.quickFacts = [{ label, value }, ...]
    // aboutData.focusAreas = ["Systems", "Applied ML", ...]
    const facts = []

    if (Array.isArray(aboutData.quickFacts)) {
      aboutData.quickFacts.forEach((f) => {
        if (f?.label && f?.value) facts.push({ label: f.label, value: f.value })
      })
    }

    if (Array.isArray(aboutData.focusAreas) && aboutData.focusAreas.length) {
      facts.push({ label: 'Focus', value: aboutData.focusAreas.join(', ') })
    }

    // fallback: show degree/school if present in top education item
    const topEdu = education?.[0]
    if (!facts.length && topEdu?.school) {
      facts.push({ label: 'School', value: topEdu.school })
      if (topEdu?.year) facts.push({ label: 'Grad', value: topEdu.year })
    }

    return facts
  }, [])

  const socialLinks = useMemo(() => {
    // Optional fields you can add to about.json:
    // aboutData.links = { github: "...", linkedin: "...", website: "..." }
    const links = aboutData.links || {}
    const out = []
    if (links.github) out.push({ label: 'GitHub', href: links.github })
    if (links.linkedin) out.push({ label: 'LinkedIn', href: links.linkedin })
    if (links.website) out.push({ label: 'Website', href: links.website })
    // If you prefer to keep links in contact, support that too:
    if (!links.github && contact.github) out.push({ label: 'GitHub', href: contact.github })
    if (!links.linkedin && contact.linkedin) out.push({ label: 'LinkedIn', href: contact.linkedin })
    return out
  }, [])

  const sidebarSocialLinks = useMemo(
    () =>
      socialLinks.map((link) => {
        const lowerLabel = (link.label || '').toLowerCase()
        const type = lowerLabel === 'github' ? 'github' : lowerLabel === 'linkedin' ? 'linkedin' : 'website'
        return {
          ...link,
          type,
          text: link.href,
          useMonoText: type === 'github' || type === 'linkedin'
        }
      }),
    [socialLinks]
  )

  const sidebarTagline = useMemo(() => {
    if (!aboutData.tagline) return { primary: '', degree: '' }
    const [primaryPart] = aboutData.tagline.split('|').map((s) => s.trim())
    const primary = (primaryPart || '').replace(/\s+Student\b/i, '').trim()
    const degree = education?.[0]?.degree || 'Bachelor of Science'
    return { primary, degree }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-4">
      {/* Page header (matches the home page “left column” vibe) */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">About</h1>
        {aboutData.tagline && <p className="mt-2 text-slate-600">{aboutData.tagline}</p>}
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Last updated: {ABOUT_LAST_UPDATED}
        </p>
      </section>

      {/* Two-column layout like Home */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.25fr)_minmax(280px,1fr)]">
        {/* Main column */}
        <main className="space-y-10">
          {/* Bio */}
          {bioParagraphs.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-base font-semibold text-slate-900">About me</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                {bioParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  🎓
                </span>
                <h2 className="text-base font-semibold text-slate-900">Education</h2>
              </div>

              <ul className="mt-5 space-y-4">
                {education.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleEducationClick(item)}
                      className="group w-full text-left rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        {item.logoUrl && (
                          <img
                            src={resolveAssetUrl(item.logoUrl)}
                            alt={`${item.school} logo`}
                            className="h-10 w-10 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-1"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                            <span className="truncate">{item.school}</span>
                            <span
                              aria-hidden
                              className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600"
                            >
                              →
                            </span>
                          </p>
                          <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">
                            {item.degree}
                            {item.year ? ` · ${item.year}` : ''}
                          </p>
                          {(item.summary || item.details) && (
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                              {item.summary || item.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section id="experience" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  💼
                </span>
                <h2 className="text-base font-semibold text-slate-900">Experience</h2>
              </div>

              <ul className="mt-5 space-y-4">
                {experience.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleExperienceClick(item)}
                      className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                    >
                      <div className="flex items-start gap-3">
                        {item.logoUrl && (
                          <img
                            src={resolveAssetUrl(item.logoUrl)}
                            alt={`${item.company} logo`}
                            className="h-10 w-10 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-1"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {item.title} · {item.company}
                          </p>
                          {item.dates && <p className="mt-0.5 text-sm text-slate-500">{item.dates}</p>}
                          {item.description && (
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs font-medium text-blue-600">View more details</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Get in touch (kept, but styled like a real section) */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">Get in touch</h2>
            <p className="mt-3 text-sm text-slate-600">
              {contact?.email ? (
                <>
                  Email me at{' '}
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                  .
                </>
              ) : (
                <>
                  See contact info on the{' '}
                  <Link to="/" className="text-blue-600 hover:underline">
                    homepage
                  </Link>
                  .
                </>
              )}
            </p>

          </section>
        </main>

        {/* Sidebar (sticky on desktop, like Home) */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          {/* Profile card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              {aboutData.profileImageUrl ? (
                <img
                  src={resolveAssetUrl(aboutData.profileImageUrl)}
                  alt={aboutData.name || 'Profile'}
                  className="h-16 w-16 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-100" />
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">{aboutData.name || 'Zachary Gameiro'}</p>
                {(sidebarTagline.primary || sidebarTagline.degree) && (
                  <div className="mt-1 space-y-1">
                    {sidebarTagline.primary && (
                      <p className="text-xs leading-snug text-slate-600">{sidebarTagline.primary}</p>
                    )}
                    {sidebarTagline.degree && (
                      <p className="text-[11px] font-medium text-slate-700">{sidebarTagline.degree}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick facts */}
            {quickFacts.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick facts</h3>
                <dl className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {quickFacts.map((f) => (
                    <div key={f.label} className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-slate-500">{f.label}</dt>
                      <dd className="text-right font-medium text-slate-900">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Contact */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</h3>
              <div className="mt-2 space-y-2 text-sm">
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="block text-slate-700 hover:text-slate-900 hover:underline underline-offset-2"
                  >
                    {contact.email}
                  </a>
                )}
                {contact?.phone && <p className="text-slate-600">{contact.phone}</p>}
              </div>
            </div>

            {sidebarSocialLinks.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links</h3>
                <ul className="mt-2 space-y-2">
                  {sidebarSocialLinks.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-w-0 items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        title={link.href}
                      >
                        <span className="flex min-w-0 flex-1 items-start gap-2">
                          <SidebarLinkIcon type={link.type} className="h-4 w-4 shrink-0 text-slate-500" />
                          <span
                            className={`min-w-0 max-w-full ${
                              link.useMonoText ? 'font-mono text-[11px] leading-4 break-all' : 'truncate font-medium'
                            }`}
                          >
                            {link.text}
                          </span>
                        </span>
                        <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location */}
            {locations.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {locations.map((loc) => (
                    <li key={loc}>{loc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Languages</h3>
                <p className="mt-2 text-sm text-slate-600">{languages.join(', ')}</p>
              </div>
            )}

          </div>

          {resumes.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  📄
                </span>
                <h3 className="text-base font-semibold text-slate-900">Resumes</h3>
              </div>

              <p className="mt-3 text-sm text-slate-600">Pick the version that fits the role you're targeting.</p>

              <ul className="mt-4 space-y-3">
                {resumes.map((resume) => (
                  <li key={resume.name}>
                    <a
                      href={resume.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium">{resume.title}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          {resume.label}
                        </span>
                      </span>
                      <span className="ml-2 text-slate-400" aria-hidden>
                        ↗
                      </span>
                    </a>
                    {resume.description && <p className="mt-1 text-xs text-slate-500">{resume.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Modals (unchanged behavior) */}
      <Modal
        isOpen={!!selectedEducation}
        onClose={closeEducationModal}
        title={selectedEducation?.school}
        maxWidthClass="max-w-2xl"
      >
        {selectedEducation && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {selectedEducation.logoUrl && (
                <img
                  src={resolveAssetUrl(selectedEducation.logoUrl)}
                  alt={`${selectedEducation.school} logo`}
                  className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-1"
                />
              )}
              <p className="pt-1 text-sm font-medium text-slate-900">{selectedEducation.degree}</p>
            </div>

            {(selectedEducation.dates || selectedEducation.year || selectedEducation.location || selectedEducation.program) && (
              <dl className="grid gap-3 sm:grid-cols-2">
                {(selectedEducation.dates || selectedEducation.year) && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2">
                    <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-slate-500">Timeline</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-800">{selectedEducation.dates || selectedEducation.year}</dd>
                  </div>
                )}
                {selectedEducation.location && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2">
                    <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-slate-500">Location</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-800">{selectedEducation.location}</dd>
                  </div>
                )}
                {selectedEducation.program && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 sm:col-span-2">
                    <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-slate-500">Program</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-800">{selectedEducation.program}</dd>
                  </div>
                )}
              </dl>
            )}

            {selectedEducation.details && (
              <p className="border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                {selectedEducation.details}
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedExperience}
        onClose={closeExperienceModal}
        title={selectedExperience ? `${selectedExperience.title} · ${selectedExperience.company}` : undefined}
      >
        {selectedExperience && (
          <div className="space-y-3">
            {selectedExperience.logoUrl && (
              <img
                src={resolveAssetUrl(selectedExperience.logoUrl)}
                alt={`${selectedExperience.company} logo`}
                className="h-12 w-12 rounded-md border border-slate-200 bg-white object-contain p-1"
              />
            )}
            {selectedExperience.dates && <p className="text-sm font-medium text-slate-600">{selectedExperience.dates}</p>}
            {selectedExperience.description && (
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{selectedExperience.description}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

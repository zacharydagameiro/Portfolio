import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import aboutData from '../data/about.json'
import Modal from '../components/Modal.jsx'
import { ABOUT_LAST_UPDATED } from '../data/siteMeta'
import { resolveAssetUrl } from '../utils/assetUrl'

const education = aboutData.education || []
const experience = aboutData.experience || []
const bio = aboutData.bio ?? aboutData.about
const bioParagraphs = Array.isArray(bio) ? bio : bio ? [bio] : []

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
    const list = Array.isArray(aboutData.resumes) ? aboutData.resumes : []

    const normalized = list
      .map((item) => {
        if (typeof item === 'string') return { label: item, href: item }
        return item
      })
      .filter((item) => item?.label && item?.href)
      .map((item) => ({ ...item, href: resolveAssetUrl(item.href) }))

    if (!normalized.length && aboutData.resumeUrl) {
      normalized.push({ label: 'Resume', href: resolveAssetUrl(aboutData.resumeUrl) })
    }

    return normalized
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

            {socialLinks.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Links</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {socialLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                        l.label === 'GitHub'
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : l.label === 'LinkedIn'
                            ? 'bg-sky-600 text-white hover:bg-sky-500'
                            : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {l.label}
                      <span className="ml-1" aria-hidden>
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
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
                  <li key={resume.label}>
                    <a
                      href={resume.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <span>{resume.label}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          PDF
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

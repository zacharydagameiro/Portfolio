import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getResumes } from '../../utils/resumes'
import SidebarCard from './SidebarCard'
import SidebarLinkItem from './SidebarLinkItem'
import SidebarProfileHeader from './SidebarProfileHeader'
import SidebarSection from './SidebarSection'
import SidebarTooltip from './SidebarTooltip'
import { ContactIcon, LocationIcon, SectionIcon } from './SidebarIcons'

const DEFAULT_SECTIONS = {
  profile: true,
  contact: true,
  links: true,
  location: true,
  languages: true,
  resumes: true,
  skills: true,
}

function SkillsSection({ skills }) {
  const [open, setOpen] = useState(false)
  const entries = Object.entries(skills || {})

  if (entries.length === 0) return null

  return (
    <section className="border-t border-slate-100 pt-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md text-left text-sm font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <SectionIcon type="skills" />
          Skills
        </span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {entries.map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-medium text-slate-600">{category}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span key={item} className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function ProfileSidebarCore({
  about,
  sections = {},
  className = '',
  extraSections = null,
}) {
  const sectionFlags = { ...DEFAULT_SECTIONS, ...sections }
  const resumes = useMemo(() => getResumes(), [])

  const contact = about?.contact || {}
  const socialLinks = Array.isArray(about?.socialLinks) ? about.socialLinks : []
  const locations = Array.isArray(about?.locations) ? about.locations : []
  const languages = Array.isArray(about?.languages) ? about.languages : []
  const skills = about?.skills && typeof about.skills === 'object' ? about.skills : {}
  const hasSkills = Object.keys(skills).length > 0
  const extraSectionsNode = typeof extraSections === 'function' ? extraSections() : extraSections

  return (
    <>
      <SidebarCard as="aside" className={`space-y-6 overflow-visible ${className}`.trim()}>
        {sectionFlags.profile && (
          <SidebarProfileHeader
            name={about?.name}
            profileImageUrl={about?.profileImageUrl}
            taglinePrimary={about?.taglinePrimary}
            taglineSecondary={about?.taglineSecondary}
          />
        )}

        {sectionFlags.contact && (contact.email || contact.phone) && (
          <SidebarSection title="Contact" icon={<SectionIcon type="contact" />}>
            <ul className="mt-2 space-y-1.5 text-slate-700">
              {contact.email && (
                <li className="flex items-center gap-2">
                  <ContactIcon type="email" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="truncate rounded-md px-1 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <ContactIcon type="phone" />
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="rounded-md px-1 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </SidebarSection>
        )}

        {sectionFlags.links && socialLinks.length > 0 && (
          <SidebarSection title="Links" icon={<SectionIcon type="links" />}>
            <ul className="mt-2 space-y-1.5">
              {socialLinks.map((link) => (
                <li key={link.key || `${link.label}-${link.href}`}>
                  <SidebarLinkItem href={link.href} label={link.label} iconType={link.type} external />
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {sectionFlags.location && locations.length > 0 && (
          <SidebarSection title="Location" icon={<SectionIcon type="location" />}>
            <ul className="mt-2 space-y-2 text-slate-700">
              {locations.map((item) => (
                <li key={`${item.label}-${item.icon || 'none'}`} className="flex items-center gap-2">
                  {item.icon ? (
                    <span className="shrink-0">
                      <LocationIcon type={item.icon} />
                    </span>
                  ) : null}
                  {item.tooltip ? (
                    <SidebarTooltip text={item.tooltip}>
                      <span className="border-b border-dotted border-slate-400">{item.label}</span>
                    </SidebarTooltip>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {sectionFlags.languages && languages.length > 0 && (
          <SidebarSection title="Languages" icon={<SectionIcon type="languages" />}>
            <p className="mt-2 text-slate-700">
              {languages.map((item, index) => (
                <span key={item.label}>
                  {index > 0 && ', '}
                  {item.tooltip ? (
                    <SidebarTooltip text={item.tooltip}>
                      <span className="border-b border-dotted border-slate-400">{item.label}</span>
                    </SidebarTooltip>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </span>
              ))}
            </p>
          </SidebarSection>
        )}

        {sectionFlags.resumes && resumes.length > 0 && (
          <SidebarSection title="Resumes" icon={<SectionIcon type="resume" />}>
            <Link
              to="/resumes"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <SectionIcon type="resume" className="h-4 w-4 shrink-0 text-white" />
              View resumes
            </Link>
          </SidebarSection>
        )}

        {sectionFlags.skills && hasSkills && <SkillsSection skills={skills} />}
      </SidebarCard>

      {extraSectionsNode}
    </>
  )
}

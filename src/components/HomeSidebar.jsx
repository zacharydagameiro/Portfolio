import { useState } from 'react'

function LocationIcon({ type, className = "h-4 w-4 text-slate-500" }) {
  if (type === "home") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  }
  if (type === "graduation") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-3.75 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
      </svg>
    )
  }
  return null
}

function ContactIcon({ type, className = "h-4 w-4 text-slate-500 shrink-0" }) {
  const c = className
  if (type === "email") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    )
  }
  if (type === "phone") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    )
  }
  if (type === "github") {
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )
  }
  if (type === "linkedin") {
    return (
      <svg className={c} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }
  return null
}

function SectionIconSmall({ type, className = "h-4 w-4 text-slate-500 shrink-0" }) {
  const c = className
  if (type === "contact") return <ContactIcon type="email" className={c} />
  if (type === "location") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    )
  }
  if (type === "languages") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
      </svg>
    )
  }
  if (type === "resume") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.25a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    )
  }
  if (type === "skills") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    )
  }
  return null
}

function SidebarTooltip({ text, children }) {
  return (
    <span className="group relative inline-flex cursor-default">
      {children}
      <span
        role="tooltip"
        className="absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 pointer-events-none"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" aria-hidden />
      </span>
    </span>
  )
}

function SkillsSection({ skills }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="border-t border-slate-100 pt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <SectionIconSmall type="skills" />
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
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-medium text-slate-600">{category}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                  >
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

export default function HomeSidebar({ about }) {
  const { name, profileImageUrl, contact, locations, location, languages, resumeUrl, skills } = about || {}
  const locationList = Array.isArray(locations) ? locations : (location ? [{ label: location }] : [])

  return (
    <aside className="space-y-6 overflow-visible rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {(name || profileImageUrl) && (
        <section className="flex flex-col items-center text-center border-b border-slate-100 pb-6">
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt={name || 'Profile'}
              className="h-28 w-28 rounded-full object-cover border-2 border-slate-200"
            />
          )}
          {name && (
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{name}</h2>
          )}
        </section>
      )}
      {contact && (
        <section className="border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <SectionIconSmall type="contact" />
            Contact
          </h3>
          <ul className="mt-2 space-y-1.5 text-slate-700">
            {contact.email && (
              <li className="flex items-center gap-2">
                <ContactIcon type="email" />
                <a href={`mailto:${contact.email}`} className="hover:text-slate-900 transition truncate">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li className="flex items-center gap-2">
                <ContactIcon type="phone" />
                <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:text-slate-900 transition">
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.github && (
              <li className="flex items-center gap-2">
                <ContactIcon type="github" />
                <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition">
                  GitHub
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li className="flex items-center gap-2">
                <ContactIcon type="linkedin" />
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </section>
      )}
      {locationList.length > 0 && (
        <section className="border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <SectionIconSmall type="location" />
            Location
          </h3>
          <ul className="mt-2 space-y-2 text-slate-700">
            {locationList.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                {item.icon && (
                  <span className="shrink-0">
                    <LocationIcon type={item.icon} />
                  </span>
                )}
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
        </section>
      )}
      {languages && languages.length > 0 && (
        <section className="border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <SectionIconSmall type="languages" />
            Languages
          </h3>
          <p className="mt-2 text-slate-700">
            {languages.map((item, i) => {
              const label = typeof item === 'string' ? item : item.label
              const tooltip = typeof item === 'object' && item.tooltip
              const content = tooltip ? (
                <SidebarTooltip text={item.tooltip}>
                  <span className="border-b border-dotted border-slate-400">{label}</span>
                </SidebarTooltip>
              ) : (
                <span>{label}</span>
              )
              return (
                <span key={i}>
                  {i > 0 && ', '}
                  {content}
                </span>
              )
            })}
          </p>
        </section>
      )}
      {resumeUrl && (
        <section className="border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <SectionIconSmall type="resume" />
            Resume
          </h3>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            <SectionIconSmall type="resume" className="h-4 w-4 text-white shrink-0" />
            Download resume
          </a>
        </section>
      )}
      {skills && Object.keys(skills).length > 0 && (
        <SkillsSection skills={skills} />
      )}
    </aside>
  )
}

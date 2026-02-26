import { Link } from 'react-router-dom'
import aboutData from '../data/about.json'

const defaultName = 'Zachary Gameiro'

export default function Footer() {
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`
  const year = new Date().getFullYear()
  const { name = defaultName, tagline, contact = {}, links = {} } = aboutData

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Projects', to: '/projects' }
  ]

  const socialLinks = []
  if (links.github || contact.github) {
    socialLinks.push({ label: 'GitHub', href: links.github || contact.github })
  }
  if (links.linkedin || contact.linkedin) {
    socialLinks.push({ label: 'LinkedIn', href: links.linkedin || contact.linkedin })
  }
  if (links.website) {
    socialLinks.push({ label: 'Website', href: links.website })
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{name}</p>
          {tagline && <p className="mt-1 text-slate-500">{tagline}</p>}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="mt-3 inline-flex items-center text-blue-600 hover:underline">
              {contact.email}
            </a>
          )}
          {contact.phone && <p className="mt-1 text-slate-500">{contact.phone}</p>}
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navigate</p>
            <ul className="mt-2 space-y-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-700 transition hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-slate-700 transition hover:text-slate-900">
                  Resume
                </a>
              </li>
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connect</p>
              <ul className="mt-2 space-y-1">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center text-slate-700 transition hover:text-slate-900">
                      {link.label}
                      <span className="ml-1" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {year} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

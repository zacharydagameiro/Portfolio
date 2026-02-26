import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import aboutData from '../data/about.json'
import Footer from './Footer'

export default function Layout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navClass = ({ isActive }) =>
    `transition ${isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`
  const { name, profileImageUrl } = aboutData

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-slate-800 transition hover:text-slate-600"
          >
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt=""
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              />
            )}
            <span>{name || 'Zachary Gameiro'}</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <NavLink to="/projects" className={navClass}>
              Projects
            </NavLink>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 transition hover:text-slate-900"
            >
              Resume
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <span className="sr-only">Open navigation menu</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="absolute right-0 top-0 h-full w-64 max-w-[80%] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Menu</span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3 px-4 py-4 text-sm">
              <NavLink
                to="/"
                end
                className={navClass}
                onClick={() => setMobileNavOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={navClass}
                onClick={() => setMobileNavOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/projects"
                className={navClass}
                onClick={() => setMobileNavOpen(false)}
              >
                Projects
              </NavLink>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 transition hover:text-slate-900"
                onClick={() => setMobileNavOpen(false)}
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

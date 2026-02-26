import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getResumes } from '../utils/resumes'

export default function Resumes() {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'Resumes | Zachary Gameiro'
  }, [])

  const resumes = useMemo(() => getResumes(), [])

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resumes</h1>
      <p className="mt-2 text-slate-600">Choose the version that best matches the role you’re applying for.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {resumes.map((resume) => (
          <li key={resume.name}>
            <article
              className="group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/resumes/${resume.name}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/resumes/${resume.name}`)
                }
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{resume.label}</p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">{resume.title}</h2>
              {resume.description && <p className="mt-2 text-sm text-slate-600">{resume.description}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to={`/resumes/${resume.name}`}
                  className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  View Resume
                </Link>
                <a
                  href={resume.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={(event) => event.stopPropagation()}
                >
                  Open PDF <span className="ml-1" aria-hidden>↗</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

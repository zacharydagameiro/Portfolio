import { useEffect, useMemo } from 'react'
import projectsData from '../data/projects.json'
import ProjectCard from '../components/ProjectCard'
import { useSearchParams } from 'react-router-dom'
import { PROJECTS_LAST_UPDATED } from '../data/siteMeta'

const BASE_TABS = [
  { id: 'featured', label: 'Featured' },
  { id: 'all', label: 'All' },
  { id: 'mini', label: 'Mini' },
  { id: 'ml-ai', label: 'ML / AI' },
  { id: 'bio', label: 'Bio' },
  { id: 'school', label: 'School' },
  { id: 'freelance', label: 'Freelance' },
]

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured first' },
  { id: 'newest', label: 'Newest' },
  { id: 'alpha', label: 'A–Z' },
]

const projectInCategory = (project, categoryId) =>
  project.category === categoryId || (Array.isArray(project.categories) && project.categories.includes(categoryId))

export default function ProjectList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const sortParam = searchParams.get('sort')
  const validTabIds = BASE_TABS.map((tab) => tab.id)
  const validSortIds = SORT_OPTIONS.map((option) => option.id)
  const activeTab = validTabIds.includes(tabParam) ? tabParam : 'featured'
  const sortBy = validSortIds.includes(sortParam) ? sortParam : 'featured'
  const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : ''

  const projects = useMemo(
    () =>
      [...projectsData].map((p) => ({
        ...p,
        yearValue: Number.parseInt(p.year || '0', 10),
      })),
    []
  )

  const counts = useMemo(() => {
    const featured = projects.filter((p) => p.featured).length
    const all = projects.length
    const mini = projects.filter((p) => projectInCategory(p, 'mini')).length
    const ml = projects.filter((p) => projectInCategory(p, 'ml-ai')).length
    const bio = projects.filter((p) => projectInCategory(p, 'bio')).length
    const school = projects.filter((p) => projectInCategory(p, 'school')).length
    const freelance = projects.filter((p) => projectInCategory(p, 'freelance')).length
    return { featured, all, mini, ml, bio, school, freelance }
  }, [projects])

  const tabs = useMemo(
    () =>
      BASE_TABS.map((tab) => {
        if (tab.id === 'featured') return { ...tab, label: `Featured (${counts.featured})` }
        if (tab.id === 'all') return { ...tab, label: `All (${counts.all})` }
        if (tab.id === 'mini') return { ...tab, label: `Mini (${counts.mini})` }
        if (tab.id === 'ml-ai') return { ...tab, label: `ML / AI (${counts.ml})` }
        if (tab.id === 'bio') return { ...tab, label: `Bio (${counts.bio})` }
        if (tab.id === 'school') return { ...tab, label: `School (${counts.school})` }
        if (tab.id === 'freelance') return { ...tab, label: `Freelance (${counts.freelance})` }
        return tab
      }),
    [counts]
  )

  const filteredAndSorted = useMemo(() => {
    let filtered =
      activeTab === 'featured'
        ? projects.filter((p) => p.featured)
        : activeTab === 'all'
        ? projects
        : projects.filter((p) => projectInCategory(p, activeTab))

    if (sortBy === 'featured') {
      filtered = [...filtered].sort((a, b) => {
        if (a.featured === b.featured) {
          return (b.yearValue || 0) - (a.yearValue || 0)
        }
        return a.featured ? -1 : 1
      })
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => (b.yearValue || 0) - (a.yearValue || 0))
    } else if (sortBy === 'alpha') {
      filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }

    return filtered
  }, [activeTab, projects, sortBy])

  useEffect(() => {
    document.title = 'Projects | Zachary Gameiro'
  }, [])

  const handleTabChange = (tabId) => {
    const nextParams = new URLSearchParams(searchParams)
    if (tabId === 'featured') {
      nextParams.delete('tab')
    } else {
      nextParams.set('tab', tabId)
    }
    setSearchParams(nextParams)
  }

  const handleSortChange = (sortId) => {
    const nextParams = new URLSearchParams(searchParams)
    if (sortId === 'featured') {
      nextParams.delete('sort')
    } else {
      nextParams.set('sort', sortId)
    }
    setSearchParams(nextParams)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
      <p className="mt-2 text-slate-600">
        Selected work. Full stack, ML, and embedded.
      </p>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        Last updated: {PROJECTS_LAST_UPDATED}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 justify-between">
        <div
          className="inline-flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
          role="tablist"
          aria-label="Filter projects"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="projects-grid"
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? tab.id === 'featured'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : tab.id === 'mini'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : tab.id === 'ml-ai'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : tab.id === 'bio'
                      ? 'bg-emerald-600 text-white shadow-sm'
                    : tab.id === 'school'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : tab.id === 'freelance'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-projects" className="text-xs font-medium text-slate-500">
            Sort
          </label>
          <select
            id="sort-projects"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul
        id="projects-grid"
        className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-3"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {filteredAndSorted.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} listSearch={listSearch} />
          </li>
        ))}
      </ul>

      {filteredAndSorted.length === 0 && (
        <p className="mt-8 text-slate-500">No projects in this category yet.</p>
      )}
    </div>
  )
}

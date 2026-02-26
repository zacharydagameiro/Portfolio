import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import ProjectList from './pages/ProjectList'
import ProjectPage from './pages/ProjectPage'

const Resumes = lazy(() => import('./pages/Resumes'))
const ResumeViewer = lazy(() => import('./pages/ResumeViewer'))

function RouteFallback() {
  return <p className="px-4 py-10 text-sm text-slate-600">Loading…</p>
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route
          path="/resumes"
          element={(
            <Suspense fallback={<RouteFallback />}>
              <Resumes />
            </Suspense>
          )}
        />
        <Route
          path="/resumes/:name"
          element={(
            <Suspense fallback={<RouteFallback />}>
              <ResumeViewer />
            </Suspense>
          )}
        />
      </Routes>
    </Layout>
  )
}

export default App

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { getResumeByName } from '../utils/resumes'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export default function ResumeViewer() {
  const { name } = useParams()
  const resume = useMemo(() => getResumeByName(name), [name])
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const viewerRef = useRef(null)

  useEffect(() => {
    document.title = resume ? `${resume.title} | Zachary Gameiro` : 'Resume not found | Zachary Gameiro'
  }, [resume])

  useEffect(() => {
    setPageNumber(1)
    setZoom(1)
  }, [name])

  useEffect(() => {
    if (!viewerRef.current) return undefined
    const observer = new ResizeObserver((entries) => {
      const width = entries?.[0]?.contentRect?.width
      if (typeof width === 'number') setContainerWidth(width)
    })
    observer.observe(viewerRef.current)
    return () => observer.disconnect()
  }, [])

  const pageWidth = containerWidth ? Math.floor(Math.min(containerWidth, 920) * zoom) : undefined

  if (!resume) {
    return (
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Resume not found</h1>
        <Link to="/resumes" className="mt-4 inline-block text-slate-600 underline hover:text-slate-900">
          Back to resumes
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{resume.label}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{resume.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/resumes"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </Link>
          <a
            href={resume.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open PDF <span className="ml-1" aria-hidden>↗</span>
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
          disabled={numPages === 0 || pageNumber >= numPages}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
        <span className="text-slate-600">
          Page {pageNumber}{numPages ? ` / ${numPages}` : ''}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(2))))}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition hover:bg-slate-50"
          >
            -
          </button>
          <span className="w-14 text-center text-slate-600">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))))}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      <div ref={viewerRef} className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-2 sm:p-4">
        <div className="mx-auto w-fit">
          <Document
            file={resume.href}
            onLoadSuccess={({ numPages: loadedPages }) => {
              setNumPages(loadedPages)
              setPageNumber((current) => Math.min(Math.max(1, current), loadedPages))
            }}
            loading={<p className="p-6 text-sm text-slate-600">Loading PDF…</p>}
            error={<p className="p-6 text-sm text-red-600">Could not load this PDF.</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderAnnotationLayer
              renderTextLayer
              loading={<p className="p-6 text-sm text-slate-600">Rendering page…</p>}
            />
          </Document>
        </div>
      </div>
    </section>
  )
}

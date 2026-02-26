export default function Modal({ isOpen, onClose, title, children, maxWidthClass = 'max-w-lg' }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className={`relative z-10 w-full ${maxWidthClass} rounded-2xl bg-white p-5 shadow-xl sm:p-6`}>
        <div className="flex items-start justify-between gap-4">
          {title && (
            <h2 className="text-base font-semibold leading-6 text-slate-900">
              {title}
            </h2>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
            onClick={onClose}
            aria-label="Close dialog"
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

        <div className="mt-3 text-sm text-slate-600">
          {children}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

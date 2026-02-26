export default function SidebarTooltip({ text, children }) {
  return (
    <span className="group relative inline-flex cursor-default">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md bg-slate-800 px-2.5 py-1.5 text-center text-xs font-medium text-white shadow-lg group-hover:block"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" aria-hidden />
      </span>
    </span>
  )
}

export default function SidebarSection({
  title,
  icon = null,
  divider = true,
  className = '',
  headingClassName = '',
  children,
}) {
  return (
    <section className={`${divider ? 'border-t border-slate-100 pt-6' : ''} ${className}`.trim()}>
      {title && (
        <h3 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 ${headingClassName}`.trim()}>
          {icon}
          {title}
        </h3>
      )}
      {children}
    </section>
  )
}


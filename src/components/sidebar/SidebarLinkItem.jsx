import { ContactIcon, ExternalLinkIcon } from './SidebarIcons'

const isExternalLink = (href) => /^https?:\/\//i.test(href || '')

export default function SidebarLinkItem({
  href,
  label,
  iconType = 'website',
  external = true,
  className = '',
}) {
  const shouldOpenExternal = external && isExternalLink(href)
  const text = label || href || ''

  return (
    <a
      href={href}
      target={shouldOpenExternal ? '_blank' : undefined}
      rel={shouldOpenExternal ? 'noopener noreferrer' : undefined}
      className={`group flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md text-sm text-slate-700 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`.trim()}
    >
      <ContactIcon type={iconType} className="h-4 w-4 shrink-0 text-slate-500" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      {shouldOpenExternal && <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />}
    </a>
  )
}

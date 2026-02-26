export default function SidebarCard({ as: Component = 'div', className = '', children }) {
  return (
    <Component className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}>
      {children}
    </Component>
  )
}


import { resolveAssetUrl } from '../../utils/assetUrl'

export default function SidebarProfileHeader({
  name,
  profileImageUrl,
  taglinePrimary = '',
  taglineSecondary = '',
}) {
  const resolvedProfileImageUrl = resolveAssetUrl(profileImageUrl)
  const hasTagline = Boolean(taglinePrimary || taglineSecondary)

  if (!name && !resolvedProfileImageUrl) return null

  return (
    <section className="flex flex-col items-center pb-6 text-center">
      {resolvedProfileImageUrl && (
        <img
          src={resolvedProfileImageUrl}
          alt={name || 'Profile'}
          className="h-28 w-28 rounded-full border-2 border-slate-200 object-cover"
        />
      )}

      {name && <h2 className="mt-3 text-lg font-semibold text-slate-900">{name}</h2>}

      {hasTagline && (
        <div className="mt-2 space-y-1">
          {taglinePrimary && <p className="text-xs leading-snug text-slate-600">{taglinePrimary}</p>}
          {taglineSecondary && <p className="text-[11px] font-medium text-slate-700">{taglineSecondary}</p>}
        </div>
      )}
    </section>
  )
}

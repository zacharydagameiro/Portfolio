const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i

export function resolveAssetUrl(value) {
  if (typeof value !== 'string' || value.length === 0) return value

  if (
    ABSOLUTE_URL_PATTERN.test(value) ||
    value.startsWith('data:') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('#')
  ) {
    return value
  }

  if (!value.startsWith('/')) return value

  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return value
  return `${base.replace(/\/+$/, '')}${value}`
}

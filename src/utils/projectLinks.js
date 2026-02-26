const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

export const toProjectLink = (value) => {
  if (!value) return null

  if (isNonEmptyString(value)) {
    return { url: value.trim(), label: '' }
  }

  if (typeof value === 'object' && value !== null && isNonEmptyString(value.url)) {
    return {
      url: value.url.trim(),
      label: isNonEmptyString(value.label) ? value.label.trim() : ''
    }
  }

  return null
}

export const getProjectLinkText = (link) => {
  if (!link) return ''
  return isNonEmptyString(link.label) ? link.label : link.url
}

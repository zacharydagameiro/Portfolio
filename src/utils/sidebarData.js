const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const normalizeContact = (value) => {
  const contact = value && typeof value === 'object' ? value : {}
  return {
    email: normalizeText(contact.email),
    phone: normalizeText(contact.phone),
    github: normalizeText(contact.github),
    linkedin: normalizeText(contact.linkedin),
  }
}

const normalizeLocationItem = (value) => {
  if (typeof value === 'string') {
    const label = normalizeText(value)
    return label ? { label, icon: '', tooltip: '' } : null
  }

  if (value && typeof value === 'object') {
    const label = normalizeText(value.label || value.name)
    if (!label) return null
    return {
      label,
      icon: normalizeText(value.icon),
      tooltip: normalizeText(value.tooltip),
    }
  }

  return null
}

const normalizeLocations = (about) => {
  const list = Array.isArray(about?.locations)
    ? about.locations
    : Array.isArray(about?.location)
      ? about.location
      : about?.location
        ? [about.location]
        : []

  return list.map(normalizeLocationItem).filter(Boolean)
}

const normalizeLanguageItem = (value) => {
  if (typeof value === 'string') {
    const label = normalizeText(value)
    return label ? { label, tooltip: '' } : null
  }

  if (value && typeof value === 'object') {
    const label = normalizeText(value.label || value.name)
    if (!label) return null
    return {
      label,
      tooltip: normalizeText(value.tooltip),
    }
  }

  return null
}

const normalizeLanguages = (value) => {
  const list = Array.isArray(value) ? value : value ? [value] : []
  return list.map(normalizeLanguageItem).filter(Boolean)
}

const normalizeSkills = (value) => (value && typeof value === 'object' ? value : {})

const getTaglinePrimary = (value) => {
  const tagline = normalizeText(value)
  if (!tagline) return ''
  const [primaryPart] = tagline.split('|').map((part) => part.trim())
  return primaryPart.replace(/\s+Student\b/i, '').trim()
}

const buildSocialLinks = (about, contact) => {
  const links = about?.links && typeof about.links === 'object' ? about.links : {}
  const candidates = [
    { key: 'github', label: 'GitHub', href: normalizeText(links.github || contact.github), type: 'github' },
    { key: 'linkedin', label: 'LinkedIn', href: normalizeText(links.linkedin || contact.linkedin), type: 'linkedin' },
    { key: 'website', label: 'Website', href: normalizeText(links.website), type: 'website' },
  ]

  const unique = new Set()
  return candidates
    .filter((item) => item.href)
    .filter((item) => {
      if (unique.has(item.href)) return false
      unique.add(item.href)
      return true
    })
}

export const normalizeSidebarData = (about) => {
  const source = about && typeof about === 'object' ? about : {}
  const contact = normalizeContact(source.contact)

  return {
    name: normalizeText(source.name),
    profileImageUrl: normalizeText(source.profileImageUrl),
    taglinePrimary: getTaglinePrimary(source.tagline),
    taglineSecondary: '',
    contact,
    locations: normalizeLocations(source),
    languages: normalizeLanguages(source.languages),
    skills: normalizeSkills(source.skills),
    socialLinks: buildSocialLinks(source, contact),
  }
}


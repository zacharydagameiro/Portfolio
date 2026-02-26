import resumesData from '../data/resumes.json'
import { resolveAssetUrl } from './assetUrl'

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')
const normalizeKey = (value) => normalizeText(value).toLowerCase()

export const getResumes = () =>
  (Array.isArray(resumesData) ? resumesData : [])
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const uri = normalizeText(item.uri)
      if (!uri) return null

      const name = normalizeText(item.name) || normalizeText(item.label) || normalizeText(item.title) || uri
      const title = normalizeText(item.title) || normalizeText(item.label) || name || 'Resume'
      const label = normalizeText(item.label) || normalizeText(item.title) || name || 'Resume'

      return {
        name: normalizeKey(name),
        title,
        label,
        href: resolveAssetUrl(uri),
        description: normalizeText(item.description)
      }
    })
    .filter(Boolean)

export const getResumeByName = (name) => {
  const targetName = normalizeKey(name)
  if (!targetName) return null
  return getResumes().find((resume) => resume.name === targetName) || null
}

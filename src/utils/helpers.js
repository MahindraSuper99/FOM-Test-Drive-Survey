// Strips characters that enable HTML/script injection while leaving normal
// punctuation intact, since this text can end up rendered elsewhere downstream.
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value

  return value
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function formatDateLocal(date) {
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date)
}

export function isExpired(expires) {
  if (!expires) return false
  const expiryDate = new Date(expires)
  if (Number.isNaN(expiryDate.getTime())) return false
  const endOfExpiryDay = new Date(expiryDate)
  endOfExpiryDay.setHours(23, 59, 59, 999)
  return Date.now() > endOfExpiryDay.getTime()
}

// Shared defensive helpers for the public demonstration API routes.
export function applyApiSecurityHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-Frame-Options', 'DENY')
}

export function isSameOriginRequest(req) {
  const fetchSite = req.headers?.['sec-fetch-site']
  if (fetchSite === 'cross-site') return false

  const origin = req.headers?.origin
  if (!origin) return true

  const host = req.headers?.host
  if (typeof host !== 'string' || !host) return false

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}

export function isJsonRequest(req) {
  const contentType = req.headers?.['content-type']
  return !contentType || /^application\/json(?:\s*;|$)/i.test(contentType)
}

export function exceedsBodyLimit(req, maxBytes) {
  const rawLength = req.headers?.['content-length']
  if (rawLength === undefined) return false
  const length = Number(rawLength)
  return !Number.isFinite(length) || length < 0 || length > maxBytes
}

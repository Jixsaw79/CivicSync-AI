// Deterministic civic insights for the hackathon prototype.
// This endpoint analyzes only the report snapshot supplied by the browser.
// It does not persist reports, contact municipal systems, or make operational decisions.
import { applyApiSecurityHeaders, exceedsBodyLimit, isJsonRequest, isSameOriginRequest } from '../_security.js'

const statuses = new Set(['Pending', 'Assigned', 'Dispatched', 'In progress', 'Resolved'])
const categories = new Set(['Road damage', 'Waterlogging', 'Streetlight', 'Waste accumulation', 'Other'])
const allowedFields = new Set(['id', 'title', 'category', 'zone', 'zoneId', 'severity', 'impact', 'status', 'age', 'createdAt'])
const MAX_BODY_BYTES = 256 * 1024
const MAX_REPORTS = 500
const MAX_IMPACT = 1_000_000_000

function send(res, status, body) {
  applyApiSecurityHeaders(res)
  return res.status(status).json(body)
}

function ageHours(report, now) {
  if (typeof report.createdAt === 'string') {
    const timestamp = Date.parse(report.createdAt)
    if (Number.isFinite(timestamp)) return Math.max(0, (now - timestamp) / 3_600_000)
  }
  if (typeof report.age === 'string') {
    const match = report.age.match(/(\d+(?:\.\d+)?)\s*(min|minute|hr|hour|day)/i)
    if (match) {
      const value = Number(match[1])
      const unit = match[2].toLowerCase()
      return value * (unit.startsWith('min') ? 1 / 60 : unit.startsWith('day') ? 24 : 1)
    }
    if (/yesterday/i.test(report.age)) return 24
    if (/just now/i.test(report.age)) return 0
  }
  return 0
}

function scoreReport(report, maxImpact, now) {
  const severity = report.severity
  const impactScore = maxImpact > 0 ? Math.round((report.impact / maxImpact) * 100) : 0
  const hours = ageHours(report, now)
  const ageScore = Math.min(100, Math.round((hours / 72) * 100))
  const score = Math.round(severity * 0.6 + impactScore * 0.25 + ageScore * 0.15)
  const reasons = []
  if (severity >= 85) reasons.push('High severity score')
  if (impactScore >= 70) reasons.push('Large estimated population impact')
  if (hours >= 24) reasons.push('Open for at least one day')
  if (report.category === 'Waterlogging' && severity >= 75) reasons.push('Potential drainage and access disruption')
  if (reasons.length === 0) reasons.push('Ranked by combined severity, estimated impact and reported age')
  return { score, reasons }
}

function buildInsights(reports, now = Date.now()) {
  const open = reports.filter((report) => report.status !== 'Resolved')
  const resolved = reports.length - open.length
  const maxImpact = Math.max(0, ...open.map((report) => report.impact))
  const priorities = open.map((report) => {
    const ranking = scoreReport(report, maxImpact, now)
    return {
      id: report.id,
      title: report.title,
      category: report.category,
      zone: report.zone,
      status: report.status,
      priorityScore: ranking.score,
      reasons: ranking.reasons,
    }
  }).sort((a, b) => b.priorityScore - a.priorityScore || a.id.localeCompare(b.id)).slice(0, 5)

  const countBy = (key) => {
    const totals = new Map()
    for (const report of open) {
      const label = report[key] || 'Unspecified'
      totals.set(label, (totals.get(label) || 0) + 1)
    }
    return [...totals.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }

  const topCategory = countBy('category')[0]
  const topZone = countBy('zone')[0]
  const summary = open.length === 0
    ? 'There are no open reports in the submitted demonstration snapshot.'
    : `${open.length} of ${reports.length} reports remain open. ${topCategory?.name || 'No category'} is the most common open issue${topZone ? `, with the highest open-report volume in ${topZone.name}` : ''}.`

  return {
    summary,
    totals: { reports: reports.length, open: open.length, resolved },
    patterns: { categories: countBy('category'), zones: countBy('zone') },
    priorities,
    method: 'Rule-based score: 60% severity, 25% relative estimated impact, 15% reported age (capped at 72 hours).',
    generatedAt: new Date(now).toISOString(),
    demoMode: true,
    requiresHumanReview: true,
  }
}

function isValidReport(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) return false
  if (Object.keys(report).some((key) => !allowedFields.has(key))) return false
  if (
    typeof report.id !== 'string' || !report.id.trim() || report.id.length > 80 ||
    typeof report.title !== 'string' || !report.title.trim() || report.title.length > 180 ||
    !categories.has(report.category) ||
    typeof report.zone !== 'string' || !report.zone.trim() || report.zone.length > 100 ||
    !Number.isFinite(report.severity) || report.severity < 0 || report.severity > 100 ||
    !Number.isFinite(report.impact) || report.impact < 0 || report.impact > MAX_IMPACT ||
    !statuses.has(report.status) ||
    (report.zoneId !== undefined && (typeof report.zoneId !== 'string' || report.zoneId.length > 80)) ||
    (report.age !== undefined && (typeof report.age !== 'string' || report.age.length > 40)) ||
    (report.createdAt !== undefined && (typeof report.createdAt !== 'string' || report.createdAt.length > 40))
  ) return false
  return true
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'Method not allowed' })
  }
  if (!isSameOriginRequest(req)) return send(res, 403, { error: 'Cross-origin requests are not allowed.' })
  if (!isJsonRequest(req)) return send(res, 415, { error: 'Content-Type must be application/json.' })
  if (exceedsBodyLimit(req, MAX_BODY_BYTES)) return send(res, 413, { error: 'Request body is too large.' })

  const reports = req.body?.reports
  if (!Array.isArray(reports) || reports.length < 1 || reports.length > MAX_REPORTS) {
    return send(res, 400, { error: 'Reports must be an array containing 1–500 items.' })
  }
  if (!reports.every(isValidReport)) return send(res, 400, { error: 'A report contains invalid or unsupported fields.' })
  if (new Set(reports.map((report) => report.id)).size !== reports.length) {
    return send(res, 400, { error: 'Report identifiers must be unique.' })
  }

  return send(res, 200, { insights: buildInsights(reports) })
}

export { buildInsights, isValidReport }

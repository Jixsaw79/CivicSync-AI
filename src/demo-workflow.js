export const demoStaff = [
  { id: 'staff-engineering', name: 'A. Rahman', department: 'Engineering' },
  { id: 'staff-drainage', name: 'N. Islam', department: 'Drainage & Water' },
  { id: 'staff-waste', name: 'S. Ahmed', department: 'Waste Management' },
  { id: 'staff-electrical', name: 'M. Hasan', department: 'Electrical Services' },
  { id: 'staff-general', name: 'T. Chowdhury', department: 'Municipal Response' },
]

export function reportAgeHours(report, now = Date.now()) {
  const dateValue = report.createdAt || report.history?.[0]?.at
  if (dateValue) {
    const timestamp = Date.parse(dateValue)
    if (Number.isFinite(timestamp)) return Math.max(0, (now - timestamp) / 3600000)
  }
  const age = String(report.age || '')
  const match = age.match(/(\d+(?:\.\d+)?)\s*(min|minute|hr|hour|day)/i)
  if (match) {
    const value = Number(match[1])
    const unit = match[2].toLowerCase()
    return value * (unit.startsWith('min') ? 1 / 60 : unit.startsWith('day') ? 24 : 1)
  }
  if (/yesterday/i.test(age)) return 24
  if (/just now/i.test(age)) return 0
  return 0
}

export function getComplaintHotspots(reports) {
  const totals = new Map()
  for (const report of reports) {
    const key = report.zone || 'Unspecified area'
    const current = totals.get(key) || { zone: key, total: 0, open: 0, critical: 0, categories: {} }
    current.total += 1
    if (report.status !== 'Resolved') current.open += 1
    if (report.severity >= 85) current.critical += 1
    current.categories[report.category] = (current.categories[report.category] || 0) + 1
    totals.set(key, current)
  }
  return [...totals.values()].sort((a, b) => b.open - a.open || b.critical - a.critical || a.zone.localeCompare(b.zone))
}

export function getEscalatedReports(reports, now = Date.now()) {
  return reports
    .filter((report) => report.status !== 'Resolved')
    .map((report) => ({ ...report, ageHours: reportAgeHours(report, now) }))
    .filter((report) => report.ageHours >= 48 || report.severity >= 90)
    .sort((a, b) => b.severity - a.severity || b.ageHours - a.ageHours)
}

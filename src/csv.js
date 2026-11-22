const columns = ['id', 'title', 'category', 'zone', 'severity', 'status', 'impact', 'cost', 'createdAt']

export function escapeCsvCell(value) {
  const text = String(value ?? '')
  // Prefix formula-like cells even when control characters or whitespace precede the operator.
  const formulaLike = /^[\u0000-\u0020\u007f-\u009f]*[=+\-@]/.test(text)
  const safeText = formulaLike ? "'" + text : text
  return '"' + safeText.replace(/"/g, '""') + '"'
}

export function buildReportsCsv(reports) {
  const rows = [columns, ...reports.map((report) => columns.map((key) => report[key] ?? ''))]
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')
}

// Deterministic civic insights for the hackathon prototype.
// This endpoint analyzes only the report snapshot supplied by the browser.
// It does not persist reports, contact municipal systems, or make operational decisions.

const statuses = new Set(['Pending', 'Assigned', 'Dispatched', 'In progress', 'Resolved']);
const categories = new Set(['Road damage', 'Waterlogging', 'Streetlight', 'Waste accumulation', 'Other']);
const allowedFields = ['id', 'title', 'category', 'zone', 'zoneId', 'severity', 'impact', 'status', 'age', 'createdAt'];

function send(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function ageHours(report, now) {
  if (typeof report.createdAt === 'string') {
    const timestamp = Date.parse(report.createdAt);
    if (Number.isFinite(timestamp)) return Math.max(0, (now - timestamp) / 3_600_000);
  }
  if (typeof report.age === 'string') {
    const match = report.age.match(/(\d+(?:\.\d+)?)\s*(min|minute|hr|hour|day)/i);
    if (match) {
      const value = Number(match[1]);
      const unit = match[2].toLowerCase();
      return value * (unit.startsWith('min') ? 1 / 60 : unit.startsWith('day') ? 24 : 1);
    }
    if (/yesterday/i.test(report.age)) return 24;
    if (/just now/i.test(report.age)) return 0;
  }
  return 0;
}

function scoreReport(report, maxImpact, now) {
  const severity = report.severity;
  const impactScore = maxImpact > 0 ? Math.round((report.impact / maxImpact) * 100) : 0;
  const hours = ageHours(report, now);
  const ageScore = Math.min(100, Math.round((hours / 72) * 100));
  const score = Math.round(severity * 0.6 + impactScore * 0.25 + ageScore * 0.15);
  const reasons = [];
  if (severity >= 85) reasons.push('High severity score');
  if (impactScore >= 70) reasons.push('Large estimated population impact');
  if (hours >= 24) reasons.push('Open for at least one day');
  if (report.category === 'Waterlogging' && severity >= 75) reasons.push('Potential drainage and access disruption');
  if (reasons.length === 0) reasons.push('Ranked by combined severity, estimated impact and reported age');
  return { score, reasons, hours };
}

function buildInsights(reports, now = Date.now()) {
  const open = reports.filter((report) => report.status !== 'Resolved');
  const resolved = reports.length - open.length;
  const maxImpact = Math.max(0, ...open.map((report) => report.impact));
  const priorities = open.map((report) => {
    const ranking = scoreReport(report, maxImpact, now);
    return {
      id: report.id,
      title: report.title,
      category: report.category,
      zone: report.zone,
      status: report.status,
      priorityScore: ranking.score,
      reasons: ranking.reasons,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 5);

  const countBy = (key) => {
    const totals = new Map();
    for (const report of open) {
      const label = report[key] || 'Unspecified';
      totals.set(label, (totals.get(label) || 0) + 1);
    }
    return [...totals.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  };

  const topCategory = countBy('category')[0];
  const topZone = countBy('zone')[0];
  const summary = open.length === 0
    ? 'There are no open reports in the submitted demonstration snapshot.'
    : `${open.length} of ${reports.length} reports remain open. ${topCategory?.name || 'No category'} is the most common open issue${topZone ? `, with the highest open-report volume in ${topZone.name}` : ''}.`;

  return {
    summary,
    totals: { reports: reports.length, open: open.length, resolved },
    patterns: { categories: countBy('category'), zones: countBy('zone') },
    priorities,
    method: 'Rule-based score: 60% severity, 25% relative estimated impact, 15% reported age (capped at 72 hours).',
    generatedAt: new Date(now).toISOString(),
    demoMode: true,
    requiresHumanReview: true,
  };
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  const reports = req.body?.reports;
  if (!Array.isArray(reports) || reports.length < 1 || reports.length > 250) {
    return send(res, 400, { error: 'Reports must be an array containing 1–250 items.' });
  }

  for (const report of reports) {
    if (!report || typeof report !== 'object' || Array.isArray(report)) {
      return send(res, 400, { error: 'Each report must be an object.' });
    }
    if (
      typeof report.id !== 'string' || report.id.length > 80 ||
      typeof report.title !== 'string' || report.title.length > 180 ||
      !categories.has(report.category) ||
      typeof report.zone !== 'string' || report.zone.length > 100 ||
      !Number.isFinite(report.severity) || report.severity < 0 || report.severity > 100 ||
      !Number.isFinite(report.impact) || report.impact < 0 ||
      !statuses.has(report.status)
    ) return send(res, 400, { error: 'A report contains invalid or unsupported fields.' });
  }

  return send(res, 200, { insights: buildInsights(reports) });
}

export { buildInsights };

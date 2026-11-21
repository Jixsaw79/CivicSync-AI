// Simulated DNCC adapter for hackathon demonstrations only.
// All assignments and service targets below are synthetic, not official DNCC data.
const departments = [
  { id: 'engineering', name: 'Engineering', handles: ['Road damage', 'Streetlight'], demoSlaHours: 48 },
  { id: 'waste', name: 'Waste Management', handles: ['Waste accumulation'], demoSlaHours: 24 },
  { id: 'health', name: 'Health', handles: ['Public health hazards'], demoSlaHours: 24 },
  { id: 'urban-planning', name: 'Urban Planning', handles: ['Other'], demoSlaHours: 72 },
  { id: 'drainage', name: 'Drainage & Water', handles: ['Waterlogging'], demoSlaHours: 12 },
]

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  return res.status(200).json({
    municipality: 'Dhaka North City Corporation',
    adapter: 'CivicSync mock municipal adapter',
    mode: 'DEMONSTRATION',
    connectedToGovernment: false,
    departments,
    sampleWards: Array.from({ length: 10 }, (_, index) => ({
      wardNumber: index + 1,
      label: `Demo ward ${index + 1}`,
      boundaryStatus: 'illustrative_only',
    })),
    disclaimer: 'Synthetic demonstration data. Not an official DNCC service, directory, SLA, ward dataset or complaint channel.',
  })
}

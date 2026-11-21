export const zones = [
  { id: 'commercial', name: 'Commercial Hub', short: 'CH', x: 2, y: 1, density: 92, reports: 38, population: 42000, color: 'hot', latitude: 23.7808, longitude: 90.4169 },
  { id: 'north', name: 'Residential North', short: 'RN', x: 1, y: 0, density: 64, reports: 24, population: 31500, color: 'warm', latitude: 23.8759, longitude: 90.3795 },
  { id: 'industrial', name: 'Industrial Corridor', short: 'IC', x: 3, y: 2, density: 78, reports: 31, population: 18500, color: 'hot', latitude: 23.7958, longitude: 90.4504 },
  { id: 'riverfront', name: 'Riverfront District', short: 'RD', x: 0, y: 3, density: 87, reports: 29, population: 22000, color: 'hot', latitude: 23.8042, longitude: 90.3615 },
  { id: 'university', name: 'University Quarter', short: 'UQ', x: 2, y: 0, density: 36, reports: 12, population: 26800, color: 'cool', latitude: 23.8060, longitude: 90.3680 },
  { id: 'east', name: 'East Gardens', short: 'EG', x: 3, y: 0, density: 22, reports: 8, population: 19400, color: 'cool', latitude: 23.7806, longitude: 90.4264 },
  { id: 'south', name: 'South Market', short: 'SM', x: 1, y: 2, density: 57, reports: 19, population: 28700, color: 'warm', latitude: 23.7650, longitude: 90.3580 },
  { id: 'civic', name: 'Civic Centre', short: 'CC', x: 2, y: 3, density: 18, reports: 6, population: 12600, color: 'cool', latitude: 23.7937, longitude: 90.4066 },
]

export const initialReports = [
  { id: 'CS-2048', title: 'Major road surface failure', category: 'Road damage', zone: 'Commercial Hub', zoneId: 'commercial', severity: 94, status: 'Dispatched', unit: 'Roads & Highways', impact: 8200, cost: 18500, age: '18 min ago', description: 'Large damaged section near the central bus terminal.', duplicate: 'Merged with 3 nearby reports' },
  { id: 'CS-2047', title: 'Street flooding after rainfall', category: 'Waterlogging', zone: 'Riverfront District', zoneId: 'riverfront', severity: 91, status: 'In progress', unit: 'Drainage & Water', impact: 6400, cost: 12300, age: '42 min ago', description: 'Water accumulating along the riverside access road.', duplicate: '2 related reports nearby' },
  { id: 'CS-2046', title: 'Multiple streetlights not working', category: 'Streetlight', zone: 'Industrial Corridor', zoneId: 'industrial', severity: 82, status: 'Pending', unit: 'Electrical Services', impact: 5100, cost: 4600, age: '1 hr ago', description: 'Dark stretch affecting the evening commute.', duplicate: 'Merged with 2 nearby reports' },
  { id: 'CS-2045', title: 'Overflowing public waste bins', category: 'Waste accumulation', zone: 'Residential North', zoneId: 'north', severity: 68, status: 'Pending', unit: 'Waste Management', impact: 2900, cost: 1800, age: '2 hrs ago', description: 'Collection point has exceeded capacity.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2044', title: 'Broken pavement near school', category: 'Road damage', zone: 'South Market', zoneId: 'south', severity: 76, status: 'Assigned', unit: 'Roads & Highways', impact: 3700, cost: 7200, age: '3 hrs ago', description: 'Uneven pavement on a busy pedestrian route.', duplicate: '1 related report nearby' },
  { id: 'CS-2043', title: 'Blocked storm drain', category: 'Waterlogging', zone: 'Commercial Hub', zoneId: 'commercial', severity: 88, status: 'Pending', unit: 'Drainage & Water', impact: 7100, cost: 5400, age: '4 hrs ago', description: 'Drain cover and inlet appear obstructed.', duplicate: 'Merged with 4 nearby reports' },
  { id: 'CS-2042', title: 'Illegal waste dumping', category: 'Waste accumulation', zone: 'University Quarter', zoneId: 'university', severity: 53, status: 'Resolved', unit: 'Waste Management', impact: 1600, cost: 950, age: 'Yesterday', description: 'Waste reported beside a public walkway.', duplicate: 'No duplicate cluster found' },
]

export const allocationData = [
  { zone: 'Commercial', traditional: 22, optimized: 31 },
  { zone: 'Riverfront', traditional: 18, optimized: 26 },
  { zone: 'Industrial', traditional: 25, optimized: 21 },
  { zone: 'Residential N.', traditional: 20, optimized: 14 },
  { zone: 'South Market', traditional: 15, optimized: 8 },
]

export const departmentFor = (category) => ({
  'Road damage': 'Roads & Highways',
  Waterlogging: 'Drainage & Water',
  Streetlight: 'Electrical Services',
  'Waste accumulation': 'Waste Management',
}[category] || 'Municipal Response')

export const severityFor = (category, note = '') => {
  const base = { 'Road damage': 72, Waterlogging: 84, Streetlight: 59, 'Waste accumulation': 52 }[category] || 55
  const urgent = /hospital|school|blocked|danger|major|severe|flood/i.test(note) ? 12 : 0
  return Math.min(98, base + urgent + Math.floor(note.length / 45))
}

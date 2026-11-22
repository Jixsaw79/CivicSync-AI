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
  { id: 'CS-2042', title: 'Illegal waste dumping', category: 'Waste accumulation', zone: 'University Quarter', zoneId: 'university', severity: 53, status: 'Resolved', unit: 'Waste Management', impact: 1600, cost: 950, age: 'Yesterday', description: 'Waste reported beside a public walkway.', duplicate: 'No duplicate cluster found' },,

  { id: 'CS-2041', title: 'Damaged footpath tiles', category: 'Road damage', zone: 'University Quarter', zoneId: 'university', severity: 61, status: 'In progress', unit: 'Roads & Highways', impact: 2100, cost: 3200, age: '5 hrs ago', description: 'Loose pavement tiles creating a trip hazard near a busy pedestrian route.', duplicate: '1 related report nearby' },
  { id: 'CS-2040', title: 'Drain cover missing', category: 'Waterlogging', zone: 'East Gardens', zoneId: 'east', severity: 89, status: 'Dispatched', unit: 'Drainage & Water', impact: 4600, cost: 6100, age: '6 hrs ago', description: 'An uncovered drain is creating a safety risk for pedestrians and vehicles.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2039', title: 'Waste collection delayed', category: 'Waste accumulation', zone: 'South Market', zoneId: 'south', severity: 58, status: 'Pending', unit: 'Waste Management', impact: 1800, cost: 1400, age: '7 hrs ago', description: 'Household waste has remained at the collection point beyond the usual pickup window.', duplicate: '2 related reports nearby' },
  { id: 'CS-2038', title: 'Streetlight outage on access road', category: 'Streetlight', zone: 'Civic Centre', zoneId: 'civic', severity: 73, status: 'Assigned', unit: 'Electrical Services', impact: 3300, cost: 2800, age: '8 hrs ago', description: 'Several lights are not working along a frequently used access road.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2037', title: 'Waterlogging near market entrance', category: 'Waterlogging', zone: 'South Market', zoneId: 'south', severity: 86, status: 'In progress', unit: 'Drainage & Water', impact: 5900, cost: 8400, age: 'Yesterday', description: 'Standing water is affecting market access and nearby shops.', duplicate: 'Merged with 2 nearby reports' },
  { id: 'CS-2036', title: 'Illegal dumping beside canal', category: 'Waste accumulation', zone: 'Riverfront District', zoneId: 'riverfront', severity: 77, status: 'Pending', unit: 'Waste Management', impact: 2600, cost: 2100, age: 'Yesterday', description: 'Construction debris and household waste have been left beside the canal path.', duplicate: '1 related report nearby' },
  { id: 'CS-2035', title: 'Pothole on school approach road', category: 'Road damage', zone: 'Residential North', zoneId: 'north', severity: 90, status: 'Dispatched', unit: 'Roads & Highways', impact: 6800, cost: 9600, age: 'Yesterday', description: 'A deep pothole is affecting vehicles and students near a school entrance.', duplicate: 'Merged with 3 nearby reports' },
  { id: 'CS-2034', title: 'Pedestrian crossing light failure', category: 'Streetlight', zone: 'Commercial Hub', zoneId: 'commercial', severity: 79, status: 'Resolved', unit: 'Electrical Services', impact: 4100, cost: 3500, age: '2 days ago', description: 'Crossing illumination failed at a busy junction; temporary repair completed.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2033', title: 'Blocked roadside drain', category: 'Waterlogging', zone: 'Industrial Corridor', zoneId: 'industrial', severity: 84, status: 'Assigned', unit: 'Drainage & Water', impact: 5200, cost: 4700, age: '2 days ago', description: 'A roadside drain is blocked by silt and plastic waste.', duplicate: 'Merged with 2 nearby reports' },
  { id: 'CS-2032', title: 'Overflowing community bin', category: 'Waste accumulation', zone: 'East Gardens', zoneId: 'east', severity: 49, status: 'Resolved', unit: 'Waste Management', impact: 1200, cost: 900, age: '2 days ago', description: 'Community bin was overflowing; collection completed in this demonstration.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2031', title: 'Broken road edge near bus stop', category: 'Road damage', zone: 'Commercial Hub', zoneId: 'commercial', severity: 81, status: 'Pending', unit: 'Roads & Highways', impact: 5700, cost: 7900, age: '3 days ago', description: 'The road edge has broken away near a busy bus stop.', duplicate: '2 related reports nearby' },
  { id: 'CS-2030', title: 'Streetlight pole damaged', category: 'Streetlight', zone: 'Riverfront District', zoneId: 'riverfront', severity: 92, status: 'In progress', unit: 'Electrical Services', impact: 3900, cost: 5200, age: '3 days ago', description: 'A damaged pole requires inspection and isolation before repair.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2029', title: 'Standing water at service lane', category: 'Waterlogging', zone: 'University Quarter', zoneId: 'university', severity: 66, status: 'Resolved', unit: 'Drainage & Water', impact: 2400, cost: 3100, age: '4 days ago', description: 'A blocked inlet was cleared and water flow restored in the demo record.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2028', title: 'Missed waste pickup', category: 'Waste accumulation', zone: 'Civic Centre', zoneId: 'civic', severity: 42, status: 'Pending', unit: 'Waste Management', impact: 900, cost: 750, age: '4 days ago', description: 'A scheduled collection point has not been serviced.', duplicate: 'No duplicate cluster found' },
  { id: 'CS-2027', title: 'Uneven pavement at clinic access', category: 'Road damage', zone: 'East Gardens', zoneId: 'east', severity: 87, status: 'Assigned', unit: 'Roads & Highways', impact: 4400, cost: 6800, age: '5 days ago', description: 'Uneven pavement may affect access for patients and pedestrians.', duplicate: '1 related report nearby' },
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

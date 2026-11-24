import test from 'node:test'
import assert from 'node:assert/strict'
import { getComplaintHotspots, getEscalatedReports, reportAgeHours } from '../src/demo-workflow.js'

test('hotspots rank areas by open complaints and expose category mix', () => {
  const result = getComplaintHotspots([
    { zone: 'North', category: 'Road damage', status: 'Pending', severity: 90 },
    { zone: 'North', category: 'Waterlogging', status: 'Resolved', severity: 40 },
    { zone: 'South', category: 'Streetlight', status: 'In progress', severity: 70 },
    { zone: 'South', category: 'Streetlight', status: 'Pending', severity: 65 },
  ])
  assert.equal(result[0].zone, 'South')
  assert.equal(result[0].open, 2)
  assert.equal(result[1].critical, 1)
  assert.equal(result[1].categories['Road damage'], 1)
})

test('report age supports timestamps and readable demo age labels', () => {
  const now = Date.parse('2026-11-24T12:00:00Z')
  assert.equal(reportAgeHours({ createdAt: '2026-11-22T12:00:00Z' }, now), 48)
  assert.equal(reportAgeHours({ age: '2 days ago' }, now), 48)
  assert.equal(reportAgeHours({ age: '30 minutes ago' }, now), 0.5)
})

test('escalations include critical or aging open reports but exclude resolved reports', () => {
  const now = Date.parse('2026-11-24T12:00:00Z')
  const result = getEscalatedReports([
    { id: 'old', status: 'Pending', severity: 40, createdAt: '2026-11-21T12:00:00Z' },
    { id: 'critical', status: 'Assigned', severity: 95, age: 'Just now' },
    { id: 'done', status: 'Resolved', severity: 99, age: '5 days ago' },
    { id: 'normal', status: 'Pending', severity: 50, age: '1 hour ago' },
  ], now)
  assert.deepEqual(result.map((item) => item.id).sort(), ['critical', 'old'])
})

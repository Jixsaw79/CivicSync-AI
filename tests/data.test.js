import test from 'node:test'
import assert from 'node:assert/strict'
import { allocationData, departmentFor, initialReports, severityFor, zones } from '../src/data.js'

test('zone identifiers are unique and population values are positive', () => {
  const ids = zones.map(zone => zone.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(zones.every(zone => zone.population > 0))
})

test('every seeded report references a known zone and has valid estimates', () => {
  const zoneIds = new Set(zones.map(zone => zone.id))
  assert.ok(initialReports.every(report => zoneIds.has(report.zoneId)))
  assert.ok(initialReports.every(report => report.severity >= 0 && report.severity <= 100))
  assert.ok(initialReports.every(report => report.cost > 0 && report.impact >= 0))
})

test('department routing covers all supported issue categories', () => {
  assert.equal(departmentFor('Road damage'), 'Roads & Highways')
  assert.equal(departmentFor('Waterlogging'), 'Drainage & Water')
  assert.equal(departmentFor('Streetlight'), 'Electrical Services')
  assert.equal(departmentFor('Waste accumulation'), 'Waste Management')
  assert.equal(departmentFor('Unknown'), 'Municipal Response')
})

test('severity scoring stays bounded and responds to urgent context', () => {
  const baseline = severityFor('Road damage', '')
  const urgent = severityFor('Road damage', 'Major road blocked near a hospital')
  assert.ok(baseline >= 0 && baseline <= 100)
  assert.ok(urgent > baseline)
  assert.equal(severityFor('Waterlogging', 'hospital '.repeat(100)), 98)
})

test('traditional and optimized allocation percentages each total 100', () => {
  const traditional = allocationData.reduce((sum, item) => sum + item.traditional, 0)
  const optimized = allocationData.reduce((sum, item) => sum + item.optimized, 0)
  assert.equal(traditional, 100)
  assert.equal(optimized, 100)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { initialReports } from '../src/data.js'
import { isValidStoredReport, loadStoredReports, readThemePreference } from '../src/storage.js'

function mockStorage(value, shouldThrow = false) {
  return {
    getItem(key) {
      assert.ok(['civicsync-reports-v2', 'civicsync-theme'].includes(key))
      if (shouldThrow) throw new Error('Storage blocked')
      return value
    },
  }
}

test('stored report validation accepts valid demo reports and rejects malformed data', () => {
  assert.equal(isValidStoredReport(initialReports[0]), true)
  assert.equal(isValidStoredReport({ ...initialReports[0], severity: 'critical' }), false)
  assert.equal(isValidStoredReport({ ...initialReports[0], zoneId: 'unknown-zone' }), false)
  assert.equal(isValidStoredReport({ ...initialReports[0], status: 'untrusted-status' }), false)
})

test('stored report loader merges valid reports and ignores invalid records', () => {
  const extra = { ...initialReports[0], id: 'CS-9001', title: 'New local demo report' }
  const malformed = { id: 'broken', status: 'Pending', zoneId: 'commercial', severity: 30, cost: 10 }
  const loaded = loadStoredReports(mockStorage(JSON.stringify([extra, malformed])), initialReports)
  assert.ok(loaded.some((report) => report.id === 'CS-9001'))
  assert.ok(!loaded.some((report) => report.id === 'broken'))
  assert.equal(loaded.filter((report) => report.id === 'CS-2048').length, 1)
})

test('stored report loader safely falls back for corrupt or unavailable storage', () => {
  assert.equal(loadStoredReports(mockStorage('{invalid'), initialReports), initialReports)
  assert.equal(loadStoredReports(mockStorage(null, true), initialReports), initialReports)
})

test('theme preference respects explicit saved choice and safely falls back', () => {
  assert.equal(readThemePreference(mockStorage('dark'), false), true)
  assert.equal(readThemePreference(mockStorage('light'), true), false)
  assert.equal(readThemePreference(mockStorage('unknown'), true), true)
  assert.equal(readThemePreference(mockStorage(null, true), false), false)
})

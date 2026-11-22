import test from 'node:test'
import assert from 'node:assert/strict'
import insightsHandler, { buildInsights, isValidReport } from '../api/demo/insights.js'

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; return this },
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
  }
}

const sampleReports = [
  { id: 'CS-1', title: 'Major road failure', category: 'Road damage', zone: 'Commercial Hub', severity: 95, impact: 8000, status: 'Pending', age: '2 days ago' },
  { id: 'CS-2', title: 'Street flooding', category: 'Waterlogging', zone: 'Riverfront District', severity: 88, impact: 5000, status: 'In progress', age: '3 hrs ago' },
  { id: 'CS-3', title: 'Waste collection', category: 'Waste accumulation', zone: 'Commercial Hub', severity: 40, impact: 500, status: 'Resolved', age: 'Yesterday' },
]

test('insights summarize open reports and exclude resolved reports from priorities', () => {
  const result = buildInsights(sampleReports, Date.parse('2026-11-22T12:00:00Z'))
  assert.deepEqual(result.totals, { reports: 3, open: 2, resolved: 1 })
  assert.equal(result.priorities.length, 2)
  assert.ok(result.priorities.every((item) => item.id !== 'CS-3'))
  assert.equal(result.patterns.zones[0].name, 'Commercial Hub')
  assert.equal(result.demoMode, true)
  assert.equal(result.requiresHumanReview, true)
})

test('priority ranking is deterministic and exposes reasons', () => {
  const result = buildInsights(sampleReports, Date.parse('2026-11-22T12:00:00Z'))
  assert.equal(result.priorities[0].id, 'CS-1')
  assert.ok(result.priorities[0].reasons.length > 0)
  assert.match(result.method, /60% severity/)
})

test('empty-open snapshot is handled without division errors', () => {
  const result = buildInsights([sampleReports[2]])
  assert.equal(result.totals.open, 0)
  assert.equal(result.priorities.length, 0)
  assert.match(result.summary, /no open reports/i)
})

test('endpoint rejects unsupported methods and malformed payloads', () => {
  const methodResponse = mockResponse()
  insightsHandler({ method: 'GET' }, methodResponse)
  assert.equal(methodResponse.statusCode, 405)
  assert.equal(methodResponse.headers.Allow, 'POST')

  const payloadResponse = mockResponse()
  insightsHandler({ method: 'POST', body: { reports: [] } }, payloadResponse)
  assert.equal(payloadResponse.statusCode, 400)
})

test('endpoint validates report fields and returns computed insights', () => {
  const invalid = mockResponse()
  insightsHandler({ method: 'POST', body: { reports: [{ ...sampleReports[0], severity: 101 }] } }, invalid)
  assert.equal(invalid.statusCode, 400)

  const valid = mockResponse()
  insightsHandler({ method: 'POST', body: { reports: sampleReports } }, valid)
  assert.equal(valid.statusCode, 200)
  assert.equal(valid.body.insights.totals.open, 2)
  assert.equal(valid.body.insights.priorities[0].id, 'CS-1')
})

test('insights rejects cross-origin requests and oversized payloads', () => {
  const crossOrigin = mockResponse()
  insightsHandler({
    method: 'POST',
    headers: { origin: 'https://attacker.example', host: 'civicsync.example' },
    body: { reports: sampleReports },
  }, crossOrigin)
  assert.equal(crossOrigin.statusCode, 403)

  const oversized = mockResponse()
  insightsHandler({
    method: 'POST',
    headers: { 'content-length': String(300 * 1024) },
    body: { reports: sampleReports },
  }, oversized)
  assert.equal(oversized.statusCode, 413)
})

test('report validator rejects unexpected fields, empty identifiers and oversized impact', () => {
  assert.equal(isValidReport(sampleReports[0]), true)
  assert.equal(isValidReport({ ...sampleReports[0], injected: 'unexpected' }), false)
  assert.equal(isValidReport({ ...sampleReports[0], id: ' ' }), false)
  assert.equal(isValidReport({ ...sampleReports[0], impact: 1_000_000_001 }), false)
})

test('endpoint rejects duplicate report identifiers', () => {
  const res = mockResponse()
  insightsHandler({ method: 'POST', body: { reports: [sampleReports[0], sampleReports[0]] } }, res)
  assert.equal(res.statusCode, 400)
})

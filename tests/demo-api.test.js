import test from 'node:test'
import assert from 'node:assert/strict'
import municipalHandler from '../api/demo/municipal.js'
import triageHandler from '../api/demo/triage.js'

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

test('mock municipal adapter is explicitly disconnected from government', () => {
  const res = mockResponse()
  municipalHandler({ method: 'GET' }, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.connectedToGovernment, false)
  assert.equal(res.body.mode, 'DEMONSTRATION')
  assert.ok(res.body.departments.length >= 4)
})

test('mock municipal adapter rejects unsupported methods', () => {
  const res = mockResponse()
  municipalHandler({ method: 'POST' }, res)
  assert.equal(res.statusCode, 405)
})

test('Gemini triage validates input before checking provider credentials', async () => {
  const res = mockResponse()
  await triageHandler({ method: 'POST', headers: { 'x-forwarded-for': 'test-invalid-input' }, body: { description: 'short', category: 'Road damage' } }, res)
  assert.equal(res.statusCode, 400)
  assert.match(res.body.error, /8–3000/)
})

test('Gemini triage fails explicitly when no server key is configured', async (t) => {
  const previous = process.env.GEMINI_API_KEY
  delete process.env.GEMINI_API_KEY
  t.after(() => {
    if (previous === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previous
  })
  const res = mockResponse()
  await triageHandler({
    method: 'POST',
    headers: { 'x-forwarded-for': 'test-missing-key' },
    body: { description: 'A large pothole is creating a hazard near the bus stop.', category: 'Road damage' },
  }, res)
  assert.equal(res.statusCode, 503)
  assert.match(res.body.error, /GEMINI_API_KEY/)
})

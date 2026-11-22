import test from 'node:test'
import assert from 'node:assert/strict'
import municipalHandler from '../api/demo/municipal.js'
import triageHandler, { isValidTriage } from '../api/demo/triage.js'

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

test('Gemini triage rejects cross-origin browser requests', async () => {
  const res = mockResponse()
  await triageHandler({
    method: 'POST',
    headers: { origin: 'https://attacker.example', host: 'civicsync.example', 'sec-fetch-site': 'cross-site' },
    body: { description: 'A large pothole is creating a hazard near a bus stop.', category: 'Road damage' },
  }, res)
  assert.equal(res.statusCode, 403)
})

test('Gemini triage rejects non-JSON and oversized requests', async () => {
  const nonJson = mockResponse()
  await triageHandler({
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: { description: 'A large pothole is creating a hazard near a bus stop.', category: 'Road damage' },
  }, nonJson)
  assert.equal(nonJson.statusCode, 415)

  const oversized = mockResponse()
  await triageHandler({
    method: 'POST',
    headers: { 'content-length': '20000' },
    body: { description: 'A large pothole is creating a hazard near a bus stop.', category: 'Road damage' },
  }, oversized)
  assert.equal(oversized.statusCode, 413)
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
  assert.equal(res.headers['X-Content-Type-Options'], 'nosniff')
})

test('Gemini triage output validator rejects malformed provider output', () => {
  const valid = {
    summary: 'A damaged road surface needs inspection.',
    category: 'Road damage',
    severity: 75,
    department: 'Engineering',
    safety_flags: ['Potential trip hazard'],
    confidence: 0.9,
  }
  assert.equal(isValidTriage(valid), true)
  assert.equal(isValidTriage({ ...valid, confidence: 1.2 }), false)
  assert.equal(isValidTriage({ ...valid, safety_flags: ['x'.repeat(101)] }), false)
  assert.equal(isValidTriage({ ...valid, summary: 'x'.repeat(141) }), false)
})

test('Gemini triage keeps the Gemini API key out of the request URL', async (t) => {
  const previousKey = process.env.GEMINI_API_KEY
  const previousModel = process.env.GEMINI_MODEL
  const previousFetch = globalThis.fetch
  process.env.GEMINI_API_KEY = 'test-secret-key'
  process.env.GEMINI_MODEL = 'gemini-2.5-flash'

  globalThis.fetch = async (url, options) => {
    assert.equal(String(url).includes('test-secret-key'), false)
    assert.equal(options.headers['x-goog-api-key'], 'test-secret-key')
    const requestBody = JSON.parse(options.body)
    assert.equal(requestBody.generationConfig.maxOutputTokens, 512)
    assert.match(requestBody.contents[0].parts[0].text, /untrusted citizen data/i)
    return {
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                summary: '  A damaged road surface needs inspection.  ',
                category: 'Road damage',
                severity: 74,
                department: 'Engineering',
                safety_flags: ['Potential trip hazard'],
                confidence: 0.91,
              }),
            }],
          },
        }],
      }),
    }
  }

  t.after(() => {
    globalThis.fetch = previousFetch
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
    if (previousModel === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = previousModel
  })

  const res = mockResponse()
  await triageHandler({
    method: 'POST',
    headers: { 'x-real-ip': 'test-gemini-mock' },
    body: { description: 'A damaged road surface needs inspection near the bus stop.', category: 'Road damage' },
  }, res)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.triage.summary, 'A damaged road surface needs inspection.')
  assert.equal(res.body.requires_human_review, true)
})

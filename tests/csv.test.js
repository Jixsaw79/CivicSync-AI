import test from 'node:test'
import assert from 'node:assert/strict'
import { buildReportsCsv, escapeCsvCell } from '../src/csv.js'

test('CSV cells quote delimiters and neutralize formula prefixes', () => {
  assert.equal(escapeCsvCell('plain text'), '"plain text"')
  assert.equal(escapeCsvCell('A "quoted" title'), '"A ""quoted"" title"')
  assert.equal(escapeCsvCell('=HYPERLINK("https://example.com")'), '"\'=HYPERLINK(""https://example.com"")"')
  assert.equal(escapeCsvCell('\n=1+1'), '"\'\n=1+1"')
  assert.equal(escapeCsvCell('\t@SUM(A1:A2)'), '"\'\t@SUM(A1:A2)"')
})

test('CSV export includes a header and safely escaped report values', () => {
  const csv = buildReportsCsv([{ id: 'CS-1', title: '=1+1', category: 'Road damage' }])
  assert.match(csv, /^"id","title","category"/)
  assert.match(csv, /"\'=1\+1"/)
  assert.ok(csv.includes('\r\n'))
})

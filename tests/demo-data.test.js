import test from 'node:test'
import assert from 'node:assert/strict'
import { departmentFor, zones } from '../src/data.js'

test('demo map zones have Dhaka coordinates for map markers', () => {
  assert.ok(zones.length >= 6)
  for (const zone of zones) {
    assert.ok(Number.isFinite(zone.latitude), zone.id + ' latitude')
    assert.ok(Number.isFinite(zone.longitude), zone.id + ' longitude')
    assert.ok(zone.latitude >= 23.6 && zone.latitude <= 24.0)
    assert.ok(zone.longitude >= 90.2 && zone.longitude <= 90.6)
  }
})

test('issue categories route to the expected demonstration departments', () => {
  assert.equal(departmentFor('Road damage'), 'Roads & Highways')
  assert.equal(departmentFor('Waterlogging'), 'Drainage & Water')
  assert.equal(departmentFor('Streetlight'), 'Electrical Services')
  assert.equal(departmentFor('Waste accumulation'), 'Waste Management')
  assert.equal(departmentFor('Unknown'), 'Municipal Response')
})

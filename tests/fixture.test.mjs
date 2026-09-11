import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFixture, validateFixture, presets } from '../lib/fixture.ts';

test('presets round-trip to the exact Tez schema', () => {
  for (const fixture of Object.values(presets)) {
    const result = buildFixture(fixture);
    const config = JSON.parse(result.config);
    assert.deepEqual(config, {
      [fixture.path]: {
        status: fixture.status,
        content_type: fixture.contentType,
        body: fixture.body,
      },
    });
    assert.equal(result.bytes, Buffer.byteLength(fixture.body));
  }
});
test('UTF-8 byte length differs from UTF-16 length', () => {
  const result = buildFixture({ ...presets.hello, body: 'é → 🚀' });
  assert.equal(result.bytes, Buffer.byteLength('é → 🚀'));
  assert.doesNotThrow(() => JSON.parse(result.config));
});
test('lone Unicode surrogates cannot produce a config rejected by Tez', () => {
  for (const body of ['\ud800', '\udc00', 'a\ud800b', '\udc00\ud800'])
    assert.throws(() => buildFixture({ ...presets.hello, body }), /surrogate/);
  assert.doesNotThrow(() =>
    buildFixture({ ...presets.hello, body: '\ud83d\ude80' }),
  );
});
test('only the actual built-in namespace is reserved', () => {
  for (const path of ['/health', '/echo', '/api/data', '/static/file'])
    assert.throws(() => buildFixture({ ...presets.hello, path }), /built-in/);
  for (const path of ['/', '/static', '/healthcheck'])
    assert.doesNotThrow(() => buildFixture({ ...presets.hello, path }));
});
test('unsafe or ambiguous path characters never enter shell output', () => {
  for (const path of [
    '/a;id',
    "/a'b",
    '/a\nnext',
    '/a?b',
    '/a#b',
    '/a$(id)',
    '/../secret',
    '/a b',
    '/`id`',
  ])
    assert.throws(() => buildFixture({ ...presets.hello, path }));
  assert.equal(
    buildFixture(presets.hello).curl,
    "curl --include 'http://127.0.0.1:8080/hello'",
  );
});
test('JSON and bodyless responses follow the selected contract', () => {
  assert.throws(
    () => buildFixture({ ...presets.profile, body: '{"broken":' }),
    /valid JSON/,
  );
  assert.throws(
    () => buildFixture({ ...presets.hello, status: '204 No Content' }),
    /empty body/,
  );
  assert.equal(
    buildFixture({ ...presets.profile, status: '204 No Content', body: '' })
      .bytes,
    0,
  );
});
test('tool input validation fails without mutating caller state', () => {
  const original = { ...presets.hello };
  const snapshot = JSON.stringify(original);
  assert.throws(() => validateFixture({ ...original, status: '999 Fake' }));
  assert.throws(() => validateFixture({ ...original, unexpected: true }));
  assert.throws(() => validateFixture({ ...original, body: 5 }));
  assert.throws(() =>
    validateFixture({ ...original, body: 'a'.repeat(65537) }),
  );
  assert.equal(JSON.stringify(original), snapshot);
});

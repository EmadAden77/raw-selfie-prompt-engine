import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import app from '../src/app.js';

test('Vercel Express entrypoint is a callable default export', () => {
  assert.equal(typeof app, 'function');
});

test('public GitHub Pages origin can preflight NVIDIA API without exposing a key', async () => {
  const server = app.listen(0, '127.0.0.1');
  try {
    const address = server.address() as AddressInfo;
    const response = await fetch('http://127.0.0.1:' + address.port + '/api/prompt', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://emadaden77.github.io',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      },
    });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://emadaden77.github.io');
    assert.match(response.headers.get('access-control-allow-methods') ?? '', /POST/);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});

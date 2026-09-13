import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../server.js');

describe('API Health Endpoint Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = app.listen(0);
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.once('listening', resolve);
    });
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  });

  test('GET /api/health returns 200 OK with correct status structure', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.service, 'Reviso Backend');
    assert.equal(typeof data.geminiConfigured, 'boolean');
    assert.deepEqual(data.supportedFormats, ['PDF', 'DOCX', 'PPTX']);
  });

  test('GET /api/health reports all supported lecture formats [PDF, DOCX, PPTX]', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.deepEqual(data.supportedFormats, ['PDF', 'DOCX', 'PPTX']);
  });

  test('GET /health (without /api prefix) functions identically', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.service, 'Reviso Backend');
    assert.deepEqual(data.supportedFormats, ['PDF', 'DOCX', 'PPTX']);
  });
});

import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import AdmZip from 'adm-zip';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../server.js');

describe('Upload Validation & Security Boundary Tests', () => {
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

  test('POST /api/generate-revision-pack rejects request with missing file', async () => {
    const res = await fetch(`${baseUrl}/api/generate-revision-pack`, {
      method: 'POST'
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /No file was received/i);
  });

  test('POST /api/generate-revision-pack rejects unsupported file extension (.txt)', async () => {
    const boundary = '--------------------------' + Date.now();
    const body = [
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="file"; filename="lecture.txt"\r\n',
      'Content-Type: text/plain\r\n\r\n',
      'Sample raw text content that is not an allowed format\r\n',
      `--${boundary}--\r\n`
    ].join('');

    const res = await fetch(`${baseUrl}/api/generate-revision-pack`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /Unsupported file format/i);
  });

  test('POST /api/generate-revision-pack rejects unsupported executable (.exe)', async () => {
    const boundary = '--------------------------' + Date.now();
    const body = [
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="file"; filename="malicious.exe"\r\n',
      'Content-Type: application/x-msdownload\r\n\r\n',
      'MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00\r\n',
      `--${boundary}--\r\n`
    ].join('');

    const res = await fetch(`${baseUrl}/api/generate-revision-pack`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /Unsupported file format/i);
  });

  test('POST /api/generate-revision-pack handles missing Gemini API key safely', async () => {
    const originalGeminiKey = process.env.GEMINI_API_KEY;
    const originalGoogleKey = process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    try {
      const zip = new AdmZip();
      zip.addFile('[Content_Types].xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`, 'utf8'));
      zip.addFile('_rels/.rels', Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`, 'utf8'));
      zip.addFile('word/document.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Lecture notes about IPv4 addressing, routing, and subnet masks.</w:t></w:r></w:p>
  </w:body>
</w:document>`, 'utf8'));

      const boundary = '--------------------------' + Date.now();
      const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.docx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n`),
        zip.toBuffer(),
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ]);

      const res = await fetch(`${baseUrl}/api/generate-revision-pack`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body
      });

      assert.equal(res.status, 500);
      const data = await res.json();
      assert.match(data.error, /API key is not configured/i);
    } finally {
      if (originalGeminiKey) process.env.GEMINI_API_KEY = originalGeminiKey;
      if (originalGoogleKey) process.env.GOOGLE_API_KEY = originalGoogleKey;
    }
  });
});

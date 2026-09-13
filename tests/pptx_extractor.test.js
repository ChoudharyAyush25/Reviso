import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import AdmZip from 'adm-zip';
import { extractTextFromPptxBuffer } from '../server.js';

describe('PPTX Slide XML Text Extraction Unit Tests', () => {

  test('extractTextFromPptxBuffer parses slides and text runs from synthetic slide XML', () => {
    const zip = new AdmZip();

    const slide1Xml = `<?xml version="1.0" encoding="UTF-8"?>
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:sp>
              <p:txBody>
                <a:p><a:r><a:t>IPv4 Header</a:t></a:r><a:r><a:t> Overview</a:t></a:r></a:p>
                <a:p><a:r><a:t>32-bit logical address structure</a:t></a:r></a:p>
              </p:txBody>
            </p:sp>
          </p:spTree>
        </p:cSld>
      </p:sld>`;

    const slide2Xml = `<?xml version="1.0" encoding="UTF-8"?>
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:sp>
              <p:txBody>
                <a:p><a:r><a:t>IPv6 Header &amp; Next Header</a:t></a:r></a:p>
                <a:p><a:r><a:t>128-bit address space &lt;fixed 40-byte header&gt;</a:t></a:r></a:p>
              </p:txBody>
            </p:sp>
          </p:spTree>
        </p:cSld>
      </p:sld>`;

    zip.addFile('ppt/slides/slide1.xml', Buffer.from(slide1Xml, 'utf8'));
    zip.addFile('ppt/slides/slide2.xml', Buffer.from(slide2Xml, 'utf8'));

    const result = extractTextFromPptxBuffer(zip.toBuffer());

    assert.equal(result.totalSlides, 2);
    assert.match(result.text, /IPv4 Header Overview/);
    assert.match(result.text, /32-bit logical address structure/);
    assert.match(result.text, /IPv6 Header & Next Header/);
    assert.match(result.text, /128-bit address space <fixed 40-byte header>/);
  });

  test('extractTextFromPptxBuffer sorts slide XML files numerically (slide1, slide2, slide10)', () => {
    const zip = new AdmZip();

    zip.addFile('ppt/slides/slide10.xml', Buffer.from('<a:p><a:t>Slide 10 Content</a:t></a:p>', 'utf8'));
    zip.addFile('ppt/slides/slide2.xml', Buffer.from('<a:p><a:t>Slide 2 Content</a:t></a:p>', 'utf8'));
    zip.addFile('ppt/slides/slide1.xml', Buffer.from('<a:p><a:t>Slide 1 Content</a:t></a:p>', 'utf8'));

    const result = extractTextFromPptxBuffer(zip.toBuffer());

    assert.equal(result.totalSlides, 3);
    const s1Index = result.text.indexOf('Slide 1 Content');
    const s2Index = result.text.indexOf('Slide 2 Content');
    const s10Index = result.text.indexOf('Slide 10 Content');

    assert.ok(s1Index < s2Index, 'Slide 1 should appear before Slide 2');
    assert.ok(s2Index < s10Index, 'Slide 2 should appear before Slide 10');
  });

  test('extractTextFromPptxBuffer correctly unescapes XML entities', () => {
    const zip = new AdmZip();
    const slideXml = `<?xml version="1.0"?>
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:p><a:t>Tom &amp; Jerry &lt;Cat &gt; &quot;Mouse&quot; &#39;Cheezy&#39;</a:t></a:p>
      </p:sld>`;
    zip.addFile('ppt/slides/slide1.xml', Buffer.from(slideXml, 'utf8'));

    const result = extractTextFromPptxBuffer(zip.toBuffer());
    assert.match(result.text, /Tom & Jerry <Cat > "Mouse" 'Cheezy'/);
  });

  test('extractTextFromPptxBuffer returns empty string for presentation with no slide text', () => {
    const zip = new AdmZip();
    zip.addFile('ppt/slides/slide1.xml', Buffer.from('<p:sld></p:sld>', 'utf8'));

    const result = extractTextFromPptxBuffer(zip.toBuffer());
    assert.equal(result.totalSlides, 1);
    assert.equal(result.text, '');
  });

  test('extractTextFromPptxBuffer handles synthetic multi-slide deck with meaningful content', () => {
    const zip = new AdmZip();
    const slides = [
      { number: 1, text: 'IPv4 Header Overview and address classes' },
      { number: 2, text: 'IPv6 Header includes next header field' },
      { number: 3, text: 'Subnet masks simplify route planning' }
    ];

    slides.forEach(({ number, text }) => {
      const xml = `<?xml version="1.0"?>
        <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <p:spTree>
            <p:sp><p:txBody><a:p><a:r><a:t>${text}</a:t></a:r></a:p></p:txBody></p:sp>
          </p:spTree>
        </p:sld>`;
      zip.addFile(`ppt/slides/slide${number}.xml`, Buffer.from(xml, 'utf8'));
    });

    const result = extractTextFromPptxBuffer(zip.toBuffer());

    assert.equal(result.totalSlides, 3);
    assert.match(result.text, /IPv4 Header Overview and address classes/);
    assert.match(result.text, /IPv6 Header includes next header field/);
    assert.match(result.text, /Subnet masks simplify route planning/);
    assert.ok(result.text.length > 60, 'Expected meaningful extracted slide text bytes');
  });
});

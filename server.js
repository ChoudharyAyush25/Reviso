import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';
import AdmZip from 'adm-zip';

// Resolve directory path for robust ES module .env resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust multi-path .env resolution
const projectRoot = path.resolve(__dirname);
dotenv.config({ path: path.resolve(projectRoot, '.env') });
dotenv.config({ path: path.resolve(projectRoot, '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const { parseOffice } = require('officeparser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Memory Storage for Multer (Max 50MB per file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Robust Direct PPTX Slide XML Text Extractor
function extractTextFromPptxBuffer(buffer) {
  try {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries().filter(e => {
      const name = e.entryName.toLowerCase();
      return name.startsWith('ppt/slides/slide') && name.endsWith('.xml') && !name.includes('_rels');
    });

    entries.sort((a, b) => {
      const mA = a.entryName.match(/slide(\d+)\.xml/i);
      const mB = b.entryName.match(/slide(\d+)\.xml/i);
      return (mA ? parseInt(mA[1], 10) : 0) - (mB ? parseInt(mB[1], 10) : 0);
    });

    if (entries.length === 0) {
      return { text: "", totalSlides: 0 };
    }

    const slideTexts = [];
    entries.forEach((entry, idx) => {
      const xml = entry.getData().toString('utf8');
      const paragraphMatches = xml.match(/<a:p[^>]*>(.*?)<\/a:p>/gs) || [];
      
      const paragraphs = paragraphMatches.map(pXml => {
        const textMatches = pXml.match(/<a:t[^>]*>(.*?)<\/a:t>/gs) || [];
        return textMatches.map(t => {
          return t.replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
        }).join('');
      }).filter(p => p.trim().length > 0);

      if (paragraphs.length > 0) {
        slideTexts.push(`--- Slide ${idx + 1} ---\n` + paragraphs.join('\n'));
      }
    });

    return {
      text: slideTexts.join('\n\n'),
      totalSlides: entries.length
    };
  } catch (err) {
    console.error("PPTX direct extraction error:", err.message);
    throw err;
  }
}

// Health check route - safely checks API key existence without leaking secret
app.get(['/api/health', '/health'], (req, res) => {
  const rawGeminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  const rawGoogleKey = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : '';
  const hasApiKey = rawGeminiKey.length > 0 || rawGoogleKey.length > 0;

  res.json({ 
    status: 'ok', 
    service: 'Reviso Backend',
    geminiConfigured: hasApiKey,
    supportedFormats: ['PDF', 'DOCX', 'PPTX']
  });
});

// Core AI Revision Pack Generation Endpoint (Supports PDF, DOCX, PPTX)
app.post(['/api/generate-revision-pack', '/generate-revision-pack'], upload.single('file'), async (req, res) => {
  try {
    // 1. File Validation
    if (!req.file) {
      return res.status(400).json({ 
        error: "No file was received. Please upload a PDF, DOCX, or PPTX lecture file." 
      });
    }

    const filename = req.file.originalname.toLowerCase();
    const mimetype = req.file.mimetype.toLowerCase();

    const isPdf = mimetype.includes('pdf') || filename.endsWith('.pdf');
    const isDocx = mimetype.includes('wordprocessingml') || mimetype.includes('msword') || filename.endsWith('.docx');
    const isPptx = mimetype.includes('presentationml') || mimetype.includes('powerpoint') || filename.endsWith('.pptx');

    if (!isPdf && !isDocx && !isPptx) {
      return res.status(400).json({ 
        error: "Unsupported file format. Reviso supports PDF, DOCX, and PPTX documents." 
      });
    }

    // 2. Server-Side Text Extraction by Format
    let extractedText = "";
    let totalPages = 1;
    let fileTypeLabel = "PDF";

    if (isPdf) {
      fileTypeLabel = "PDF";
      try {
        const parser = new PDFParse({ data: req.file.buffer });
        const parsedData = await parser.getText();
        extractedText = parsedData.text ? parsedData.text.trim() : "";
        totalPages = parsedData.total || (parsedData.pages ? parsedData.pages.length : 1);
      } catch (pdfErr) {
        console.error("PDF Parsing Error:", pdfErr.message);
        return res.status(400).json({ 
          error: "Unable to parse text from the uploaded PDF. Ensure the file is not password-protected or corrupted." 
        });
      }
    } else if (isDocx) {
      fileTypeLabel = "DOCX";
      try {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value ? result.value.trim() : "";
        const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
        totalPages = Math.max(1, Math.ceil(wordCount / 500));
      } catch (docxErr) {
        try {
          const parsedText = await parseOffice(req.file.buffer);
          extractedText = typeof parsedText === 'string' ? parsedText.trim() : "";
          const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
          totalPages = Math.max(1, Math.ceil(wordCount / 500));
        } catch (fallbackErr) {
          console.error("DOCX Parsing Error:", fallbackErr.message);
          return res.status(400).json({ 
            error: "Unable to parse text from the uploaded DOCX document. Ensure the file is not corrupted." 
          });
        }
      }
    } else if (isPptx) {
      fileTypeLabel = "PPTX";
      try {
        const pptxResult = extractTextFromPptxBuffer(req.file.buffer);
        extractedText = pptxResult.text ? pptxResult.text.trim() : "";
        totalPages = pptxResult.totalSlides || 1;
      } catch (pptxErr) {
        // Fallback to officeparser if zip extraction fails
        try {
          const parsedText = await parseOffice(req.file.buffer);
          extractedText = typeof parsedText === 'string' ? parsedText.trim() : "";
          const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
          totalPages = Math.max(1, Math.ceil(wordCount / 150));
        } catch (fallbackErr) {
          console.error("PPTX Parsing Error:", fallbackErr.message);
          return res.status(400).json({ 
            error: "Unable to parse text from the uploaded PPTX presentation. Ensure the file is not corrupted." 
          });
        }
      }
    }

    // Normalize text whitespace
    extractedText = extractedText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    if (!extractedText || extractedText.length < 30) {
      return res.status(400).json({ 
        error: `The uploaded ${fileTypeLabel} document contains little to no extractable text. Please ensure your document contains readable lecture text.` 
      });
    }

    // 3. Gemini API Key Verification
    const apiKey = (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
                   (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim());

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY=your_key to your .env file in the project root." 
      });
    }

    // 4. Gemini Prompt & Structured Generation
    const ai = new GoogleGenAI({ apiKey });
    const courseContext = req.body.courseName || req.body.course || 'General Lecture Revision';
    const fileName = req.file.originalname;

    const systemPrompt = `You are Reviso, an expert academic AI tutor.
Analyze the provided lecture text below and generate a structured, scannable revision pack.

CRITICAL CONSTRAINTS & GROUNDING RULES:
1. STRICT GROUNDING: Use ONLY information, concepts, formulas, and facts present in the uploaded lecture text. Do NOT introduce outside knowledge or unmentioned facts.
2. REVISION NOTES: Group into 2 to 4 logical topic sections. Each section must include:
   - "id": string (e.g. "sec-1")
   - "sectionTitle": Heading string
   - "summary": 1-2 sentence core overview
   - "bullets": Array of 3-5 concise bullet points
   - "keyTakeaway": Single high-yield key takeaway statement starting with an emoji (e.g. "⚡ Key Takeaway: ...")
   - "concepts": Array of { "term": "string", "definition": "string" }
3. PRACTICE QUIZ: Generate EXACTLY 5 multiple-choice questions derived strictly from the lecture text.
   - Each question MUST have EXACTLY 4 options: IDs "A", "B", "C", "D".
   - Include "correctId": "A", "B", "C", or "D".
   - Include "explanation": Detailed explanation of why the correct option is right, referencing the lecture content.
   - Include "conceptTag": Concept or slide topic label.
   - Include "bloomLevel": "Comprehension", "Analysis", "Application", or "Knowledge".

LECTURE FILE NAME: ${fileName} (${fileTypeLabel} format)
PROVIDED COURSE TITLE: ${courseContext}
LECTURE TEXT (PARSED ${totalPages} ${fileTypeLabel === 'PPTX' ? 'SLIDES' : 'PAGES'}):
---
${extractedText.substring(0, 45000)}
---

Return ONLY valid JSON matching this schema:
{
  "title": "Descriptive lecture title derived from text",
  "course": "${courseContext}",
  "overview": "2-3 sentence executive summary",
  "readTime": "e.g. 6 min read",
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "notes": [
    {
      "id": "sec-1",
      "sectionTitle": "1. Section Title",
      "summary": "Summary statement",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
      "keyTakeaway": "⚡ Key Takeaway: ...",
      "concepts": [
        { "term": "Term", "definition": "Definition" }
      ]
    }
  ],
  "quiz": [
    {
      "id": 1,
      "conceptTag": "Concept Tag",
      "bloomLevel": "Analysis",
      "question": "Question text?",
      "options": [
        { "id": "A", "text": "Option A" },
        { "id": "B", "text": "Option B" },
        { "id": "C", "text": "Option C" },
        { "id": "D", "text": "Option D" }
      ],
      "correctId": "A",
      "explanation": "Explanation text"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    let packData;
    try {
      packData = JSON.parse(responseText);
    } catch (jsonErr) {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      packData = JSON.parse(cleaned);
    }

    // Validation & Schema Normalization
    if (!packData || typeof packData !== 'object') {
      throw new Error("Invalid response format received from AI model.");
    }

    if (!Array.isArray(packData.notes) || packData.notes.length === 0) {
      throw new Error("AI failed to generate revision notes sections.");
    }

    if (!Array.isArray(packData.quiz) || packData.quiz.length === 0) {
      throw new Error("AI failed to generate practice quiz questions.");
    }

    // Ensure quiz has exactly 5 questions
    if (packData.quiz.length > 5) {
      packData.quiz = packData.quiz.slice(0, 5);
    }

    // Attach metadata safely
    packData.fileName = fileName;
    packData.fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    packData.pagesParsed = totalPages;
    packData.fileType = fileTypeLabel;
    if (!packData.course) packData.course = courseContext;
    if (!packData.title) packData.title = fileName.replace(/\.[^/.]+$/, "");

    return res.json(packData);

  } catch (error) {
    console.error("Server API Error:", error.message);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred while generating the revision pack." 
    });
  }
});

// Error handling middleware for multer file size limit
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: "File size exceeds maximum allowed limit of 50MB." 
    });
  }
  if (err) {
    return res.status(500).json({ error: err.message || "Server Error" });
  }
  next();
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Reviso API Server running on http://localhost:${PORT}`);
  });
}

export default app;

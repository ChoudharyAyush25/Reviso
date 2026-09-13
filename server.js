import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';

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

// Health check route - safely checks API key existence without leaking secret
app.get('/api/health', (req, res) => {
  const rawGeminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  const rawGoogleKey = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : '';
  const hasApiKey = rawGeminiKey.length > 0 || rawGoogleKey.length > 0;

  res.json({ 
    status: 'ok', 
    service: 'Reviso Backend',
    geminiConfigured: hasApiKey
  });
});

// Core AI Revision Pack Generation Endpoint
app.post('/api/generate-revision-pack', upload.single('file'), async (req, res) => {
  try {
    // 1. File Validation
    if (!req.file) {
      return res.status(400).json({ 
        error: "No PDF file was received. Please select a valid lecture PDF file." 
      });
    }

    const isPdf = req.file.mimetype.includes('pdf') || req.file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return res.status(400).json({ 
        error: "Invalid file format. Reviso only accepts .pdf documents." 
      });
    }

    // 2. Server-Side PDF Text Extraction
    let extractedText = "";
    let totalPages = 1;
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

    if (!extractedText || extractedText.length < 30) {
      return res.status(400).json({ 
        error: "The uploaded PDF contains little to no extractable text. Please ensure your PDF is not a scanned image without OCR text." 
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

LECTURE FILE NAME: ${fileName}
PROVIDED COURSE TITLE: ${courseContext}
LECTURE TEXT (PARSED ${totalPages} PAGES):
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

    // Attach metadata
    packData.fileName = fileName;
    packData.fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    packData.pagesParsed = totalPages;
    if (!packData.course) packData.course = courseContext;
    if (!packData.title) packData.title = fileName.replace(/\.[^/.]+$/, "");

    return res.json(packData);

  } catch (error) {
    console.error("Server API Error:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred while generating the revision pack." 
    });
  }
});

// Error handling middleware for multer file size limit
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: "File size exceeds maximum limit of 50MB." 
    });
  }
  if (err) {
    return res.status(500).json({ error: err.message || "Server Error" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Reviso API Server running on http://localhost:${PORT}`);
});

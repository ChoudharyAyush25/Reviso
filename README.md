# Reviso — AI Lecture Revision Pack Generator

**Reviso** is a single-purpose, premium AI student productivity application designed to eliminate the manual busywork of converting dense lecture documents into concise, actionable study materials.

Instead of spending hours re-reading 80-slide decks or long word documents, students upload a **PDF, DOCX, or PPTX** lecture document to instantly receive a structured **Revision Pack** containing scannable topic notes and a **5-question practice quiz** derived strictly from their lecture material.

---

## 🎯 Target Persona & Problem Statement

### Persona
Higher education students (Undergraduate, Medical, STEM, Humanities) who attend lectures with heavy slide decks, reading assignments, and word documents.

### Problem
Students spend significant time turning lecture materials into study guides. Traditional productivity tools add cognitive overhead (complex dashboards, flashcard decks, generic AI chatbots, task managers). Reviso solves this single problem with extreme focus.

---

## 🔄 Core Workflow

```
[1. Upload PDF / DOCX / PPTX] ➔ [2. Server Text Extraction] ➔ [3. Gemini 3.6 Flash] ➔ [4. Revision Notes & 5-Q Quiz] ➔ [5. Export / Study]
```

1. **Upload**: Student drags & drops a lecture document (**PDF, DOCX, or PPTX** up to 50MB) and optionally enters a course title (e.g. *BIO 201: Cellular Neurobiology*).
2. **Analysis**: Server extracts raw text and parses page/slide structure:
   - **PDF**: Processed using `pdf-parse` v2 on server-side in-memory buffer.
   - **DOCX**: Extracted using `mammoth` (with `officeparser` fallback) to parse raw formatted document text.
   - **PPTX**: Extracted directly from the presentation ZIP structure using `adm-zip` to parse slide XML files (`ppt/slides/slide*.xml`) and `<a:t>` text elements (with `officeparser` fallback).
3. **AI Generation**: Gemini 3.6 Flash analyzes the normalized text under strict grounding constraints.
4. **Study Experience**: Student views structured topic notes, key concept definitions, "Key Takeaway" callout boxes, and switches seamlessly to a 5-question active recall practice quiz.
5. **Export**: Student exports the complete revision pack as Markdown (`.md`), copies plain text, or prints/saves as PDF.

---

## 🚀 Key Features

- 📁 **Multi-Format Support**: Upload PDF, DOCX (Word), or PPTX (PowerPoint) lecture files up to 50MB.
- 📝 **Concise Topic Revision Notes**: Hierarchical bullet points, executive summaries, and exam-relevant key takeaways.
- 🎯 **5-Question Practice Quiz**: Targeted multiple-choice questions with 4 accessible options, instant answer verification (✓ / ✗), and detailed slide explanations.
- 🔑 **Key Concept Definitions & Tables**: Terminology popovers and side-by-side formula comparison tables.
- ⚡ **Instant Export & Print**: One-click Markdown file download (`.md`), plain text copying with success toasts, and browser print-to-PDF formatting.
- 🎨 **Stitch "Cognitive Clarity" Visual System**: High-contrast slate ground (`#F8FAFC`), pure white elevated card containers, and deep indigo accent (`#4F46E5`).

---

## 🛡️ Security & Privacy Architecture

- **Server-Side API Key Protection**: The `GEMINI_API_KEY` is loaded strictly on the Express backend via `process.env`. It is **NEVER** exposed to the React client bundle or browser console.
- **Git Protection**: `.env`, `.env.*`, `node_modules/`, `dist/`, and temporary upload paths are explicitly ignored in `.gitignore`.
- **In-Memory File Buffer**: Uploaded lecture files (PDF/DOCX/PPTX) are processed in-memory using `multer.memoryStorage()`; no lecture files are persisted to disk.
- **No Unsanitized HTML Rendering**: AI outputs are parsed as safe structured JSON arrays and rendered cleanly via standard React components.

---

## ♿ Accessibility & Usability (A11y)

- **Keyboard Navigation**: Interactive dropzone, tabs, and quiz option cards support full keyboard interaction (`Tab`, `Space`, `Enter`, `Arrow` keys).
- **Non-Color State Indicators**: Quiz answer feedback incorporates visible checkmark (✓) and cross (✗) icons alongside green/red tints so correctness does not rely solely on color.
- **Screen Reader Support**: `aria-live="polite"` on processing sequence, `role="radiogroup"` on quiz options, and `role="tabpanel"` on mode tabs.
- **Responsive Layout**: Designed for 1440px desktop displays, scaling gracefully to 1024px tablet and 375px mobile viewports.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS (CDN/Custom System), Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Multer, `pdf-parse` v2, `mammoth`, `adm-zip`, `officeparser`.
- **AI Engine**: Google Gen AI SDK (`@google/genai`), Model: `gemini-3.6-flash`.

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ChoudharyAyush25/Reviso.git
cd Reviso
npm install
```

### 2. Configure Environment Variable
Create a `.env` file in the project root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

> ⚠️ **Important**: Do NOT commit your `.env` file to Git.

### 3. Run Application Locally

Start the Express backend server (Port 3001):
```bash
npm run server
```

In a second terminal, start the Vite development server (Port 5173):
```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 📦 Building for Production

To test and generate the production bundle:
```bash
npm run build
```

The output will be generated in the `dist/` folder.

---

## 📌 Assumptions & Limitations

1. **Extractable Text**: Reviso processes digital PDF, DOCX, and PPTX files containing extractable text layers. Image-only scanned documents without an extractable text layer will prompt an error asking for a text-based document.
2. **Grounding Scope**: AI generation is strictly bound to the uploaded document text (45,000 characters input limit per request) to prevent hallucinated concepts.
3. **Single-Purpose Focus**: Reviso intentionally omits calendars, generic chat, flashcards, and task managers to preserve single-flow revision focus.
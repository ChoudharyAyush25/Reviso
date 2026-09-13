import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { SAMPLE_LECTURES } from '../mockData/sampleLecturePacks';

export default function UploadLanding({ onUploadSubmit, onSelectSample }) {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Supported extensions
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx'];

  // File Selection Handler
  const handleFileChange = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setErrorMsg('Unsupported file format. Please upload a PDF, DOCX, or PPTX file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('File size exceeds 50MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onUploadSubmit({
      file,
      courseName: courseName.trim() || 'Uploaded Lecture',
      title: file.name.replace(/\.[^/.]+$/, "")
    });
  };

  // Get file type badge text
  const getFileTypeBadge = (filename) => {
    const ext = filename.split('.').pop().toUpperCase();
    return ext || 'DOC';
  };

  return (
    <div className="w-full py-10 md:py-16 container-wide">
      
      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Single-purpose AI revision tool supporting PDF, DOCX & PPTX</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.15] mb-5">
          Transform lecture PDFs, DOCX, or PPTX into clear revision notes & practice quizzes
        </h1>
        
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Stop spending hours re-reading 80-slide decks or long word documents. Upload your lecture slides or notes to instantly generate structured topic summaries and a 5-question practice quiz.
        </p>
      </div>

      {/* Main Upload Card Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 lg:p-12 mb-16">
        <form onSubmit={handleSubmit}>
          
          {/* Optional Course Title Input */}
          <div className="mb-6">
            <label 
              htmlFor="course-input" 
              className="block text-sm font-bold text-slate-800 mb-2 flex items-center justify-between"
            >
              <span>Subject or Course Title <span className="text-slate-400 font-normal">(Optional)</span></span>
              <span className="text-xs text-slate-500 font-normal">e.g. BIO 201: Cellular Neurobiology</span>
            </label>
            <input
              id="course-input"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. BIO 201 - Synaptic Plasticity & Neurotransmission"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 text-sm transition-all bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* Custom File Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload lecture PDF, DOCX or PPTX dropzone"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-indigo-600 bg-indigo-50/80 scale-[0.99] shadow-inner' 
                : file 
                  ? 'border-emerald-500 bg-emerald-50/40' 
                  : 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />

            {!file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100/90 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
                  <UploadCloud className="w-8 h-8" />
                </div>
                
                <h3 className="text-slate-900 font-extrabold text-xl mb-1.5 font-display">
                  Drag and drop your PDF, DOCX or PPTX here
                </h3>
                
                <p className="text-slate-500 text-sm mb-5">
                  or <span className="text-indigo-600 font-bold underline underline-offset-4 hover:text-indigo-700">browse files from your computer</span>
                </p>
                
                <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium bg-white/80 px-4 py-2 rounded-full border border-slate-200/80">
                  <span className="font-semibold text-indigo-700">PDF, DOCX or PPTX</span>
                  <span>•</span>
                  <span>Max 50MB per file</span>
                  <span>•</span>
                  <span>Hand-written OCR ready</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-sm font-bold text-sm">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold text-[10px]">
                    {getFileTypeBadge(file.name)}
                  </span>
                  <h3 className="text-slate-900 font-bold text-lg">
                    {file.name}
                  </h3>
                </div>
                <p className="text-emerald-700 text-xs font-semibold mb-4 bg-emerald-100/80 px-3 py-1 rounded-full">
                  ✓ Validated Document ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 underline"
                >
                  Remove & choose another file
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Privacy Note & Primary Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your uploaded course materials are encrypted and never shared.</span>
            </div>

            <button
              type="submit"
              disabled={!file}
              className="w-full sm:w-auto reviso-btn reviso-btn-primary reviso-btn-lg shadow-lg shadow-indigo-500/25 px-8 py-3.5 text-base"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Revision Pack</span>
            </button>
          </div>

        </form>

        {/* Demo Sample Trigger Divider */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Or test with a sample lecture deck:
          </span>
          
          <div className="flex flex-wrap justify-center sm:justify-end gap-2.5">
            {SAMPLE_LECTURES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="reviso-btn reviso-btn-ghost text-xs py-2 px-3.5 hover:border-indigo-300 hover:text-indigo-600 bg-slate-50"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{sample.course.split(':')[0]} Deck</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Showcase Grid: 3 Feature Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            What your revision pack includes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Engineered specifically for active recall and scannable studying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Revision Notes */}
          <div className="reviso-card p-6 sm:p-7 flex flex-col justify-between reviso-card-interactive">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-display">
                1. Concise Revision Notes
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Structured topic summaries, clear bullet points, and highlighted key takeaways derived directly from your lecture documents.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center justify-between">
              <span>Scannable & Printable</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Card 2: 5-Question Quiz */}
          <div className="reviso-card p-6 sm:p-7 flex flex-col justify-between reviso-card-interactive">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-display">
                2. 5 Practice Questions
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                A focused 5-question practice quiz based ONLY on the uploaded lecture, with instant answer scoring and detailed explanations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center justify-between">
              <span>Instant Answer Explanations</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Card 3: Key Concepts & Export */}
          <div className="reviso-card p-6 sm:p-7 flex flex-col justify-between reviso-card-interactive">
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-display">
                3. Key Concepts & Export
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Essential terminology definitions, formula callout boxes, and easy one-click Markdown/PDF export for your study workflow.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center justify-between">
              <span>Export PDF / Markdown</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

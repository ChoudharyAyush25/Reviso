import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Printer, 
  Check, 
  Share2, 
  CheckCircle2
} from 'lucide-react';

export default function ExportModal({ lecture, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeQuiz, setIncludeQuiz] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);

  if (!isOpen) return null;

  // Generate plain text / markdown export string
  const generateMarkdownText = () => {
    let text = `# ${lecture.title}\nCourse: ${lecture.course || 'Lecture Revision'}\nParsed: ${lecture.pagesParsed || 1} pages • ${lecture.readTime || '5 min read'}\n\n`;
    
    if (includeNotes && lecture.notes) {
      text += `## REVISION NOTES\n\n`;
      lecture.notes.forEach((sec) => {
        text += `### ${sec.sectionTitle}\n${sec.summary}\n\n`;
        if (sec.bullets) {
          sec.bullets.forEach(b => {
            text += `- ${b}\n`;
          });
        }
        if (sec.concepts && sec.concepts.length > 0) {
          text += `\n**Key Concepts**:\n`;
          sec.concepts.forEach(c => {
            text += `- **${c.term}**: ${c.definition}\n`;
          });
        }
        if (sec.keyTakeaway || sec.takeaway) {
          text += `\n> ${sec.keyTakeaway || sec.takeaway}\n\n`;
        }
        text += `\n`;
      });
    }

    if (includeQuiz && lecture.quiz) {
      text += `## PRACTICE QUIZ (5 QUESTIONS)\n\n`;
      lecture.quiz.forEach((q, idx) => {
        text += `### Q${idx + 1}: ${q.question}\n`;
        if (q.options) {
          q.options.forEach(opt => {
            text += `   [${opt.id}] ${opt.text}\n`;
          });
        }
        if (includeExplanations) {
          text += `\n**Correct Answer**: Option ${q.correctId}\n`;
          text += `**Explanation**: ${q.explanation}\n\n`;
        }
      });
    }

    return text;
  };

  const handleCopy = () => {
    const text = generateMarkdownText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMD = () => {
    const text = generateMarkdownText();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(lecture.title || 'lecture').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_revision_pack.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close export dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
            <Share2 className="w-4 h-4" />
          </div>
          <h2 id="export-modal-title" className="text-xl font-bold font-display text-slate-900">
            Export Revision Pack
          </h2>
        </div>

        <p className="text-slate-500 text-xs sm:text-sm mb-5">
          Download or copy your generated study notes & practice quiz for {lecture.course || 'this lecture'}.
        </p>

        {/* Success Toast Banner */}
        {(downloadSuccess || copied) && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess ? 'Revision pack downloaded (.md file format)' : 'Revision pack text copied to clipboard!'}</span>
          </div>
        )}

        {/* Content Scope Toggles */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-3 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Export Scope Options:
          </span>

          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
            <span>Include Revision Notes</span>
            <input 
              type="checkbox"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
            <span>Include 5-Question Quiz</span>
            <input 
              type="checkbox"
              checked={includeQuiz}
              onChange={(e) => setIncludeQuiz(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
            <span>Include Answer Explanations</span>
            <input 
              type="checkbox"
              checked={includeExplanations}
              onChange={(e) => setIncludeExplanations(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        {/* Export Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          <button
            onClick={handleDownloadMD}
            className="reviso-btn reviso-btn-secondary justify-start p-3 text-xs font-bold"
          >
            <Download className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Download Markdown (.md)</span>
          </button>

          <button
            onClick={handleCopy}
            className="reviso-btn reviso-btn-ghost justify-start p-3 text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Copy className="w-4 h-4 text-slate-500 shrink-0" />}
            <span>{copied ? 'Copied!' : 'Copy Plain Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="reviso-btn reviso-btn-ghost justify-start p-3 text-xs font-semibold sm:col-span-2"
          >
            <Printer className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Print or Save as PDF (Browser Print)</span>
          </button>

        </div>

        {/* Footer Info */}
        <div className="text-center border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Close Dialog
          </button>
        </div>

      </div>
    </div>
  );
}

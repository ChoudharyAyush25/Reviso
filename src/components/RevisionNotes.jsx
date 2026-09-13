import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Printer, 
  Share2, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  FileText,
  Tag,
  ArrowRight
} from 'lucide-react';

export default function RevisionNotes({ lecture, onSwitchToQuiz, onOpenExport }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notes based on search query
  const filteredNotes = lecture.notes.filter(sec => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      sec.sectionTitle.toLowerCase().includes(query) ||
      sec.summary.toLowerCase().includes(query) ||
      sec.bullets.some(b => b.toLowerCase().includes(query)) ||
      (sec.concepts && sec.concepts.some(c => c.term.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="space-y-8 w-full">
      
      {/* Lecture Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="reviso-badge reviso-badge-indigo">
                {lecture.course}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                • {lecture.readTime}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                • {lecture.pagesParsed} Pages Parsed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-tight">
              {lecture.title}
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="reviso-btn reviso-btn-ghost text-xs py-2 px-3.5"
              title="Print Revision Notes"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Notes</span>
            </button>

            <button
              onClick={onOpenExport}
              className="reviso-btn reviso-btn-secondary text-xs py-2 px-4"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export Pack</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
          <span className="font-bold text-slate-900">Executive Summary: </span>
          {lecture.overview}
        </p>

        {/* Topic Badges & Search Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Core Topics:
            </span>
            {lecture.topics.map((topic, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Search Filter */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes or terms..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
          </div>

        </div>

      </div>

      {/* Structured Notes Sections */}
      <div className="space-y-6">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No revision notes matched your search term "{searchTerm}".
          </div>
        ) : (
          filteredNotes.map((sec, idx) => (
            <section 
              key={sec.id || idx}
              id={sec.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10 transition-all hover:border-slate-300"
            >
              
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {sec.sectionTitle}
                </h2>
                <span className="text-xs font-semibold text-slate-400">Section {idx + 1}</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                "{sec.summary}"
              </p>

              {/* Bullet Points */}
              <ul className="space-y-3.5 mb-6 pl-1">
                {sec.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3.5 text-sm sm:text-base text-slate-800 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0 shadow-2xs" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Key Concepts Definitions Grid */}
              {sec.concepts && sec.concepts.length > 0 && (
                <div className="my-6 p-4 sm:p-5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    Key Term Definitions
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sec.concepts.map((c, cIdx) => (
                      <div key={cIdx} className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                        <span className="font-bold text-xs text-indigo-950 block mb-1">{c.term}</span>
                        <span className="text-xs text-slate-600 leading-relaxed block">{c.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              {sec.comparisonTable && (
                <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        {sec.comparisonTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {sec.comparisonTable.rows.map((r, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70">
                          {r.map((cell, cellIdx) => (
                            <td key={cellIdx} className={`p-3.5 ${cellIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Key Takeaway Card */}
              {(sec.takeaway || sec.keyTakeaway) && (
                <div className="takeaway-card">
                  <p className="text-sm sm:text-base font-bold text-indigo-950 leading-relaxed">
                    {sec.takeaway || sec.keyTakeaway}
                  </p>
                </div>
              )}

            </section>
          ))
        )}
      </div>

      {/* Bottom Switch to Quiz CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to test your comprehension?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
            Take the 5-Question Practice Quiz
          </h3>
          <p className="text-indigo-200 text-xs sm:text-sm">
            Questions generated strictly from this lecture material to reinforce active recall.
          </p>
        </div>

        <button
          onClick={onSwitchToQuiz}
          className="reviso-btn bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-7 py-3.5 rounded-xl shadow-lg shrink-0 text-sm"
        >
          <span>Start Practice Quiz</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

    </div>
  );
}

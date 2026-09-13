import React, { useState } from 'react';
import { BookOpen, HelpCircle, Share2, Sparkles } from 'lucide-react';
import RevisionNotes from './RevisionNotes';
import PracticeQuiz from './PracticeQuiz';

export default function RevisionPackView({ lecture, onOpenExport }) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'quiz'

  return (
    <div className="w-full py-8 md:py-12 container-wide">
      
      {/* Sticky Mode Navigation Tab Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl p-2.5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto" role="tablist" aria-label="Revision Pack Sections">
          
          <button
            role="tab"
            aria-selected={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Revision Notes</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'quiz'}
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Quiz</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'quiz' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
            }`}>5 Qs</span>
          </button>

        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="w-full sm:w-auto reviso-btn reviso-btn-secondary text-xs py-2.5 px-5 shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Export Revision Pack</span>
        </button>

      </div>

      {/* Main Content View Container */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'notes' ? (
          <RevisionNotes 
            lecture={lecture} 
            onSwitchToQuiz={() => setActiveTab('quiz')} 
            onOpenExport={onOpenExport}
          />
        ) : (
          <PracticeQuiz 
            lecture={lecture} 
            onSwitchToNotes={() => setActiveTab('notes')} 
            onOpenExport={onOpenExport}
          />
        )}
      </div>

    </div>
  );
}

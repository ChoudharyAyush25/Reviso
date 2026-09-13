import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({ currentLecture, onReset }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="container-wide flex items-center justify-between h-16 sm:h-18">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          title="Return to Reviso Home"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl font-display tracking-tight text-slate-900">Reviso</span>
            <span className="reviso-badge reviso-badge-indigo text-[11px] py-0.5 hidden xs:inline-flex">
              <Sparkles className="w-3 h-3 text-indigo-600" /> AI Revision Pack
            </span>
          </div>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Privacy Security Chip */}
          <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/80 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>FERPA & GDPR Compliant • 256-Bit Encrypted</span>
          </div>

          {/* Upload New Action Button */}
          {currentLecture && (
            <button
              onClick={onReset}
              className="reviso-btn reviso-btn-ghost text-xs py-1.5 px-3 sm:px-4"
              title="Upload another lecture PDF"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload New Lecture</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

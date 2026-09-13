import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Brain, 
  Check
} from 'lucide-react';

const PROCESSING_STEPS = [
  { id: 1, label: "Reading & parsing lecture PDF", detail: "Extracting text, slides, and structural headings" },
  { id: 2, label: "Identifying key concepts & definitions", detail: "Highlighting exam-relevant terminology and formulas" },
  { id: 3, label: "Synthesizing concise revision notes", detail: "Formatting structured topic summaries and key takeaways" },
  { id: 4, label: "Building 5-question practice quiz", detail: "Drafting targeted multiple choice questions with explanations" },
  { id: 5, label: "Ready to study", detail: "Finalizing your personalized revision pack" }
];

export default function ProcessingState({ lectureTitle, courseName, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [extractedConcepts, setExtractedConcepts] = useState([]);

  useEffect(() => {
    // Step 1 -> 2
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(40);
      setExtractedConcepts(["Action Potential", "Synaptic Vesicles"]);
    }, 1200);

    // Step 2 -> 3
    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(68);
      setExtractedConcepts(prev => [...prev, "Long-Term Potentiation (LTP)", "NMDA Receptor"]);
    }, 2600);

    // Step 3 -> 4
    const timer3 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(90);
      setExtractedConcepts(prev => [...prev, "Ca2+ Exocytosis", "AMPA vs NMDA"]);
    }, 4000);

    // Step 4 -> 5 & Finish
    const timer4 = setTimeout(() => {
      setCurrentStep(5);
      setProgress(100);
    }, 5200);

    const timer5 = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="py-12 md:py-20 container-narrow" aria-live="polite">
      
      {/* Central Processing Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 relative overflow-hidden">
        
        {/* Top Shimmer Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div 
            className="h-full shimmer-bar transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header Info */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow shadow-sm">
            <Brain className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-3">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate max-w-xs">{lectureTitle}</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 mb-1">
            Analyzing Lecture Material
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Transforming {courseName || 'your lecture'} into a structured revision pack...
          </p>
        </div>

        {/* Status Stepper */}
        <div className="space-y-4 max-w-md mx-auto mb-8">
          {PROCESSING_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div 
                key={step.id} 
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-indigo-50/70 border border-indigo-200/80 shadow-sm' : ''
                }`}
              >
                {/* Icon Marker */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  )}
                  {isPending && (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center font-semibold text-xs">
                      {step.id}
                    </div>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${
                    isCompleted ? 'text-slate-800' : isActive ? 'text-indigo-950 font-bold' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Concept Stream Preview Box */}
        {extractedConcepts.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Live Extracted Concepts
              </span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {extractedConcepts.length} topics detected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {extractedConcepts.map((concept, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs animate-fade-in"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

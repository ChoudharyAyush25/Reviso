import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileText, 
  Brain, 
  Check,
  AlertTriangle,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { SAMPLE_LECTURES } from '../mockData/sampleLecturePacks';

const PROCESSING_STEPS = [
  { id: 1, label: "Reading & parsing lecture PDF", detail: "Extracting text, slides, and structural headings" },
  { id: 2, label: "Identifying key concepts & definitions", detail: "Highlighting exam-relevant terminology and formulas" },
  { id: 3, label: "Synthesizing concise revision notes", detail: "Formatting structured topic summaries and key takeaways" },
  { id: 4, label: "Building 5-question practice quiz", detail: "Drafting targeted multiple choice questions with explanations" },
  { id: 5, label: "Ready to study", detail: "Finalizing your personalized revision pack" }
];

export default function ProcessingState({ file, courseName, sampleLecture, onSuccess, onError, onFallbackDemo }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [extractedConcepts, setExtractedConcepts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isSubscribed = true;

    // If sample lecture demo deck selected, run demo animation sequence
    if (sampleLecture) {
      const t1 = setTimeout(() => { if (isSubscribed) { setCurrentStep(2); setProgress(45); setExtractedConcepts(["Action Potential", "Synaptic Vesicles"]); } }, 1000);
      const t2 = setTimeout(() => { if (isSubscribed) { setCurrentStep(3); setProgress(70); setExtractedConcepts(prev => [...prev, "Long-Term Potentiation (LTP)", "NMDA Receptor"]); } }, 2200);
      const t3 = setTimeout(() => { if (isSubscribed) { setCurrentStep(4); setProgress(90); setExtractedConcepts(prev => [...prev, "Ca2+ Exocytosis", "AMPA vs NMDA"]); } }, 3400);
      const t4 = setTimeout(() => { if (isSubscribed) { setCurrentStep(5); setProgress(100); } }, 4400);
      const t5 = setTimeout(() => { if (isSubscribed) onSuccess(sampleLecture); }, 5000);
      return () => { isSubscribed = false; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }

    // Real PDF Upload Processing Sequence
    if (file) {
      const t1 = setTimeout(() => { if (isSubscribed) { setCurrentStep(2); setProgress(35); } }, 1200);
      const t2 = setTimeout(() => { if (isSubscribed) { setCurrentStep(3); setProgress(60); } }, 2500);

      // Perform Real API Call
      const formData = new FormData();
      formData.append('file', file);
      if (courseName) {
        formData.append('courseName', courseName);
      }

      fetch('/api/generate-revision-pack', {
        method: 'POST',
        body: formData
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Server responded with status ${res.status}`);
        }
        return data;
      })
      .then((packData) => {
        if (!isSubscribed) return;
        setCurrentStep(4);
        setProgress(85);
        if (packData.topics) {
          setExtractedConcepts(packData.topics);
        }

        setTimeout(() => {
          if (!isSubscribed) return;
          setCurrentStep(5);
          setProgress(100);
          setTimeout(() => {
            if (isSubscribed) onSuccess(packData);
          }, 800);
        }, 1200);
      })
      .catch((err) => {
        console.error("Revision Pack Generation Error:", err);
        if (isSubscribed) {
          setErrorMessage(err.message || "Failed to generate revision pack.");
        }
      });

      return () => { isSubscribed = false; clearTimeout(t1); clearTimeout(t2); };
    }
  }, [file, courseName, sampleLecture, onSuccess]);

  // Error State View
  if (errorMessage) {
    return (
      <div className="py-12 md:py-20 container-narrow">
        <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 sm:p-10 text-center">
          
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">
            Unable to Generate Revision Pack
          </h2>

          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto bg-red-50/70 p-3.5 rounded-xl border border-red-100 text-red-800">
            {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onError}
              className="w-full sm:w-auto reviso-btn reviso-btn-primary py-2.5 px-5 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Uploading Again</span>
            </button>

            <button
              onClick={onFallbackDemo}
              className="w-full sm:w-auto reviso-btn reviso-btn-secondary py-2.5 px-5 text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Load Demo Lecture Deck</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Processing Sequence View
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
            <span className="truncate max-w-xs">{file?.name || sampleLecture?.fileName || 'Uploaded Lecture PDF'}</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 mb-1">
            Analyzing Lecture Material
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Transforming {courseName || sampleLecture?.course || 'your lecture'} into a structured revision pack...
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
                className={`flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-indigo-50/70 border border-indigo-200/80 shadow-xs' : ''
                }`}
              >
                {/* Icon Marker */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
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

        {/* Live Extracted Concepts */}
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs"
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

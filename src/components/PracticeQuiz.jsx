import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  Share2, 
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeQuiz({ lecture, onSwitchToNotes, onOpenExport }) {
  const questions = lecture.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptionId }
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const selectedOption = userAnswers[currentQ?.id];

  const handleSelectOption = (optionId) => {
    if (selectedOption !== undefined) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctId) {
        score += 1;
      }
    });
    return score;
  };

  const finalScore = calculateScore();
  const scorePercentage = Math.round((finalScore / questions.length) * 100);

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
        No quiz questions generated for this lecture.
      </div>
    );
  }

  // Final Score Summary View
  if (isCompleted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center animate-fade-in">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quiz Completed!</span>
        </div>

        <h2 className="text-3xl font-extrabold font-display text-slate-900 mb-2">
          Your Score: {finalScore} / {questions.length} ({scorePercentage}%)
        </h2>

        <p className="text-slate-600 text-sm mb-8">
          {scorePercentage >= 80 
            ? "Great mastery! You have a solid understanding of the core lecture concepts."
            : "Good effort! Review the revision notes below to reinforce your understanding."
          }
        </p>

        {/* Question Performance Breakdown List */}
        <div className="text-left space-y-3 mb-8 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Question Performance Breakdown
          </h3>
          {questions.map((q, idx) => {
            const isCorrect = userAnswers[q.id] === q.correctId;
            return (
              <div key={q.id} className="flex items-start justify-between gap-3 text-xs bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-700">Q{idx + 1}.</span>
                  <span className="text-slate-800 font-medium">{q.question}</span>
                </div>
                {isCorrect ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-800 font-bold shrink-0">
                    <XCircle className="w-3.5 h-3.5 text-red-600" /> Review
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSwitchToNotes}
            className="w-full sm:w-auto reviso-btn reviso-btn-ghost text-sm py-2.5 px-5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Revision Notes</span>
          </button>

          <button
            onClick={handleResetQuiz}
            className="w-full sm:w-auto reviso-btn reviso-btn-secondary text-sm py-2.5 px-5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onOpenExport}
            className="w-full sm:w-auto reviso-btn reviso-btn-primary text-sm py-2.5 px-5"
          >
            <Share2 className="w-4 h-4" />
            <span>Export Revision Pack</span>
          </button>
        </div>

      </div>
    );
  }

  // Active Question Card View
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Quiz Progress Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {currentIndex + 1}/5
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Concept: {currentQ.conceptTag}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-32 sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 lg:p-10">
        
        <div className="flex items-center gap-2 mb-4">
          <span className="reviso-badge reviso-badge-indigo">
            Bloom's Taxonomy: {currentQ.bloomLevel}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            • Generated from lecture material
          </span>
        </div>

        {/* Question Stem */}
        <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug mb-6">
          {currentQ.question}
        </h2>

        {/* Option Cards */}
        <div className="space-y-3.5 mb-6" role="radiogroup" aria-label="Quiz answer choices">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = opt.id === currentQ.correctId;
            const hasAnswered = selectedOption !== undefined;

            let optionStyle = "border-slate-200 hover:border-indigo-400 bg-white text-slate-800 hover:bg-slate-50/50";
            if (hasAnswered) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500 bg-emerald-50/90 text-emerald-950 font-semibold ring-2 ring-emerald-500/20";
              } else if (isSelected && !isCorrectOption) {
                optionStyle = "border-red-400 bg-red-50/90 text-red-950 font-semibold";
              } else {
                optionStyle = "border-slate-200 bg-slate-50/40 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                disabled={hasAnswered}
                role="radio"
                aria-checked={isSelected}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-4 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    hasAnswered && isCorrectOption 
                      ? 'bg-emerald-600 text-white' 
                      : hasAnswered && isSelected && !isCorrectOption
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {opt.id}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{opt.text}</span>
                </div>

                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card (Appears after answering) */}
        {selectedOption && (
          <div className={`p-4 sm:p-5 rounded-xl border text-sm leading-relaxed mb-6 animate-fade-in ${
            selectedOption === currentQ.correctId 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {selectedOption === currentQ.correctId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Correct Answer!</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Explanation & Context</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm">{currentQ.explanation}</p>
          </div>
        )}

        {/* Sticky Action Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="reviso-btn reviso-btn-ghost text-xs py-2.5 px-4 disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="reviso-btn reviso-btn-primary text-xs py-2.5 px-6"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import Header from './components/Header';
import UploadLanding from './components/UploadLanding';
import ProcessingState from './components/ProcessingState';
import RevisionPackView from './components/RevisionPackView';
import ExportModal from './components/ExportModal';
import { SAMPLE_LECTURES } from './mockData/sampleLecturePacks';
import './styles/index.css';

// APP STATES: 'IDLE_UPLOAD' | 'ANALYZING' | 'REVISION_PACK'

export default function App() {
  const [appState, setAppState] = useState('IDLE_UPLOAD');
  const [activeLecture, setActiveLecture] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [pendingMeta, setPendingMeta] = useState(null);

  // User uploaded custom PDF
  const handleUploadSubmit = ({ file, courseName, title }) => {
    setPendingMeta({
      title: title || file.name.replace(/\.[^/.]+$/, ""),
      course: courseName,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    });
    setAppState('ANALYZING');
  };

  // User picked a pre-loaded sample lecture deck
  const handleSelectSample = (sample) => {
    setActiveLecture(sample);
    setPendingMeta({
      title: sample.title,
      course: sample.course,
      fileName: sample.fileName,
      fileSize: sample.fileSize
    });
    setAppState('ANALYZING');
  };

  // Processing sequence finished
  const handleProcessingComplete = () => {
    if (!activeLecture) {
      // Default to sample 0 (Neurobiology) with custom titles if user uploaded custom PDF
      const baseSample = SAMPLE_LECTURES[0];
      setActiveLecture({
        ...baseSample,
        title: pendingMeta?.title || baseSample.title,
        course: pendingMeta?.course || baseSample.course,
        fileName: pendingMeta?.fileName || baseSample.fileName,
        fileSize: pendingMeta?.fileSize || baseSample.fileSize
      });
    }
    setAppState('REVISION_PACK');
  };

  // Reset back to upload landing
  const handleReset = () => {
    setAppState('IDLE_UPLOAD');
    setActiveLecture(null);
    setPendingMeta(null);
    setIsExportOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Global Brand Header */}
      <Header 
        currentLecture={activeLecture} 
        onReset={handleReset} 
      />

      {/* Main View Router */}
      <main className="flex-1">
        {appState === 'IDLE_UPLOAD' && (
          <UploadLanding 
            onUploadSubmit={handleUploadSubmit}
            onSelectSample={handleSelectSample}
          />
        )}

        {appState === 'ANALYZING' && (
          <ProcessingState 
            lectureTitle={pendingMeta?.title || 'Uploaded Lecture PDF'}
            courseName={pendingMeta?.course || 'General Revision'}
            onComplete={handleProcessingComplete}
          />
        )}

        {appState === 'REVISION_PACK' && activeLecture && (
          <RevisionPackView 
            lecture={activeLecture}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Export / Share Modal */}
      {activeLecture && (
        <ExportModal 
          lecture={activeLecture}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Global Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Reviso AI</span>
            <span>• Single-purpose AI Lecture Revision Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-medium">🔒 FERPA & GDPR Compliant</span>
            <span>Privacy Policy</span>
            <span>Terms of Study</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

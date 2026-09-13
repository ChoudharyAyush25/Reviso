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

  // Pending Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [courseNameInput, setCourseNameInput] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);

  // User uploaded custom PDF
  const handleUploadSubmit = ({ file, courseName }) => {
    setUploadedFile(file);
    setCourseNameInput(courseName);
    setSelectedSample(null);
    setAppState('ANALYZING');
  };

  // User picked a pre-loaded sample lecture deck
  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setUploadedFile(null);
    setCourseNameInput('');
    setAppState('ANALYZING');
  };

  // Processing sequence finished (real API response or sample)
  const handleProcessingSuccess = (packData) => {
    setActiveLecture(packData);
    setAppState('REVISION_PACK');
  };

  // Fallback trigger if backend fails
  const handleFallbackDemo = () => {
    setActiveLecture(SAMPLE_LECTURES[0]);
    setAppState('REVISION_PACK');
  };

  // Reset back to upload landing
  const handleReset = () => {
    setAppState('IDLE_UPLOAD');
    setActiveLecture(null);
    setUploadedFile(null);
    setSelectedSample(null);
    setCourseNameInput('');
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
            file={uploadedFile}
            courseName={courseNameInput}
            sampleLecture={selectedSample}
            onSuccess={handleProcessingSuccess}
            onError={() => setAppState('IDLE_UPLOAD')}
            onFallbackDemo={handleFallbackDemo}
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
            <span className="text-emerald-700 font-medium">🔒 Secure Server-Side Processing</span>
            <span>Privacy Policy</span>
            <span>Terms of Study</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

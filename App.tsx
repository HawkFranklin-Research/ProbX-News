import React, { useState } from 'react';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { InputSection } from './components/InputSection';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, InputType } from './types';

const App: React.FC = () => {
  // State management for the app flow
  const [view, setView] = useState<'input' | 'processing' | 'result'>('input');
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handler for starting the analysis
  const handleAnalyze = async (input: string | File, type: InputType) => {
    setView('processing');
    setError(null);

    try {
      const result = await analyzeContent(input, type);
      setAnalysisData(result);
      setView('result');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
      setView('input');
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setView('input');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 pb-12 w-full max-w-3xl mx-auto z-10">
        
        {error && (
          <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {view === 'input' && (
          <InputSection onAnalyze={handleAnalyze} />
        )}

        {view === 'processing' && (
          <AnalysisLoader />
        )}

        {view === 'result' && analysisData && (
          <ResultDisplay result={analysisData} onReset={handleReset} />
        )}

      </main>

      {/* Sticky Footer Ad Ticker */}
      <NewsTicker />
    </div>
  );
};

export default App;
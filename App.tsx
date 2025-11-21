import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { InputSection } from './components/InputSection';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, InputType, ModelId } from './types';
import logoOnly from './assets/imgs/logo_only.png';

const App: React.FC = () => {
  // Auth state
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // State management for the app flow
  const [view, setView] = useState<'input' | 'processing' | 'result'>('input');
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        }
      } catch (e) {
        console.error("Error checking API key status:", e);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Best effort: assume success after modal action completes
        setHasApiKey(true);
      } catch (e) {
        console.error("Error selecting key:", e);
      }
    }
  };

  // Handler for starting the analysis
  const handleAnalyze = async (input: string | File, type: InputType, modelId: ModelId) => {
    setView('processing');
    setError(null);

    try {
      const result = await analyzeContent(input, type, modelId);
      setAnalysisData(result);
      setView('result');
    } catch (err: any) {
      console.error(err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError("Your session has expired. Please reconnect your Google account.");
        setView('input');
        return;
      }

      setError(errorMessage || "An unexpected error occurred during analysis.");
      setView('input');
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setView('input');
  };

  // Loading Screen for Auth Check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Landing / Login Screen
  if (!hasApiKey) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 text-white items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="z-10 flex flex-col items-center max-w-lg">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-2xl mb-8 shadow-2xl shadow-blue-500/20">
             <div className="h-16 w-16 overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-sm">
                <img 
                    src={logoOnly} 
                    alt="ProbX Logo" 
                    className="h-full w-full object-contain" 
                />
            </div>
          </div>
          
          <h1 className="text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ProbX News
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            The Intelligent Fact Checker. Open-source fake news detection powered by Google Gemini.
          </p>
          
          <button 
            onClick={handleConnect} 
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-xl flex items-center justify-center gap-3"
          >
            {/* Simple Sparkle Icon */}
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            Connect with Google
          </button>

          <p className="mt-8 text-xs text-slate-500 border-t border-slate-800 pt-4 w-full">
            By connecting, you agree to use your own API key. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white underline ml-1 transition-colors">
              View Billing & Free Tier Details
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 pb-12 w-full max-w-3xl mx-auto z-10">
        
        {error && (
          <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm animate-pulse" role="alert">
            <p className="font-bold">System Alert</p>
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

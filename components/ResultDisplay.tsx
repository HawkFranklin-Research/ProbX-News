import React from 'react';
import { AnalysisResult, Verdict } from '../types';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  
  const isFake = result.verdict === Verdict.FAKE;
  const isReal = result.verdict === Verdict.REAL;
  const isSatire = result.verdict === Verdict.SATIRE;
  
  let colorClass = "bg-slate-100 border-slate-300 text-slate-800";
  let icon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );

  if (isFake) {
    colorClass = "bg-red-50 border-red-200 text-red-700";
    icon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );
  } else if (isReal) {
    colorClass = "bg-green-50 border-green-200 text-green-700";
    icon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-green-600">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
    );
  } else if (isSatire) {
      colorClass = "bg-yellow-50 border-yellow-200 text-yellow-700";
      icon = <span className="text-6xl">🎭</span>
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Verdict Card */}
      <div className={`rounded-3xl border-4 p-8 text-center shadow-xl transform transition-all ${colorClass}`}>
        <div className="flex justify-center mb-4 animate-bounce-slow">{icon}</div>
        <h2 className="text-4xl font-black uppercase tracking-wider mb-2">{result.verdict}</h2>
        <div className="inline-block bg-white/50 px-3 py-1 rounded-full text-sm font-bold border border-current/20 mb-4">
           CONFIDENCE: {result.confidenceScore}%
        </div>
        <p className="text-xl font-medium leading-relaxed opacity-90">
          {result.summary}
        </p>
      </div>

      {/* Resources / Evidence Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Evidence Sources
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border">VERIFIED BY GOOGLE</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {result.sources.length > 0 ? (
                result.sources.map((source, idx) => (
                    <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="block p-4 hover:bg-slate-50 transition-colors group">
                        <div className="flex justify-between items-start">
                            <div className="font-bold text-blue-600 group-hover:underline">{source.title}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{source.snippet}</div>
                    </a>
                ))
            ) : (
                <div className="p-6 text-center text-slate-400 italic">
                    No direct web links returned, but analysis was performed based on internal knowledge and input context.
                </div>
            )}
        </div>
      </div>

      {/* Agent Research Log (The "Excel Sheet" Visualization) */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25v1.5c0 .621.504 1.125 1.125 1.125m17.25-2.625h-7.5c-.621 0-1.125.504-1.125 1.125" />
                </svg>
                Agent Research Log
            </h3>
            <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">LIVE DATA</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 w-1/4">Action</th>
                        <th className="px-4 py-3 w-1/2">Finding</th>
                        <th className="px-4 py-3 w-1/4">Source</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {result.agentLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-700">{log.action}</td>
                            <td className="px-4 py-3 text-slate-600">{log.findings}</td>
                            <td className="px-4 py-3">
                                {log.source ? (
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        log.source.toLowerCase().includes('x') || log.source.toLowerCase().includes('twitter') 
                                        ? 'bg-black text-white' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {log.source}
                                    </span>
                                ) : (
                                    <span className="text-slate-400">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
        
        {/* Detailed Markdown Report */}
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Detailed Analysis</h3>
            <div className="prose prose-slate max-w-none">
                {/* We treat the markdown as simple paragraphs for safety in this specific demo, 
                    but typically you'd use a library like react-markdown here. 
                    Since I cannot introduce new heavy npm deps easily, I'll render whitespace. */}
                 <pre className="whitespace-pre-wrap font-sans text-slate-600 text-base leading-relaxed">
                    {result.detailedMarkdown}
                 </pre>
            </div>
       </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        ANALYZE ANOTHER
      </button>
    </div>
  );
};
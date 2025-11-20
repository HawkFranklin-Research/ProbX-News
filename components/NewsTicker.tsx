import React from 'react';

export const NewsTicker: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-slate-900 border-t border-slate-700 text-white overflow-hidden z-40 flex items-center">
      <div className="bg-red-600 text-white font-bold px-4 h-full flex items-center z-50 shadow-lg text-sm uppercase tracking-wider">
        Live Updates
      </div>
      <div className="relative flex overflow-x-hidden w-full">
        <div className="animate-ticker whitespace-nowrap py-2 flex gap-12">
          <span className="text-sm text-slate-300"><strong className="text-yellow-400">AD:</strong> Secure your digital life with CyberShield VPN. 50% off today.</span>
          <span className="text-sm text-slate-300"><strong className="text-blue-400">INFO:</strong> TruthGuard Agent now analyzing 500+ sources per second.</span>
          <span className="text-sm text-slate-300"><strong className="text-yellow-400">SPONSORED:</strong> Learn to spot Deepfakes with our free masterclass.</span>
          <span className="text-sm text-slate-300"><strong className="text-green-400">SYSTEM:</strong> Gemini 3.0 Pro Model Active - Thinking Mode Enabled.</span>
          <span className="text-sm text-slate-300"><strong className="text-yellow-400">AD:</strong> Drink Water! Stay Hydrated.</span>
          {/* Duplicate for loop effect */}
          <span className="text-sm text-slate-300"><strong className="text-yellow-400">AD:</strong> Secure your digital life with CyberShield VPN. 50% off today.</span>
          <span className="text-sm text-slate-300"><strong className="text-blue-400">INFO:</strong> TruthGuard Agent now analyzing 500+ sources per second.</span>
          <span className="text-sm text-slate-300"><strong className="text-yellow-400">SPONSORED:</strong> Learn to spot Deepfakes with our free masterclass.</span>
        </div>
      </div>
    </div>
  );
};
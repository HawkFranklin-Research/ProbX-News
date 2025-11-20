import React, { useState, useRef } from 'react';
import { InputType } from '../types';

interface InputSectionProps {
  onAnalyze: (input: string | File, type: InputType) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze }) => {
  const [inputType, setInputType] = useState<InputType>(InputType.TEXT);
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === InputType.TEXT && textInput.trim()) {
      onAnalyze(textInput, InputType.TEXT);
    } else if (inputType === InputType.IMAGE && fileInput) {
      onAnalyze(fileInput, InputType.IMAGE);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">Verify the Truth</h2>
        <p className="text-blue-100">Analyze news links or images with advanced AI grounding.</p>
      </div>

      <div className="p-6">
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setInputType(InputType.TEXT)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              inputType === InputType.TEXT 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🔗 Link / Text
          </button>
          <button
            onClick={() => setInputType(InputType.IMAGE)}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              inputType === InputType.IMAGE 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🖼️ Image Analysis
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputType === InputType.TEXT ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Paste Article URL or Claim</label>
              <textarea
                rows={4}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-slate-50 text-lg"
                placeholder="e.g., https://news-site.com/article or 'The moon is made of cheese...'"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 transition-colors hover:bg-slate-100">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative w-full max-h-64 flex justify-center">
                  <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg shadow-md object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setFileInput(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div 
                  className="text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="mx-auto h-12 w-12 text-slate-400 mb-3">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Click to upload text image or screenshot</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP supported</p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={inputType === InputType.TEXT ? !textInput : !fileInput}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
              ${(inputType === InputType.TEXT ? !textInput : !fileInput)
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
              }`}
          >
            <span>IDENTIFY FAKE</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
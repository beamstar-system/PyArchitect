import React, { useState } from 'react';
import { Loader2, Sparkles, Terminal } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Describe your Python Project</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-gray-500 font-mono text-sm"
              placeholder="e.g., A FastAPI backend for a Todo application with SQLite database, Pydantic models, and CRUD endpoints."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 italic">
              Powered by Gemini 3.0 Pro
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                !prompt.trim() || isGenerating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Codebase
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptInput;
import React, { useEffect, useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { GeneratedFile } from '../types';

interface CodeViewerProps {
  file: GeneratedFile | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [file]);

  const handleCopy = async () => {
    if (file) {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 bg-gray-950">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-gray-700 rounded-full" />
            <div className="w-3 h-3 bg-gray-700 rounded-full mx-1" />
            <div className="w-3 h-3 bg-gray-700 rounded-full" />
        </div>
        <p className="font-medium">Select a file to view code</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-400">{file.path}</span>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                title="Download File"
            >
                <Download className="w-4 h-4" />
            </button>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700"
            >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <pre className="p-6 text-sm font-mono leading-relaxed tab-4 text-gray-300">
          <code className="whitespace-pre-wrap break-words block">
            {file.content}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
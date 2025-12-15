import React, { useState, useMemo } from 'react';
import PromptInput from './components/PromptInput';
import FileExplorer from './components/FileExplorer';
import CodeViewer from './components/CodeViewer';
import { generateCodebase } from './services/geminiService';
import { buildFileTree } from './utils/fileUtils';
import { ProjectStructure, GeneratedFile, FileNode } from './types';
import { Code, Github, AlertCircle } from 'lucide-react';

export default function App() {
  const [projectData, setProjectData] = useState<ProjectStructure | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileTree = useMemo(() => {
    return projectData ? buildFileTree(projectData.files) : [];
  }, [projectData]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    setProjectData(null);
    setSelectedFile(null);

    try {
      const data = await generateCodebase(prompt);
      setProjectData(data);
      // Select the first file automatically (usually README or main)
      if (data.files.length > 0) {
        // Try to find README first, else first file
        const readme = data.files.find(f => f.path.toLowerCase().includes('readme'));
        setSelectedFile(readme || data.files[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate codebase. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectFileNode = (node: FileNode) => {
    if (node.type === 'file' && node.content && projectData) {
      setSelectedFile({
        path: node.path,
        content: node.content
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
      {/* Navbar */}
      <header className="flex-none h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">PyArchitect <span className="text-blue-400">AI</span></h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Codebase Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {projectData && (
             <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700 text-xs text-gray-300">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Project: {projectData.projectName}
             </span>
           )}
           <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            title="View on GitHub"
           >
             <Github className="w-5 h-5" />
           </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* If no project, show hero input centered */}
        {!projectData && !isGenerating && !error && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
                 <div className="text-center mb-12 max-w-2xl">
                    <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Turn ideas into production code.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Describe your Python project needs, and watch as a complete, structured codebase is architected for you in seconds.
                    </p>
                 </div>
                 <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
                 
                 <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-left">
                    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mb-4 text-blue-400 font-bold">01</div>
                        <h3 className="font-bold text-gray-200 mb-2">Describe</h3>
                        <p className="text-sm text-gray-500">Simply tell the AI what you want to build using natural language.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all">
                         <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 text-purple-400 font-bold">02</div>
                        <h3 className="font-bold text-gray-200 mb-2">Generate</h3>
                        <p className="text-sm text-gray-500">Gemini models architect the file structure and write the source code.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/30 transition-all">
                         <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center mb-4 text-green-400 font-bold">03</div>
                        <h3 className="font-bold text-gray-200 mb-2">Export</h3>
                        <p className="text-sm text-gray-500">Browse the file tree, review the code, and export to your machine.</p>
                    </div>
                 </div>
            </div>
        )}

        {/* Loading State */}
        {isGenerating && (
             <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Code className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">Architecting Solution...</h3>
                <p className="text-gray-400 mt-2 max-w-md text-center">
                    Analyzing requirements, designing folder structure, and writing Python code...
                </p>
             </div>
        )}

        {/* Error State */}
        {error && !isGenerating && (
             <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
             </div>
        )}

        {/* IDE Layout (Sidebar + Main) */}
        {projectData && !isGenerating && (
          <>
            {/* Sidebar */}
            <aside className="w-64 md:w-72 flex-none border-r border-gray-800 flex flex-col">
              <FileExplorer 
                files={fileTree} 
                selectedPath={selectedFile?.path || null}
                onSelectFile={handleSelectFileNode}
              />
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <button 
                    onClick={() => {
                        setProjectData(null);
                        setSelectedFile(null);
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs font-medium transition-colors"
                >
                    Create New Project
                </button>
              </div>
            </aside>

            {/* Main Editor */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-950">
              <CodeViewer file={selectedFile} />
            </main>
          </>
        )}
      </div>
    </div>
  );
}
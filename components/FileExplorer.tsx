import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileJson, FileText, ChevronRight, ChevronDown, File } from 'lucide-react';
import { FileNode } from '../types';
import { getLanguageFromPath } from '../utils/fileUtils';

interface FileExplorerProps {
  files: FileNode[];
  selectedPath: string | null;
  onSelectFile: (file: FileNode) => void;
}

const FileIcon: React.FC<{ name: string }> = ({ name }) => {
  const lang = getLanguageFromPath(name);
  if (lang === 'python') return <FileCode className="w-4 h-4 text-blue-400" />;
  if (lang === 'json') return <FileJson className="w-4 h-4 text-yellow-400" />;
  if (lang === 'markdown') return <FileText className="w-4 h-4 text-purple-400" />;
  return <File className="w-4 h-4 text-gray-400" />;
};

const FileTreeNode: React.FC<{
  node: FileNode;
  level: number;
  selectedPath: string | null;
  onSelectFile: (file: FileNode) => void;
}> = ({ node, level, selectedPath, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = node.path === selectedPath;

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none transition-colors ${
          isSelected 
            ? 'bg-blue-900/50 text-blue-200 border-l-2 border-blue-500' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="opacity-70">
            {node.type === 'directory' ? (
                isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
            ) : (
                <span className="w-3" /> 
            )}
        </span>
        
        {node.type === 'directory' ? (
          isOpen ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />
        ) : (
          <FileIcon name={node.name} />
        )}
        
        <span className="text-sm truncate font-medium">{node.name}</span>
      </div>

      {node.type === 'directory' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, selectedPath, onSelectFile }) => {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="p-3 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Explorer</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            level={0}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        ))}
        {files.length === 0 && (
            <div className="p-4 text-center text-gray-600 text-sm italic">
                No files generated yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
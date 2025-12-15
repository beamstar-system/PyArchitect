import { GeneratedFile, FileNode } from '../types';

export const buildFileTree = (files: GeneratedFile[]): FileNode[] => {
  const root: FileNode[] = [];

  files.forEach((file) => {
    const parts = file.path.split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');
      
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        const newNode: FileNode = {
          name: part,
          path: path,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
        };
        currentLevel.push(newNode);
        existingNode = newNode;
      }

      if (!isFile && existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  });

  // Sort: directories first, then files, both alphabetically
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
    nodes.forEach(node => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root);
  return root;
};

export const getLanguageFromPath = (path: string): string => {
  if (path.endsWith('.py')) return 'python';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.txt')) return 'text';
  if (path.endsWith('.html')) return 'html';
  if (path.endsWith('.css')) return 'css';
  if (path.endsWith('.js')) return 'javascript';
  if (path.endsWith('.yml') || path.endsWith('.yaml')) return 'yaml';
  return 'text';
};
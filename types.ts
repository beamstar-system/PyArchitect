export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ProjectStructure {
  projectName: string;
  description: string;
  files: GeneratedFile[];
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}
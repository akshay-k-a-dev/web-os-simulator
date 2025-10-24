export type FileType = 'file' | 'directory';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: Record<string, FileNode>;
  created: number;
  modified: number;
  size: number;
}

export interface WindowState {
  id: string;
  appType: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  data?: any;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: any;
  component: any;
}

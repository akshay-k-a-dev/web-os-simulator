import { FileNode, FileType } from './types';

export class FileSystem {
  private root: FileNode;

  constructor(savedRoot?: FileNode) {
    if (savedRoot) {
      this.root = savedRoot;
    } else {
      this.root = this.createInitialFileSystem();
    }
  }

  private createInitialFileSystem(): FileNode {
    const now = Date.now();
    return {
      id: 'root',
      name: '/',
      type: 'directory',
      created: now,
      modified: now,
      size: 0,
      children: {
        home: {
          id: 'home',
          name: 'home',
          type: 'directory',
          created: now,
          modified: now,
          size: 0,
          children: {
            user: {
              id: 'user',
              name: 'user',
              type: 'directory',
              created: now,
              modified: now,
              size: 0,
              children: {
                Documents: {
                  id: 'documents',
                  name: 'Documents',
                  type: 'directory',
                  created: now,
                  modified: now,
                  size: 0,
                  children: {
                    'welcome.txt': {
                      id: 'welcome-txt',
                      name: 'welcome.txt',
                      type: 'file',
                      content: 'Welcome to WebOS!\n\nThis is a fully functional Linux-like desktop environment running in your browser.\n\nTry opening the terminal and running commands like:\n- ls\n- pwd\n- cat welcome.txt\n- mkdir test\n\nEverything persists between sessions!',
                      created: now,
                      modified: now,
                      size: 200,
                    },
                  },
                },
                Downloads: {
                  id: 'downloads',
                  name: 'Downloads',
                  type: 'directory',
                  created: now,
                  modified: now,
                  size: 0,
                  children: {},
                },
                Pictures: {
                  id: 'pictures',
                  name: 'Pictures',
                  type: 'directory',
                  created: now,
                  modified: now,
                  size: 0,
                  children: {},
                },
              },
            },
          },
        },
      },
    };
  }

  getRoot(): FileNode {
    return this.root;
  }

  resolvePath(path: string): FileNode | null {
    if (path === '/' || path === '') {
      return this.root;
    }

    const parts = path.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }

    return current;
  }

  createFile(path: string, name: string, content: string = ''): boolean {
    const parent = this.resolvePath(path);
    if (!parent || parent.type !== 'directory') {
      return false;
    }

    if (!parent.children) {
      parent.children = {};
    }

    if (parent.children[name]) {
      return false;
    }

    const now = Date.now();
    parent.children[name] = {
      id: `${parent.id}-${name}`,
      name,
      type: 'file',
      content,
      created: now,
      modified: now,
      size: content.length,
    };

    parent.modified = now;
    return true;
  }

  createDirectory(path: string, name: string): boolean {
    const parent = this.resolvePath(path);
    if (!parent || parent.type !== 'directory') {
      return false;
    }

    if (!parent.children) {
      parent.children = {};
    }

    if (parent.children[name]) {
      return false;
    }

    const now = Date.now();
    parent.children[name] = {
      id: `${parent.id}-${name}`,
      name,
      type: 'directory',
      created: now,
      modified: now,
      size: 0,
      children: {},
    };

    parent.modified = now;
    return true;
  }

  deleteNode(path: string, name: string): boolean {
    const parent = this.resolvePath(path);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      return false;
    }

    if (!parent.children[name]) {
      return false;
    }

    delete parent.children[name];
    parent.modified = Date.now();
    return true;
  }

  writeFile(path: string, content: string): boolean {
    const file = this.resolvePath(path);
    if (!file || file.type !== 'file') {
      return false;
    }

    file.content = content;
    file.size = content.length;
    file.modified = Date.now();
    return true;
  }

  readFile(path: string): string | null {
    const file = this.resolvePath(path);
    if (!file || file.type !== 'file') {
      return null;
    }
    return file.content || '';
  }

  listDirectory(path: string): FileNode[] | null {
    const dir = this.resolvePath(path);
    if (!dir || dir.type !== 'directory') {
      return null;
    }

    if (!dir.children) {
      return [];
    }

    return Object.values(dir.children);
  }

  renameNode(path: string, oldName: string, newName: string): boolean {
    const parent = this.resolvePath(path);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      return false;
    }

    if (!parent.children[oldName] || parent.children[newName]) {
      return false;
    }

    const node = parent.children[oldName];
    node.name = newName;
    parent.children[newName] = node;
    delete parent.children[oldName];
    parent.modified = Date.now();
    return true;
  }

  copyNode(sourcePath: string, destPath: string, name: string): boolean {
    const source = this.resolvePath(sourcePath);
    const dest = this.resolvePath(destPath);

    if (!source || !dest || dest.type !== 'directory') {
      return false;
    }

    if (!dest.children) {
      dest.children = {};
    }

    const deepCopy = (node: FileNode): FileNode => {
      const now = Date.now();
      const copy: FileNode = {
        ...node,
        id: `${dest.id}-${name}-${now}`,
        name,
        created: now,
        modified: now,
      };

      if (node.children) {
        copy.children = {};
        for (const [key, child] of Object.entries(node.children)) {
          copy.children[key] = deepCopy(child);
        }
      }

      return copy;
    };

    dest.children[name] = deepCopy(source);
    dest.modified = Date.now();
    return true;
  }

  moveNode(sourcePath: string, sourceParentPath: string, destPath: string, name: string): boolean {
    if (this.copyNode(sourcePath, destPath, name)) {
      const parts = sourcePath.split('/').filter(Boolean);
      const oldName = parts.pop();
      if (oldName) {
        return this.deleteNode(sourceParentPath, oldName);
      }
    }
    return false;
  }

  getPathParts(path: string): string[] {
    return path.split('/').filter(Boolean);
  }

  joinPath(...parts: string[]): string {
    const filtered = parts.filter(Boolean);
    if (filtered.length === 0) return '/';
    return '/' + filtered.join('/');
  }

  getParentPath(path: string): string {
    if (path === '/' || path === '') return '/';
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return parts.length === 0 ? '/' : '/' + parts.join('/');
  }

  getFileName(path: string): string {
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || '/';
  }
}

export const createFileSystem = (savedRoot?: FileNode) => new FileSystem(savedRoot);

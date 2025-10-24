import { FileSystem } from './fileSystem';

export interface CommandResult {
  output: string;
  error?: boolean;
}

export class TerminalCommands {
  private fs: FileSystem;
  private currentPath: string;
  private history: string[] = [];
  private env: Record<string, string> = {
    USER: 'user',
    HOME: '/home/user',
    HOSTNAME: 'webos',
  };

  constructor(fs: FileSystem, initialPath: string = '/home/user') {
    this.fs = fs;
    this.currentPath = initialPath;
  }

  setPath(path: string) {
    this.currentPath = path;
  }

  getPath(): string {
    return this.currentPath;
  }

  getHistory(): string[] {
    return this.history;
  }

  execute(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { output: '' };
    }

    this.history.push(trimmed);

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'ls':
        return this.ls(args);
      case 'cd':
        return this.cd(args);
      case 'pwd':
        return this.pwd();
      case 'cat':
        return this.cat(args);
      case 'echo':
        return this.echo(args);
      case 'mkdir':
        return this.mkdir(args);
      case 'touch':
        return this.touch(args);
      case 'rm':
        return this.rm(args);
      case 'clear':
        return { output: 'CLEAR' };
      case 'help':
        return this.help();
      case 'whoami':
        return { output: this.env.USER };
      case 'hostname':
        return { output: this.env.HOSTNAME };
      case 'date':
        return { output: new Date().toString() };
      case 'history':
        return { output: this.history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n') };
      default:
        return { output: `Command not found: ${command}. Type 'help' for available commands.`, error: true };
    }
  }

  private resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }
    if (path === '~') {
      return this.env.HOME;
    }
    if (path.startsWith('~/')) {
      return this.env.HOME + path.slice(1);
    }
    if (path === '..') {
      return this.fs.getParentPath(this.currentPath);
    }
    if (path === '.') {
      return this.currentPath;
    }
    return this.fs.joinPath(this.currentPath, path);
  }

  private ls(args: string[]): CommandResult {
    const path = args.length > 0 ? this.resolvePath(args[0]) : this.currentPath;
    const items = this.fs.listDirectory(path);

    if (items === null) {
      return { output: `ls: cannot access '${args[0] || '.'}': No such file or directory`, error: true };
    }

    if (items.length === 0) {
      return { output: '' };
    }

    const output = items
      .sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (a.type !== 'directory' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      })
      .map((item) => (item.type === 'directory' ? item.name + '/' : item.name))
      .join('  ');

    return { output };
  }

  private cd(args: string[]): CommandResult {
    if (args.length === 0) {
      this.currentPath = this.env.HOME;
      return { output: '' };
    }

    const targetPath = this.resolvePath(args[0]);
    const target = this.fs.resolvePath(targetPath);

    if (!target) {
      return { output: `cd: ${args[0]}: No such file or directory`, error: true };
    }

    if (target.type !== 'directory') {
      return { output: `cd: ${args[0]}: Not a directory`, error: true };
    }

    this.currentPath = targetPath;
    return { output: '' };
  }

  private pwd(): CommandResult {
    return { output: this.currentPath };
  }

  private cat(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'cat: missing file operand', error: true };
    }

    const path = this.resolvePath(args[0]);
    const content = this.fs.readFile(path);

    if (content === null) {
      return { output: `cat: ${args[0]}: No such file or directory`, error: true };
    }

    return { output: content };
  }

  private echo(args: string[]): CommandResult {
    return { output: args.join(' ') };
  }

  private mkdir(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'mkdir: missing operand', error: true };
    }

    const name = args[0];
    const success = this.fs.createDirectory(this.currentPath, name);

    if (!success) {
      return { output: `mkdir: cannot create directory '${name}': File exists`, error: true };
    }

    return { output: '' };
  }

  private touch(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'touch: missing file operand', error: true };
    }

    const name = args[0];
    const success = this.fs.createFile(this.currentPath, name, '');

    if (!success) {
      return { output: `touch: cannot create file '${name}': File exists`, error: true };
    }

    return { output: '' };
  }

  private rm(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'rm: missing operand', error: true };
    }

    const name = args[0];
    const success = this.fs.deleteNode(this.currentPath, name);

    if (!success) {
      return { output: `rm: cannot remove '${name}': No such file or directory`, error: true };
    }

    return { output: '' };
  }

  private help(): CommandResult {
    const commands = [
      'Available commands:',
      '',
      'File System:',
      '  ls [path]       - list directory contents',
      '  cd [path]       - change directory',
      '  pwd             - print working directory',
      '  cat <file>      - display file contents',
      '  mkdir <name>    - create directory',
      '  touch <name>    - create empty file',
      '  rm <name>       - remove file or directory',
      '',
      'Utilities:',
      '  echo <text>     - display text',
      '  clear           - clear terminal',
      '  date            - show current date/time',
      '  whoami          - print current user',
      '  hostname        - print hostname',
      '  history         - show command history',
      '  help            - show this help',
    ];

    return { output: commands.join('\n') };
  }
}

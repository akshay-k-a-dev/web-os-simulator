import React, { useState, useRef, useEffect } from 'react';
import { useDesktop } from '@/lib/DesktopContext';
import { TerminalCommands } from '@/lib/terminalCommands';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export const Terminal: React.FC = () => {
  const { fileSystem, currentPath, setCurrentPath } = useDesktop();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to WebOS Terminal' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<TerminalCommands>(new TerminalCommands(fileSystem, currentPath));

  useEffect(() => {
    terminalRef.current.setPath(currentPath);
  }, [currentPath]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    setLines((prev) => [...prev, { type: 'command', content: `${currentPath} $ ${cmd}` }]);

    const result = terminalRef.current.execute(cmd);

    if (result.output === 'CLEAR') {
      setLines([]);
    } else if (result.output) {
      setLines((prev) => [
        ...prev,
        { type: result.error ? 'error' : 'output', content: result.output },
      ]);
    }

    const newPath = terminalRef.current.getPath();
    if (newPath !== currentPath) {
      setCurrentPath(newPath);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const history = terminalRef.current.getHistory();

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400" onClick={() => inputRef.current?.focus()}>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="terminal-font text-sm space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'command'
                  ? 'text-cyan-400 font-medium'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : 'text-green-400'
              }
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-green-900">
        <span className="terminal-font text-sm text-cyan-400">{currentPath} $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none terminal-font text-sm text-green-400"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
};

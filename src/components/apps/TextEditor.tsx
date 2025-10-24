import React, { useState, useEffect } from 'react';
import { useDesktop } from '@/lib/DesktopContext';
import { Button } from '@/components/ui/button';
import { FloppyDisk, MagnifyingGlass } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TextEditorProps {
  filePath: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({ filePath }) => {
  const { fileSystem, saveFileSystem } = useDesktop();
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const fileContent = fileSystem.readFile(filePath);
    if (fileContent !== null) {
      setContent(fileContent);
      setSaved(true);
    }
  }, [filePath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const handleSave = () => {
    if (fileSystem.writeFile(filePath, content)) {
      saveFileSystem();
      setSaved(true);
      toast.success('File saved successfully');
    } else {
      toast.error('Failed to save file');
    }
  };

  const handleChange = (newContent: string) => {
    setContent(newContent);
    setSaved(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b bg-secondary">
        <Button size="sm" variant={saved ? 'ghost' : 'default'} onClick={handleSave}>
          <FloppyDisk className="h-4 w-4 mr-2" />
          Save {!saved && '*'}
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {content.length} characters | {content.split('\n').length} lines
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-full p-4 bg-background text-foreground font-mono text-sm resize-none outline-none"
          spellCheck={false}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

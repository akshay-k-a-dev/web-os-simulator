import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, ArrowClockwise, House } from '@phosphor-icons/react';
import { toast } from 'sonner';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://wikipedia.org');
  const [currentUrl, setCurrentUrl] = useState('https://wikipedia.org');
  const [history, setHistory] = useState<string[]>(['https://wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = (newUrl: string) => {
    try {
      const urlObj = new URL(newUrl.startsWith('http') ? newUrl : `https://${newUrl}`);
      const finalUrl = urlObj.toString();
      
      setCurrentUrl(finalUrl);
      setUrl(finalUrl);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), finalUrl]);
      setHistoryIndex((i) => i + 1);
      setLoading(true);
      
      setTimeout(() => setLoading(false), 1000);
    } catch (e) {
      toast.error('Invalid URL');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(url);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setCurrentUrl(newUrl);
      setUrl(newUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const newUrl = history[newIndex];
      setCurrentUrl(newUrl);
      setUrl(newUrl);
    }
  };

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const goHome = () => {
    navigate('https://wikipedia.org');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b bg-secondary">
        <Button size="sm" variant="ghost" onClick={goBack} disabled={historyIndex === 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={refresh}>
          <ArrowClockwise className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={goHome}>
          <House className="h-4 w-4" />
        </Button>
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            placeholder="Enter URL..."
          />
          <Button size="sm" type="submit">
            Go
          </Button>
        </form>
      </div>
      <div className="flex-1 relative bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
        <iframe
          src={currentUrl}
          className="w-full h-full border-none"
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

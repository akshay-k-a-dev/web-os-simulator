import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minus, ArrowsOut, ArrowsIn } from '@phosphor-icons/react';
import { WindowState } from '@/lib/types';
import { useDesktop } from '@/lib/DesktopContext';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window, children }) => {
  const { removeWindow, updateWindow, focusWindow, minimizeWindow, maximizeWindow } = useDesktop();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) {
      return;
    }

    focusWindow(window.id);
    
    if (window.maximized) {
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 200));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));

      updateWindow(window.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, updateWindow, window.id, window.x, window.y]);

  if (window.minimized) {
    return null;
  }

  const style: React.CSSProperties = window.maximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: '48px',
        width: '100%',
        height: 'calc(100vh - 48px)',
        zIndex: window.zIndex,
      }
    : {
        position: 'fixed',
        top: window.y,
        left: window.x,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
      };

  return (
    <Card
      ref={windowRef}
      className="flex flex-col overflow-hidden shadow-xl"
      style={style}
      onMouseDown={() => focusWindow(window.id)}
    >
      <div
        className="flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium">{window.title}</span>
        <div className="flex gap-2 window-controls">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-primary-foreground/20"
            onClick={() => minimizeWindow(window.id)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-primary-foreground/20"
            onClick={() => maximizeWindow(window.id)}
          >
            {window.maximized ? (
              <ArrowsIn className="h-4 w-4" />
            ) : (
              <ArrowsOut className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-destructive"
            onClick={() => removeWindow(window.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-card">
        {children}
      </div>
    </Card>
  );
};

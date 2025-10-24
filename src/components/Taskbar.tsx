import React, { useState, useEffect } from 'react';
import { useDesktop } from '@/lib/DesktopContext';
import { Button } from '@/components/ui/button';
import {
  Terminal as TerminalIcon,
  Folder,
  FileText,
  Globe,
  MusicNote,
  Power,
} from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';

export const Taskbar: React.FC = () => {
  const { windows, addWindow, focusWindow, minimizeWindow } = useDesktop();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    {
      id: 'file-manager',
      name: 'Files',
      icon: Folder,
      component: 'file-manager',
      defaultSize: { width: 800, height: 600 },
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: TerminalIcon,
      component: 'terminal',
      defaultSize: { width: 700, height: 500 },
    },
    {
      id: 'text-editor',
      name: 'Text Editor',
      icon: FileText,
      component: 'text-editor',
      defaultSize: { width: 700, height: 500 },
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: Globe,
      component: 'browser',
      defaultSize: { width: 1000, height: 700 },
    },
    {
      id: 'media-player',
      name: 'Media',
      icon: MusicNote,
      component: 'media-player',
      defaultSize: { width: 600, height: 500 },
    },
  ];

  const launchApp = (app: typeof apps[0]) => {
    addWindow({
      appType: app.component,
      title: app.name,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: app.defaultSize.width,
      height: app.defaultSize.height,
      minimized: false,
      maximized: false,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-primary text-primary-foreground flex items-center px-3 gap-2 shadow-lg z-[9999]">
      <div className="flex gap-1">
        {apps.map((app) => {
          const Icon = app.icon;
          const isActive = windows.some((w) => w.appType === app.component && !w.minimized);
          return (
            <Button
              key={app.id}
              size="icon"
              variant={isActive ? 'secondary' : 'ghost'}
              className="h-9 w-9"
              onClick={() => launchApp(app)}
              title={app.name}
            >
              <Icon className="h-5 w-5" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-8 bg-primary-foreground/20" />

      <div className="flex-1 flex gap-1 overflow-x-auto">
        {windows.map((window) => (
          <Button
            key={window.id}
            size="sm"
            variant={window.minimized ? 'ghost' : 'secondary'}
            className="h-8 px-3 text-xs max-w-[200px] truncate"
            onClick={() => {
              if (window.minimized) {
                minimizeWindow(window.id);
              }
              focusWindow(window.id);
            }}
          >
            {window.title}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8 bg-primary-foreground/20" />

      <div className="flex flex-col items-end text-xs">
        <div className="font-medium">{formatTime(time)}</div>
        <div className="text-primary-foreground/70">{formatDate(time)}</div>
      </div>

      <Button size="icon" variant="ghost" className="h-9 w-9" title="Power">
        <Power className="h-5 w-5" />
      </Button>
    </div>
  );
};

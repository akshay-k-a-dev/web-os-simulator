import { DesktopProvider, useDesktop } from '@/lib/DesktopContext';
import { Window } from '@/components/Window';
import { Taskbar } from '@/components/Taskbar';
import { Terminal } from '@/components/apps/Terminal';
import { FileManager } from '@/components/apps/FileManager';
import { TextEditor } from '@/components/apps/TextEditor';
import { Browser } from '@/components/apps/Browser';
import { MediaPlayer } from '@/components/apps/MediaPlayer';
import { Settings } from '@/components/apps/Settings';
import { Calculator } from '@/components/apps/Calculator';
import { Toaster } from '@/components/ui/sonner';
import { useKV } from '@github/spark/hooks';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Power } from '@phosphor-icons/react';

interface WallpaperSettings {
  type: 'gradient' | 'solid' | 'image';
  gradient?: {
    from: string;
    via?: string;
    to: string;
  };
  solid?: string;
  imageUrl?: string;
}

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
}

const Desktop = () => {
  const { windows, powerState, boot, wakeUp } = useDesktop();
  const [wallpaper] = useKV<WallpaperSettings>('desktop-wallpaper', {
    type: 'gradient',
    gradient: {
      from: '#eff6ff',
      via: '#e0e7ff',
      to: '#f3e8ff',
    },
  });
  const [themeColors] = useKV<ThemeColors>('theme-colors', {
    primary: 'oklch(0.35 0.05 250)',
    accent: 'oklch(0.55 0.18 250)',
    background: 'oklch(0.98 0.005 250)',
    foreground: 'oklch(0.2 0.01 250)',
  });

  useEffect(() => {
    if (themeColors) {
      document.documentElement.style.setProperty('--primary', themeColors.primary);
      document.documentElement.style.setProperty('--accent', themeColors.accent);
      document.documentElement.style.setProperty('--background', themeColors.background);
      document.documentElement.style.setProperty('--foreground', themeColors.foreground);
    }
  }, [themeColors]);

  useEffect(() => {
    if (powerState === 'sleeping') {
      const handleInteraction = () => {
        wakeUp();
      };
      
      window.addEventListener('mousemove', handleInteraction);
      window.addEventListener('mousedown', handleInteraction);
      window.addEventListener('keydown', handleInteraction);
      
      return () => {
        window.removeEventListener('mousemove', handleInteraction);
        window.removeEventListener('mousedown', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
      };
    }
  }, [powerState, wakeUp]);

  const getWallpaperStyle = (): React.CSSProperties => {
    if (!wallpaper) {
      return {
        background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
      };
    }

    if (wallpaper.type === 'gradient' && wallpaper.gradient) {
      return {
        background: `linear-gradient(to bottom right, ${wallpaper.gradient.from}, ${wallpaper.gradient.via || wallpaper.gradient.from}, ${wallpaper.gradient.to})`,
      };
    }

    if (wallpaper.type === 'solid' && wallpaper.solid) {
      return {
        backgroundColor: wallpaper.solid,
      };
    }

    if (wallpaper.type === 'image' && wallpaper.imageUrl) {
      return {
        backgroundImage: `url(${wallpaper.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    return {
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff, #f3e8ff)',
    };
  };

  const renderAppContent = (appType: string, data?: any) => {
    switch (appType) {
      case 'terminal':
        return <Terminal />;
      case 'file-manager':
        return <FileManager />;
      case 'text-editor':
        return <TextEditor filePath={data?.filePath || '/home/user/Documents/welcome.txt'} />;
      case 'browser':
        return <Browser />;
      case 'media-player':
        return <MediaPlayer />;
      case 'settings':
        return <Settings />;
      case 'calculator':
        return <Calculator />;
      default:
        return <div className="p-4">Unknown application</div>;
    }
  };

  if (powerState === 'booting') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-accent/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">WebOS</h2>
            <p className="text-muted-foreground text-sm">Starting up...</p>
          </div>
        </div>
      </div>
    );
  }

  if (powerState === 'shutdown') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            variant="default"
            className="h-16 w-16 rounded-full"
            onClick={boot}
          >
            <Power className="h-8 w-8" />
          </Button>
          <p className="text-muted-foreground text-sm">Click to start</p>
        </div>
      </div>
    );
  }

  if (powerState === 'sleeping') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-black cursor-pointer" />
    );
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden transition-all duration-500"
      style={getWallpaperStyle()}
    >
      {windows.map((window) => (
        <Window key={window.id} window={window}>
          {renderAppContent(window.appType, window.data)}
        </Window>
      ))}
      <Taskbar />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}

export default App;
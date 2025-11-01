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
import { useEffect } from 'react';

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
  const { windows } = useDesktop();
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
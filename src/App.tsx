import { DesktopProvider, useDesktop } from '@/lib/DesktopContext';
import { Window } from '@/components/Window';
import { Taskbar } from '@/components/Taskbar';
import { Terminal } from '@/components/apps/Terminal';
import { FileManager } from '@/components/apps/FileManager';
import { TextEditor } from '@/components/apps/TextEditor';
import { Browser } from '@/components/apps/Browser';
import { MediaPlayer } from '@/components/apps/MediaPlayer';
import { Toaster } from '@/components/ui/sonner';

const Desktop = () => {
  const { windows } = useDesktop();

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
      default:
        return <div className="p-4">Unknown application</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FileSystem, createFileSystem } from '@/lib/fileSystem';
import { WindowState, FileNode } from '@/lib/types';
import { useKV } from '@github/spark/hooks';

type PowerState = 'running' | 'shutdown' | 'sleeping' | 'booting';

interface DesktopContextType {
  fileSystem: FileSystem;
  saveFileSystem: () => void;
  windows: WindowState[];
  addWindow: (window: Omit<WindowState, 'id' | 'zIndex'>) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  powerState: PowerState;
  shutdown: () => void;
  restart: () => void;
  sleep: () => void;
  wakeUp: () => void;
  boot: () => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within DesktopProvider');
  }
  return context;
};

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fsRoot, setFsRoot] = useKV<FileNode | null>('filesystem-root', null);
  const [fileSystem] = useState(() => createFileSystem(fsRoot ?? undefined));
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [powerState, setPowerState] = useState<PowerState>('booting');

  const saveFileSystem = useCallback(() => {
    setFsRoot(() => fileSystem.getRoot());
  }, [fileSystem, setFsRoot]);

  useEffect(() => {
    const interval = setInterval(saveFileSystem, 5000);
    return () => clearInterval(interval);
  }, [saveFileSystem]);

  const addWindow = useCallback((windowData: Omit<WindowState, 'id' | 'zIndex'>) => {
    setWindows((prev) => {
      if (prev.length >= 10) {
        return prev;
      }
      
      const id = `window-${Date.now()}-${Math.random()}`;
      const newWindow: WindowState = {
        ...windowData,
        id,
        zIndex: nextZIndex,
      };
      
      setNextZIndex((z) => z + 1);
      return [...prev, newWindow];
    });
  }, [nextZIndex]);

  const removeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    saveFileSystem();
  }, [saveFileSystem]);

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (!window) return prev;

      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      if (window.zIndex === maxZ) return prev;

      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1, minimized: false } : w
      );
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  }, []);

  const shutdown = useCallback(() => {
    saveFileSystem();
    setWindows([]);
    setPowerState('shutdown');
  }, [saveFileSystem]);

  const restart = useCallback(() => {
    saveFileSystem();
    setWindows([]);
    setPowerState('shutdown');
    setTimeout(() => {
      setPowerState('booting');
      setTimeout(() => {
        setPowerState('running');
      }, 2000);
    }, 500);
  }, [saveFileSystem]);

  const sleep = useCallback(() => {
    setPowerState('sleeping');
  }, []);

  const wakeUp = useCallback(() => {
    setPowerState('running');
  }, []);

  const boot = useCallback(() => {
    setPowerState('booting');
    setTimeout(() => {
      setPowerState('running');
    }, 2000);
  }, []);

  useEffect(() => {
    boot();
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        fileSystem,
        saveFileSystem,
        windows,
        addWindow,
        removeWindow,
        updateWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        currentPath,
        setCurrentPath,
        powerState,
        shutdown,
        restart,
        sleep,
        wakeUp,
        boot,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

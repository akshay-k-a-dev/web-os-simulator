import React, { useState, useEffect } from 'react';
import { useDesktop } from '@/lib/DesktopContext';
import { FileNode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  ArrowLeft,
  House,
  Plus,
  Trash,
} from '@phosphor-icons/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export const FileManager: React.FC = () => {
  const { fileSystem, saveFileSystem, currentPath, setCurrentPath, addWindow } = useDesktop();
  const [items, setItems] = useState<FileNode[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    refreshItems();
  }, [currentPath]);

  const refreshItems = () => {
    const dirItems = fileSystem.listDirectory(currentPath);
    setItems(dirItems || []);
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const navigateUp = () => {
    const parent = fileSystem.getParentPath(currentPath);
    navigateToPath(parent);
  };

  const navigateHome = () => {
    navigateToPath('/home/user');
  };

  const handleDoubleClick = (item: FileNode) => {
    if (item.type === 'directory') {
      const newPath = fileSystem.joinPath(currentPath, item.name);
      navigateToPath(newPath);
    } else {
      openFile(item);
    }
  };

  const openFile = (item: FileNode) => {
    const filePath = fileSystem.joinPath(currentPath, item.name);
    addWindow({
      appType: 'text-editor',
      title: item.name,
      x: 100,
      y: 100,
      width: 700,
      height: 500,
      minimized: false,
      maximized: false,
      data: { filePath },
    });
  };

  const createNewFolder = () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    if (fileSystem.createDirectory(currentPath, name)) {
      refreshItems();
      saveFileSystem();
    } else {
      alert('Failed to create folder. Name may already exist.');
    }
  };

  const createNewFile = () => {
    const name = prompt('Enter file name:');
    if (!name) return;

    if (fileSystem.createFile(currentPath, name, '')) {
      refreshItems();
      saveFileSystem();
    } else {
      alert('Failed to create file. Name may already exist.');
    }
  };

  const deleteItem = (item: FileNode) => {
    if (!confirm(`Delete ${item.name}?`)) return;

    if (fileSystem.deleteNode(currentPath, item.name)) {
      refreshItems();
      saveFileSystem();
      setSelectedItem(null);
    }
  };

  const renameItem = (item: FileNode) => {
    const newName = prompt('Enter new name:', item.name);
    if (!newName || newName === item.name) return;

    if (fileSystem.renameNode(currentPath, item.name, newName)) {
      refreshItems();
      saveFileSystem();
    } else {
      alert('Failed to rename. Name may already exist.');
    }
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-3 border-b bg-secondary">
        <Button size="sm" variant="ghost" onClick={navigateUp} disabled={currentPath === '/'}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={navigateHome}>
          <House className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center gap-1 text-sm">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigateToPath('/')}
          >
            /
          </span>
          {pathParts.map((part, i) => {
            const path = '/' + pathParts.slice(0, i + 1).join('/');
            return (
              <React.Fragment key={i}>
                <span>/</span>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => navigateToPath(path)}
                >
                  {part}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <Button size="sm" variant="ghost" onClick={createNewFolder}>
          <Plus className="h-4 w-4 mr-1" />
          Folder
        </Button>
        <Button size="sm" variant="ghost" onClick={createNewFile}>
          <Plus className="h-4 w-4 mr-1" />
          File
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>This folder is empty</p>
              <p className="text-sm mt-2">Create a new file or folder to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {items.map((item) => (
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`flex flex-col items-center gap-2 p-3 rounded cursor-pointer hover:bg-accent/50 ${
                        selectedItem === item.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedItem(item.id)}
                      onDoubleClick={() => handleDoubleClick(item)}
                    >
                      {item.type === 'directory' ? (
                        <FolderOpen className="h-12 w-12 text-accent" />
                      ) : (
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      )}
                      <span className="text-sm text-center break-all">{item.name}</span>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {item.type === 'file' && (
                      <ContextMenuItem onClick={() => openFile(item)}>Open</ContextMenuItem>
                    )}
                    <ContextMenuItem onClick={() => renameItem(item)}>Rename</ContextMenuItem>
                    <ContextMenuItem onClick={() => deleteItem(item)} className="text-destructive">
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

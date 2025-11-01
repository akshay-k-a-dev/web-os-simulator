import React, { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Palette, 
  Image as ImageIcon, 
  Check,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
}

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

const defaultWallpaper: WallpaperSettings = {
  type: 'gradient',
  gradient: {
    from: '#eff6ff',
    via: '#e0e7ff',
    to: '#f3e8ff',
  },
};

const defaultTheme: ThemeColors = {
  primary: 'oklch(0.35 0.05 250)',
  accent: 'oklch(0.55 0.18 250)',
  background: 'oklch(0.98 0.005 250)',
  foreground: 'oklch(0.2 0.01 250)',
};

const presetGradients = [
  {
    name: 'Ocean Blue',
    from: '#eff6ff',
    via: '#e0e7ff',
    to: '#dbeafe',
  },
  {
    name: 'Sunset',
    from: '#fef3c7',
    via: '#fed7aa',
    to: '#fecaca',
  },
  {
    name: 'Forest',
    from: '#d1fae5',
    via: '#a7f3d0',
    to: '#86efac',
  },
  {
    name: 'Purple Dream',
    from: '#ede9fe',
    via: '#ddd6fe',
    to: '#f3e8ff',
  },
  {
    name: 'Coral',
    from: '#ffedd5',
    via: '#fed7aa',
    to: '#fecdd3',
  },
  {
    name: 'Arctic',
    from: '#f0f9ff',
    via: '#e0f2fe',
    to: '#dbeafe',
  },
  {
    name: 'Slate',
    from: '#f8fafc',
    via: '#f1f5f9',
    to: '#e2e8f0',
  },
  {
    name: 'Rose Gold',
    from: '#fff1f2',
    via: '#ffe4e6',
    to: '#fce7f3',
  },
];

const presetThemes = [
  {
    name: 'Default Blue',
    colors: {
      primary: 'oklch(0.35 0.05 250)',
      accent: 'oklch(0.55 0.18 250)',
      background: 'oklch(0.98 0.005 250)',
      foreground: 'oklch(0.2 0.01 250)',
    },
  },
  {
    name: 'Dark Ocean',
    colors: {
      primary: 'oklch(0.25 0.05 220)',
      accent: 'oklch(0.45 0.2 200)',
      background: 'oklch(0.96 0.01 220)',
      foreground: 'oklch(0.15 0.01 220)',
    },
  },
  {
    name: 'Warm Sunset',
    colors: {
      primary: 'oklch(0.4 0.15 30)',
      accent: 'oklch(0.6 0.2 50)',
      background: 'oklch(0.99 0.01 50)',
      foreground: 'oklch(0.25 0.02 30)',
    },
  },
  {
    name: 'Forest Green',
    colors: {
      primary: 'oklch(0.35 0.1 150)',
      accent: 'oklch(0.55 0.15 140)',
      background: 'oklch(0.98 0.005 150)',
      foreground: 'oklch(0.2 0.01 150)',
    },
  },
  {
    name: 'Royal Purple',
    colors: {
      primary: 'oklch(0.3 0.15 290)',
      accent: 'oklch(0.5 0.22 280)',
      background: 'oklch(0.97 0.01 290)',
      foreground: 'oklch(0.18 0.01 290)',
    },
  },
  {
    name: 'Charcoal',
    colors: {
      primary: 'oklch(0.3 0.01 250)',
      accent: 'oklch(0.45 0.1 250)',
      background: 'oklch(0.95 0.005 250)',
      foreground: 'oklch(0.15 0 0)',
    },
  },
];

export const Settings: React.FC = () => {
  const [wallpaper, setWallpaper] = useKV<WallpaperSettings>('desktop-wallpaper', defaultWallpaper);
  const [themeColors, setThemeColors] = useKV<ThemeColors>('theme-colors', defaultTheme);
  
  const [localWallpaper, setLocalWallpaper] = useState<WallpaperSettings>(wallpaper || defaultWallpaper);
  const [localTheme, setLocalTheme] = useState<ThemeColors>(themeColors || defaultTheme);

  useEffect(() => {
    if (wallpaper) {
      setLocalWallpaper(wallpaper);
    }
  }, [wallpaper]);

  useEffect(() => {
    if (themeColors) {
      setLocalTheme(themeColors);
    }
  }, [themeColors]);

  const applyWallpaper = () => {
    setWallpaper(() => localWallpaper);
    toast.success('Wallpaper applied successfully');
  };

  const applyTheme = () => {
    setThemeColors(() => localTheme);
    toast.success('Theme applied successfully');
  };

  const resetWallpaper = () => {
    setLocalWallpaper(defaultWallpaper);
    setWallpaper(() => defaultWallpaper);
    toast.success('Wallpaper reset to default');
  };

  const resetTheme = () => {
    setLocalTheme(defaultTheme);
    setThemeColors(() => defaultTheme);
    toast.success('Theme reset to default');
  };

  const hexToOklch = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    return `oklch(${l.toFixed(2)} 0.1 250)`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs defaultValue="wallpaper" className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallpaper" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Wallpaper
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="h-4 w-4" />
              Theme Colors
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="wallpaper" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Background Style</CardTitle>
                  <CardDescription>Choose how your desktop background looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={localWallpaper.type === 'gradient' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setLocalWallpaper({ ...localWallpaper, type: 'gradient' })}
                    >
                      Gradient
                    </Button>
                    <Button
                      variant={localWallpaper.type === 'solid' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setLocalWallpaper({ ...localWallpaper, type: 'solid' })}
                    >
                      Solid Color
                    </Button>
                  </div>

                  {localWallpaper.type === 'gradient' && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label>Gradient Colors</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="gradient-from" className="text-xs">From</Label>
                            <Input
                              id="gradient-from"
                              type="color"
                              value={localWallpaper.gradient?.from || '#eff6ff'}
                              onChange={(e) =>
                                setLocalWallpaper({
                                  ...localWallpaper,
                                  gradient: {
                                    ...localWallpaper.gradient!,
                                    from: e.target.value,
                                  },
                                })
                              }
                              className="h-10 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradient-via" className="text-xs">Via</Label>
                            <Input
                              id="gradient-via"
                              type="color"
                              value={localWallpaper.gradient?.via || '#e0e7ff'}
                              onChange={(e) =>
                                setLocalWallpaper({
                                  ...localWallpaper,
                                  gradient: {
                                    ...localWallpaper.gradient!,
                                    via: e.target.value,
                                  },
                                })
                              }
                              className="h-10 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gradient-to" className="text-xs">To</Label>
                            <Input
                              id="gradient-to"
                              type="color"
                              value={localWallpaper.gradient?.to || '#f3e8ff'}
                              onChange={(e) =>
                                setLocalWallpaper({
                                  ...localWallpaper,
                                  gradient: {
                                    ...localWallpaper.gradient!,
                                    to: e.target.value,
                                  },
                                })
                              }
                              className="h-10 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />
                      <div className="space-y-3">
                        <Label>Preset Gradients</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {presetGradients.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() =>
                                setLocalWallpaper({
                                  type: 'gradient',
                                  gradient: {
                                    from: preset.from,
                                    via: preset.via,
                                    to: preset.to,
                                  },
                                })
                              }
                              className="relative h-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors group"
                              style={{
                                background: `linear-gradient(to bottom right, ${preset.from}, ${preset.via}, ${preset.to})`,
                              }}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                                {preset.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {localWallpaper.type === 'solid' && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <Label htmlFor="solid-color">Background Color</Label>
                        <Input
                          id="solid-color"
                          type="color"
                          value={localWallpaper.solid || '#eff6ff'}
                          onChange={(e) =>
                            setLocalWallpaper({
                              ...localWallpaper,
                              solid: e.target.value,
                            })
                          }
                          className="h-20 cursor-pointer"
                        />
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex gap-2">
                    <Button onClick={applyWallpaper} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Apply Wallpaper
                    </Button>
                    <Button onClick={resetWallpaper} variant="outline">
                      <ArrowCounterClockwise className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Colors</CardTitle>
                  <CardDescription>Customize the interface colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Preset Themes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {presetThemes.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setLocalTheme(preset.colors)}
                          className="relative h-16 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors group"
                        >
                          <div className="flex h-full">
                            <div
                              className="flex-1"
                              style={{ background: preset.colors.primary }}
                            />
                            <div
                              className="flex-1"
                              style={{ background: preset.colors.accent }}
                            />
                            <div
                              className="flex-1"
                              style={{ background: preset.colors.background }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-primary">Primary Color</Label>
                      <div className="text-xs text-muted-foreground mb-1">
                        Main brand color for taskbar and buttons
                      </div>
                      <Input
                        id="theme-primary"
                        type="text"
                        value={localTheme.primary}
                        onChange={(e) =>
                          setLocalTheme({ ...localTheme, primary: e.target.value })
                        }
                        placeholder="oklch(0.35 0.05 250)"
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme-accent">Accent Color</Label>
                      <div className="text-xs text-muted-foreground mb-1">
                        Highlight color for active elements
                      </div>
                      <Input
                        id="theme-accent"
                        type="text"
                        value={localTheme.accent}
                        onChange={(e) =>
                          setLocalTheme({ ...localTheme, accent: e.target.value })
                        }
                        placeholder="oklch(0.55 0.18 250)"
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme-background">Background Color</Label>
                      <div className="text-xs text-muted-foreground mb-1">
                        Main window background
                      </div>
                      <Input
                        id="theme-background"
                        type="text"
                        value={localTheme.background}
                        onChange={(e) =>
                          setLocalTheme({ ...localTheme, background: e.target.value })
                        }
                        placeholder="oklch(0.98 0.005 250)"
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme-foreground">Foreground Color</Label>
                      <div className="text-xs text-muted-foreground mb-1">
                        Main text color
                      </div>
                      <Input
                        id="theme-foreground"
                        type="text"
                        value={localTheme.foreground}
                        onChange={(e) =>
                          setLocalTheme({ ...localTheme, foreground: e.target.value })
                        }
                        placeholder="oklch(0.2 0.01 250)"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex gap-2">
                    <Button onClick={applyTheme} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Apply Theme
                    </Button>
                    <Button onClick={resetTheme} variant="outline">
                      <ArrowCounterClockwise className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

# Planning Guide

A browser-based lightweight Linux desktop environment that provides a fully functional OS-like experience with persistent storage, window management, and real working applications including terminal, file manager, text editor, browser, and media player.

**Experience Qualities**:
1. **Familiar** - Should feel like using a real Linux desktop environment with intuitive interactions that Linux users will recognize immediately
2. **Responsive** - Every interaction must feel instant and fluid, windows should drag smoothly, commands should execute quickly
3. **Polished** - Professional finish with attention to detail in animations, typography, and micro-interactions that make it feel like production software

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - This is a full desktop environment simulator with multiple interconnected applications, window management system, virtual file system with persistence, working terminal with command execution, and state management across all components.

## Essential Features

### Window Manager
- **Functionality**: Draggable, resizable windows with minimize/maximize/close controls, z-index management, window snapping
- **Purpose**: Core interaction model that makes the desktop feel like a real OS
- **Trigger**: Clicking application icons in taskbar or dock
- **Progression**: Click app icon → Window animates open → User can drag title bar to move → Resize from corners/edges → Minimize to taskbar → Maximize to fullscreen → Close to destroy
- **Success criteria**: Multiple windows can be open simultaneously, no z-index conflicts, smooth 60fps dragging/resizing, windows stay within viewport bounds

### Virtual File System
- **Functionality**: Hierarchical directory structure with CRUD operations, file metadata (size, dates, type), persistence via KV store
- **Purpose**: Foundation for all file-based operations across apps
- **Trigger**: System initialization, file operations from any app
- **Progression**: Initialize with home directory structure → Apps create/read/write/delete files → Changes persist → Survives page refresh
- **Success criteria**: File operations are instant, data persists across sessions, supports text files and metadata, hierarchical navigation works

### File Manager (Explorer)
- **Functionality**: Browse directories, create folders/files, delete, rename, copy/paste, drag-drop, file preview
- **Purpose**: Primary interface for file system navigation and management
- **Trigger**: Clicking file manager icon
- **Progression**: Open window → Display current directory → Navigate folders via double-click → Right-click context menus → Create/delete/rename operations → Updates reflect immediately
- **Success criteria**: Feels like Nautilus/Dolphin, keyboard shortcuts work (Ctrl+C/V, Delete, F2), breadcrumb navigation, grid and list views

### Terminal Emulator
- **Functionality**: Command prompt with working implementations of: ls, cd, pwd, cat, echo, mkdir, rm, touch, clear, help, cp, mv, grep, find, whoami, date, hostname, history
- **Purpose**: Authentic Linux experience and power-user functionality
- **Trigger**: Clicking terminal icon
- **Progression**: Open window → Display prompt → Type command → Press Enter → Execute JS implementation → Display output → Accept next command
- **Success criteria**: Commands manipulate real virtual file system, command history with up/down arrows, tab completion for files, output formatting matches real terminal, supports pipes and redirection basics

### Text Editor
- **Functionality**: Open/edit/save text files, syntax awareness, find/replace, multiple tabs
- **Purpose**: Essential productivity tool for text file editing
- **Trigger**: Double-clicking text file or opening from menu
- **Progression**: Open file → Display content in editable area → Make changes → Ctrl+S to save → Reflects in file system → Can open multiple files in tabs
- **Success criteria**: No data loss, autosave draft state, keyboard shortcuts (Ctrl+S, Ctrl+F, Ctrl+Z/Y), line numbers, feels like nano/gedit

### Web Browser
- **Functionality**: URL bar, iframe-based page loading for allowed domains, navigation controls (back/forward/refresh), simple bookmark system
- **Purpose**: Internet access within the desktop environment
- **Trigger**: Clicking browser icon
- **Progression**: Open window → Enter URL → Load in iframe → Navigate pages → Bookmark favorites → History tracking
- **Success criteria**: Handles external sites safely, bookmark management works, history is accessible, loading states are clear

### Media Player
- **Functionality**: Play audio/video files, basic controls (play/pause/seek/volume), playlist support
- **Purpose**: Multimedia capability demonstration
- **Trigger**: Double-clicking media file or opening from menu
- **Progression**: Select media file → Open in player → Display controls → Play/pause/seek → Queue additional files
- **Success criteria**: Supports common formats browser can handle, smooth playback, visual feedback, keyboard controls (space to pause)

### Taskbar & System Tray
- **Functionality**: App launcher, open window indicators, clock, system status
- **Purpose**: Primary navigation and system awareness
- **Trigger**: Always visible at bottom of screen
- **Progression**: View running apps → Click to focus/minimize windows → Check time → Access system menu
- **Success criteria**: Always accessible, shows accurate state, smooth animations on interactions

### Settings Panel
- **Functionality**: Customize desktop wallpaper (gradient/solid color presets and custom colors), modify theme colors (primary, accent, background, foreground), real-time preview, persist preferences
- **Purpose**: Personalization and customization of the desktop environment
- **Trigger**: Clicking settings icon in taskbar
- **Progression**: Open settings window → Choose wallpaper tab or theme tab → Select preset or customize colors → Preview changes → Apply to desktop → Settings persist across sessions
- **Success criteria**: Changes apply immediately and smoothly, presets are visually appealing, custom color inputs support OKLCH format, all preferences persist via KV storage

## Edge Case Handling

- **Empty State**: File manager shows helpful "Create your first file" message when directories are empty
- **Maximum Windows**: Prevent more than 10 simultaneous windows to maintain performance
- **Invalid Commands**: Terminal shows helpful error messages with command suggestions
- **File Conflicts**: Prompt user when overwriting files or creating duplicates
- **Window Boundaries**: Prevent dragging windows completely offscreen, snap back to visible area
- **Corrupted Data**: Gracefully handle malformed KV data with factory reset option
- **Long Operations**: Show loading indicators for file operations that take >100ms
- **Keyboard Focus**: Proper focus management when switching between windows

## Design Direction

The design should evoke modern Linux desktop environments (GNOME 40+ aesthetic) - clean, minimal, professional with purposeful use of space and subtle depth. It should feel cutting-edge and polished with generous whitespace, crisp typography, and smooth animations. Minimal interface approach where chrome disappears when not needed, content-first design that feels both powerful and approachable.

## Color Selection

Custom palette inspired by modern Linux themes (GNOME/Elementary OS)

- **Primary Color**: Deep blue-grey `oklch(0.35 0.05 250)` - Professional, technical, calming presence for title bars and active states
- **Secondary Colors**: Light neutral grey `oklch(0.95 0.01 250)` for window backgrounds and surfaces, Medium grey `oklch(0.65 0.02 250)` for inactive elements
- **Accent Color**: Vibrant blue `oklch(0.55 0.18 250)` - Energetic highlight for buttons, links, selections, and active indicators
- **Foreground/Background Pairings**:
  - Background (White #FAFAFA): Dark text `oklch(0.2 0.01 250)` - Ratio 14.5:1 ✓
  - Card (Light grey): Dark text `oklch(0.2 0.01 250)` - Ratio 13.8:1 ✓
  - Primary (Deep blue-grey): White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Secondary (Light grey): Dark text `oklch(0.2 0.01 250)` - Ratio 13.5:1 ✓
  - Accent (Vibrant blue): White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓
  - Muted (Soft grey): Dark muted text `oklch(0.45 0.01 250)` - Ratio 4.8:1 ✓

## Font Selection

Typefaces should convey technical precision and readability - use system fonts that feel native to Linux environments: Ubuntu for UI (friendly but professional) and JetBrains Mono for terminal/code (technical excellence).

- **Typographic Hierarchy**:
  - H1 (Window Titles): Ubuntu Medium/14px/normal letter spacing
  - H2 (Section Headers): Ubuntu Regular/13px/normal letter spacing  
  - Body (UI Text): Ubuntu Regular/12px/normal letter spacing
  - Small (Status): Ubuntu Regular/11px/normal letter spacing
  - Code (Terminal): JetBrains Mono Regular/13px/normal letter spacing

## Animations

Animations should feel like a professional OS - subtle, purposeful, never gratuitous. They orient users during state changes and provide feedback without delay. Balance between functional smoothness (window opening/closing, dragging) and delightful micro-interactions (hover states, button presses).

- **Purposeful Meaning**: Window animations communicate spatial relationships (minimize slides to taskbar, maximize expands from current position), loading states show progress, hover effects indicate interactivity
- **Hierarchy of Movement**: Window operations (300ms) are slower than button clicks (150ms), critical user actions get immediate feedback while system updates can animate more leisurely

## Component Selection

- **Components**: Dialog for modals, Card for windows/panels, Button for all actions, Input for text fields, Tabs for multi-document interfaces, ContextMenu for right-click actions, ScrollArea for content areas, Separator for visual division, Tooltip for icon explanations, Popover for quick settings
- **Customizations**: Custom Window component wrapping Card with draggable header, custom Terminal component with command parsing, custom FileTree component for hierarchical navigation
- **States**: Buttons show hover (subtle bg change), active (slight scale down), focus (ring), disabled (opacity 50%); Inputs show focus ring in accent color; Windows show active state with brighter title bar
- **Icon Selection**: Phosphor icons throughout - Folder/FolderOpen for directories, File/FileText for documents, Terminal for console, Browser for web, PlayCircle for media, X/Minus/ArrowsOut for window controls, MagnifyingGlass for search
- **Spacing**: Consistent 4px base unit - window padding 16px (4×4), button padding 8px/12px (2×4/3×4), gaps between elements 8px or 12px, taskbar height 48px (12×4)
- **Mobile**: Apps stack vertically on mobile, windows become full-screen modals, taskbar switches to top with hamburger menu, terminal gets mobile-optimized keyboard, file manager switches to list view only, touch-friendly 44px minimum hit areas

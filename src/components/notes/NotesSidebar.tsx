"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types matching Prisma schema
interface Folder {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  parentId?: string | null;
  children?: Folder[];
  notes?: Note[];
  order: number;
}

interface Note {
  id: string;
  title: string;
  icon?: string | null;
  folderId?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  order: number;
  updatedAt: Date;
}

interface NotesSidebarProps {
  folders: Folder[];
  notes: Note[];
  currentNoteId?: string;
  onSelectNote: (noteId: string) => void;
  onCreatePage: (folderId?: string) => void;
  onCreateFolder: () => void;
  onSearchOpen: () => void;
  onLogout: () => void;
  userName?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function NotesSidebar({
  folders,
  notes,
  currentNoteId,
  onSelectNote,
  onCreatePage,
  onCreateFolder,
  onSearchOpen,
  onLogout,
  userName = "User",
  collapsed = false,
  onToggleCollapse,
}: NotesSidebarProps) {
  const [width, setWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["favorites", "folders", "unfiled", "archive"])
  );

  const minWidth = 200;
  const maxWidth = 480;

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Attach resize listeners
  if (typeof window !== "undefined") {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }

  // Organize data
  const favoriteNotes = notes.filter((n) => n.isFavorite && !n.isArchived);
  const archivedNotes = notes.filter((n) => n.isArchived);
  const unfiledNotes = notes.filter((n) => !n.folderId && !n.isArchived && !n.isFavorite);

  // Build folder tree
  const buildFolderTree = (parentId: string | null = null): Folder[] => {
    return folders
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((folder) => ({
        ...folder,
        children: buildFolderTree(folder.id),
        notes: notes
          .filter((n) => n.folderId === folder.id && !n.isArchived)
          .sort((a, b) => a.order - b.order),
      }));
  };

  const folderTree = buildFolderTree();

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = (folder.children && folder.children.length > 0) || (folder.notes && folder.notes.length > 0);

    return (
      <div key={folder.id}>
        <button
          onClick={() => toggleFolder(folder.id)}
          className="w-full flex items-center gap-2 px-3 py-1.5 type-ui text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {hasChildren && (
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-[var(--text-muted)] text-xs"
            >
              ▶
            </motion.span>
          )}
          {!hasChildren && <span className="w-3" />}
          <span>{folder.icon || "📁"}</span>
          <span className="flex-1 text-left truncate">{folder.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreatePage(folder.id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-[var(--accent)] transition-opacity"
            title="New page in folder"
          >
            +
          </button>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {folder.notes && folder.notes.map((note) => renderNote(note, depth + 1))}
              {folder.children && folder.children.map((child) => renderFolder(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderNote = (note: Note, depth: number = 0) => {
    const isActive = note.id === currentNoteId;

    return (
      <button
        key={note.id}
        onClick={() => onSelectNote(note.id)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 type-ui rounded transition-colors ${
          isActive
            ? "bg-[var(--accent-muted)] text-[var(--accent)]"
            : "text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span>{note.icon || "📄"}</span>
        <span className="flex-1 text-left truncate">{note.title || "Untitled"}</span>
      </button>
    );
  };

  const renderSection = (
    title: string,
    key: string,
    items: Note[] | Folder[],
    renderItem: (item: any) => React.ReactNode
  ) => {
    const isExpanded = expandedSections.has(key);
    const isEmpty = items.length === 0;

    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center gap-2 px-3 py-1.5 type-metadata text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-xs"
          >
            ▶
          </motion.span>
          <span>{title}</span>
          <span className="text-[var(--text-faint)]">({items.length})</span>
        </button>

        <AnimatePresence>
          {isExpanded && !isEmpty && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {items.map(renderItem)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      className="relative flex h-screen bg-[var(--bg-primary)] border-r border-[var(--border-subtle)]"
      style={{ width: `${width}px` }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* User section */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="type-ui font-medium text-[var(--text-main)] truncate">{userName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-[var(--bg-secondary)] rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"
              title="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-3 space-y-2 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => onCreatePage()}
            className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--accent)] text-white type-ui font-medium rounded hover:opacity-90 transition-opacity"
          >
            <span>+</span>
            <span>New Page</span>
          </button>
          <button
            onClick={onSearchOpen}
            className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] text-[var(--text-main)] type-ui rounded hover:bg-[var(--border-subtle)] transition-colors"
          >
            <span>🔍</span>
            <span>Search</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-3">
          {/* Favorites */}
          {favoriteNotes.length > 0 &&
            renderSection("Favorites", "favorites", favoriteNotes, (note) => renderNote(note, 0))}

          {/* Folders */}
          {renderSection("Folders", "folders", folderTree, (folder) => renderFolder(folder, 0))}

          {/* Unfiled */}
          {unfiledNotes.length > 0 &&
            renderSection("Unfiled", "unfiled", unfiledNotes, (note) => renderNote(note, 0))}

          {/* Archive */}
          {archivedNotes.length > 0 &&
            renderSection("Archive", "archive", archivedNotes, (note) => renderNote(note, 0))}
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-1.5 type-ui text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded transition-colors">
            <span>🗑️</span>
            <span>Trash</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 type-ui text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] rounded transition-colors">
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[var(--accent)] transition-colors ${
          isResizing ? "bg-[var(--accent)]" : "bg-transparent"
        }`}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}

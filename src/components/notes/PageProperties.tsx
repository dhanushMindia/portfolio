"use client";

import { useState } from "react";
import { format } from "date-fns";

interface Folder {
  id: string;
  name: string;
}

interface PagePropertiesProps {
  note: {
    id: string;
    folderId?: string;
    isFavorite: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
  };
  folders: Folder[];
  onUpdate: (updates: any) => void;
}

export function PageProperties({ note, folders, onUpdate }: PagePropertiesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border-subtle)] pb-4 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 type-metadata text-xs text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors py-1"
      >
        <span>{isOpen ? "▼" : "▶"}</span>
        <span>Page Details</span>
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--bg-secondary)] p-4 rounded-md border border-[var(--border-subtle)]">
          {/* Folder */}
          <div className="flex items-center justify-between text-xs">
            <span className="type-metadata text-[var(--text-muted)]">Location</span>
            <select
              value={note.folderId || ""}
              onChange={(e) => onUpdate({ folderId: e.target.value || null })}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded px-2 py-1 outline-none type-ui"
            >
              <option value="">(No folder)</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  📁 {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* Favorite */}
          <div className="flex items-center justify-between text-xs">
            <span className="type-metadata text-[var(--text-muted)]">Favorite</span>
            <button
              onClick={() => onUpdate({ isFavorite: !note.isFavorite })}
              className={`px-2 py-1 rounded border border-[var(--border-subtle)] type-ui transition-colors ${
                note.isFavorite
                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                  : "bg-[var(--bg-primary)] text-[var(--text-main)]"
              }`}
            >
              {note.isFavorite ? "★ Favorited" : "☆ Add to favorites"}
            </button>
          </div>

          {/* Created at */}
          <div className="flex items-center justify-between text-xs">
            <span className="type-metadata text-[var(--text-muted)]">Created</span>
            <span className="type-ui text-[var(--text-main)]">
              {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>

          {/* Updated at */}
          <div className="flex items-center justify-between text-xs">
            <span className="type-metadata text-[var(--text-muted)]">Last Edited</span>
            <span className="type-ui text-[var(--text-main)]">
              {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>

          {/* Archive Status */}
          <div className="flex items-center justify-between text-xs md:col-span-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="type-metadata text-[var(--text-muted)]">Status</span>
            <button
              onClick={() => onUpdate({ isArchived: !note.isArchived })}
              className={`px-2 py-1 rounded border border-[var(--border-subtle)] type-ui transition-colors ${
                note.isArchived
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-[var(--bg-primary)] text-[var(--text-main)]"
              }`}
            >
              {note.isArchived ? "Archived (Click to restore)" : "Archive page"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

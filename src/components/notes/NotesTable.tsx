"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  icon?: string;
  updatedAt: string;
  isFavorite: boolean;
  folderId?: string;
}

interface DatabaseTableProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onToggleFavorite?: (id: string, current: boolean) => void;
  onDelete?: (id: string) => void;
}

type SortField = "title" | "updatedAt" | "isFavorite";
type SortDirection = "asc" | "desc";

export function NotesTable({ notes, onSelectNote, onToggleFavorite, onDelete }: DatabaseTableProps) {
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "updatedAt" ? "desc" : "asc");
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    let comparison = 0;

    if (sortField === "title") {
      comparison = (a.title || "Untitled").localeCompare(b.title || "Untitled");
    } else if (sortField === "updatedAt") {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortField === "isFavorite") {
      comparison = (a.isFavorite === b.isFavorite) ? 0 : a.isFavorite ? 1 : -1;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="opacity-0 group-hover:opacity-50">↕</span>;
    return <span>{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="w-full border border-[var(--border-subtle)] rounded-lg overflow-hidden bg-[var(--bg-primary)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
              <th
                className="py-3 px-4 type-metadata text-[var(--text-faint)] font-medium cursor-pointer group hover:bg-[var(--border-subtle)] transition-colors w-[60%]"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-2">
                  Name <SortIcon field="title" />
                </div>
              </th>
              <th
                className="py-3 px-4 type-metadata text-[var(--text-faint)] font-medium cursor-pointer group hover:bg-[var(--border-subtle)] transition-colors"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center gap-2">
                  Last Edited <SortIcon field="updatedAt" />
                </div>
              </th>
              <th className="py-3 px-4 type-metadata text-[var(--text-faint)] font-medium w-[100px] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedNotes.map((note) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={note.id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors group cursor-pointer"
                  onClick={() => onSelectNote(note.id)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl w-6 text-center">{note.icon || "📄"}</span>
                      <span className="type-ui text-[var(--text-main)] font-medium flex-1 truncate">
                        {note.title || "Untitled"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="type-ui text-[var(--text-muted)]">
                      {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(note.id, note.isFavorite);
                          }}
                          className={`p-1.5 rounded hover:bg-[var(--border-subtle)] transition-colors ${
                            note.isFavorite ? "text-yellow-500" : "text-[var(--text-faint)] hover:text-[var(--text-main)]"
                          }`}
                        >
                          {note.isFavorite ? "★" : "☆"}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note.id);
                          }}
                          className="p-1.5 rounded text-[var(--text-faint)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {sortedNotes.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center type-body text-[var(--text-muted)]">
                  No pages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

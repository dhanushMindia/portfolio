"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  icon?: string;
  updatedAt: string;
  coverImage?: string;
  content?: any;
}

interface NotesGalleryProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
}

export function NotesGallery({ notes, onSelectNote }: NotesGalleryProps) {
  // Extract text preview from BlockNote JSON content
  const getPreviewText = (content: any) => {
    if (!content) return "No content";
    try {
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === "paragraph" && block.content && block.content.length > 0) {
            return block.content.map((inline: any) => inline.text || "").join("") || "Empty paragraph";
          }
        }
      }
      return "Empty page";
    } catch {
      return "";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className="group flex flex-col bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg overflow-hidden cursor-pointer hover:border-[var(--text-faint)] hover:shadow-md transition-all h-64"
          >
            {/* Cover image area */}
            <div
              className={`h-24 w-full flex-shrink-0 ${note.coverImage ? 'bg-cover bg-center' : 'bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]'}`}
              style={note.coverImage ? { backgroundImage: `url(${note.coverImage})` } : {}}
            >
              {!note.coverImage && (
                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="relative p-4 flex-1 flex flex-col">
              {/* Floating icon */}
              <div className="absolute -top-6 left-4 text-3xl bg-[var(--bg-primary)] p-1 rounded-md shadow-sm border border-[var(--border-subtle)]">
                {note.icon || "📄"}
              </div>

              <div className="mt-4 flex-1 overflow-hidden">
                <h3 className="type-ui font-medium text-[var(--text-main)] truncate mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {note.title || "Untitled"}
                </h3>
                <p className="type-metadata text-[var(--text-muted)] text-xs line-clamp-3">
                  {getPreviewText(note.content)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[10px] type-metadata text-[var(--text-faint)] text-right">
                {format(new Date(note.updatedAt), "MMM d, yyyy")}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {notes.length === 0 && (
        <div className="col-span-full py-20 text-center border border-dashed border-[var(--border-subtle)] rounded-lg">
          <div className="text-3xl mb-3 opacity-50">🖼️</div>
          <p className="type-body text-[var(--text-muted)]">No pages to display in gallery</p>
        </div>
      )}
    </div>
  );
}

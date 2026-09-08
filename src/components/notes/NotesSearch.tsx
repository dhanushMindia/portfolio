"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  icon?: string;
  content?: string;
  updatedAt: string;
}

interface NotesSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
}

export function NotesSearch({ open, onClose, onSelectNote }: NotesSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectResult = (noteId: string) => {
    onSelectNote(noteId);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            autoFocus
            className="w-full px-4 py-3 bg-transparent type-body text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center type-body text-[var(--text-muted)]">
              Searching...
            </div>
          ) : results.length === 0 ? (
            query.trim() ? (
              <div className="p-8 text-center type-body text-[var(--text-muted)]">
                No results found
              </div>
            ) : (
              <div className="p-8 text-center type-body text-[var(--text-faint)]">
                Start typing to search
              </div>
            )
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result.id)}
                  className="w-full px-4 py-3 text-left hover:bg-[var(--bg-secondary)] transition-colors flex items-start gap-3 group"
                >
                  <span className="text-xl flex-shrink-0">{result.icon || "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="type-ui text-[var(--text-main)] truncate group-hover:text-[var(--accent)]">
                      {result.title || "Untitled"}
                    </div>
                    <div className="type-metadata text-[var(--text-muted)] text-xs mt-1">
                      {new Date(result.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

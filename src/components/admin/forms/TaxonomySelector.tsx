"use client";

import { useState, useEffect, useRef } from "react";

interface TaxonomySelectorProps {
  type: "topics" | "skills";
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

interface TaxonomyItem {
  id: string;
  name: string;
  category?: string | null;
}

export function TaxonomySelector({ type, selectedIds, onChange }: TaxonomySelectorProps) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const response = await fetch(`/api/taxonomy?type=${type}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data[type] || []);
        }
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchTaxonomy();
  }, [type]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreateNew = async () => {
    if (!search.trim()) return;
    setIsCreating(true);
    try {
      const slug = search
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const body = type === "topics"
        ? { name: search.trim(), slug, description: "" }
        : { name: search.trim(), slug, category: "" };

      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const newItem = data[type === "topics" ? "topic" : "skill"];
        setItems([...items, newItem]);
        onChange([...selectedIds, newItem.id]);
        setSearch("");
        setIsOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || `Failed to create ${type}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error creating ${type}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-[var(--text-muted)] animate-pulse">Loading {type}...</div>;
  }

  const exactMatch = items.find(i => i.name.toLowerCase() === search.toLowerCase());
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const unselectedFiltered = filteredItems.filter(i => !selectedIds.includes(i.id));

  return (
    <div className="space-y-4" ref={wrapperRef}>
      {/* Selected tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map(id => {
            const item = items.find(i => i.id === id);
            if (!item) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-full group"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => toggleItem(id)}
                  className="text-[var(--text-faint)] group-hover:text-[var(--text-main)] transition-colors"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Creatable Combobox */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search or create ${type}...`}
          className="w-full text-sm px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {isOpen && (search || unselectedFiltered.length > 0) && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-[var(--bg-primary)] border border-structural rounded-lg shadow-lg">
            {unselectedFiltered.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  toggleItem(item.id);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {item.name}
              </button>
            ))}

            {search && !exactMatch && (
              <button
                type="button"
                onClick={handleCreateNew}
                disabled={isCreating}
                className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-t border-structural"
              >
                {isCreating ? "Creating..." : `+ Create "${search}"`}
              </button>
            )}

            {!search && unselectedFiltered.length === 0 && (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">
                All {type} are selected.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

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

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse">Loading {type}...</div>;
  }

  if (items.length === 0) {
    return <div className="text-sm text-gray-500">No {type} found. Manage them in the admin dashboard.</div>;
  }

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search/Filter (if lots of items) */}
      {items.length > 5 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Filter ${type}...`}
          className="w-full text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900"
        />
      )}

      {/* Selected tags */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds.map(id => {
            const item = items.find(i => i.id === id);
            if (!item) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => toggleItem(id)}
                  className="hover:text-blue-600 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Available items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto  p-1 border border-gray-200 dark:border-gray-800 rounded">
        {filteredItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex items-center p-2 text-sm rounded cursor-pointer transition-colors ${
                isSelected
                  ? "bg-gray-50 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
              />
              <span className="truncate">{item.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

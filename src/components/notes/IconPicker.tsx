"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

// Common emoji categories for notes/journal entries
const EMOJI_CATEGORIES = {
  "Symbols": ["📝", "📌", "✅", "⭐", "🎯", "💡", "🔔", "⚡", "🔥", "✨"],
  "Work": ["💼", "📊", "📈", "💻", "🖥️", "⚙️", "🔧", "🛠️", "📦", "🗂️"],
  "Nature": ["🌱", "🌿", "🌳", "🌸", "🌺", "🌻", "🍀", "🌾", "🌵", "🌴"],
  "Time": ["⏰", "⏳", "📅", "📆", "🕐", "🗓️", "⌛", "⏱️", "🔜", "🔙"],
  "Communication": ["💬", "📢", "📣", "📬", "📭", "📮", "📫", "💌", "📧", "📨"],
  "Objects": ["📚", "📖", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "🗒️"],
  "Emotions": ["❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "😊"],
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Symbols");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-md transition-all duration-150",
          "border border-[var(--border-subtle)] bg-[var(--bg-primary)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
          "text-2xl"
        )}
        aria-label="Pick an icon"
      >
        {value || "📝"}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 left-0 w-80 rounded-lg shadow-lg",
            "border border-[var(--border-subtle)] bg-[var(--bg-primary)]",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {/* Category tabs */}
          <div className="border-b border-[var(--border-subtle)] p-2 overflow-x-auto">
            <div className="flex gap-1">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap",
                    activeCategory === category
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji grid */}
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSelect(emoji)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center text-2xl rounded transition-all",
                    "hover:bg-[var(--bg-secondary)] hover:scale-110",
                    value === emoji && "bg-[var(--accent-muted)] ring-2 ring-[var(--accent)]"
                  )}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Footer hint */}
          <div className="border-t border-[var(--border-subtle)] px-3 py-2">
            <p className="type-metadata text-[var(--text-faint)] text-[10px]">
              Click to select an icon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

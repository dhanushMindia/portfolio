"use client";

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent
} from "react";

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: (DropdownMenuItem | "divider")[];
  align?: "left" | "right";
}

const DropdownMenu = ({ trigger, items, align = "right" }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const menuItems = items.filter((item): item is DropdownMenuItem => item !== "divider");

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const validItems = items.reduce((acc, item, index) => {
      if (item !== "divider" && !item.disabled) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const currentValidIndex = validItems.indexOf(focusedIndex);
      const nextValidIndex = validItems[(currentValidIndex + 1) % validItems.length];
      setFocusedIndex(nextValidIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentValidIndex = validItems.indexOf(focusedIndex);
      const prevValidIndex = validItems[
        (currentValidIndex - 1 + validItems.length) % validItems.length
      ];
      setFocusedIndex(prevValidIndex);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = items[focusedIndex];
      if (item !== "divider" && !item.disabled) {
        item.onClick();
        setIsOpen(false);
      }
    }
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const alignmentStyles = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={menuRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute ${alignmentStyles} mt-2 w-56
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            rounded-lg shadow-lg
            py-1 z-50
            animate-in fade-in-0 zoom-in-95 duration-100
          `}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            if (item === "divider") {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 border-t border-neutral-200 dark:border-neutral-800"
                  role="separator"
                />
              );
            }

            return (
              <button
                key={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                type="button"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                  transition-colors duration-150
                  focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : item.danger
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
                role="menuitem"
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                )}
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

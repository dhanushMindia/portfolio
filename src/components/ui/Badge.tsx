"use client";

import { type ReactNode } from "react";

export type BadgeVariant = "default" | "outlined" | "filled";
export type BadgeColor = "gray" | "blue" | "green" | "yellow" | "red";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

const Badge = ({
  variant = "default",
  color = "gray",
  size = "md",
  removable = false,
  onRemove,
  children
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors duration-200";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs rounded",
    md: "px-2.5 py-1 text-sm rounded-md"
  };

  const colorStyles = {
    default: {
      gray: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    },
    outlined: {
      gray: "border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
      blue: "border border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300",
      green: "border border-green-300 text-green-700 dark:border-green-700 dark:text-green-300",
      yellow: "border border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300",
      red: "border border-red-300 text-red-700 dark:border-red-700 dark:text-red-300"
    },
    filled: {
      gray: "bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-900",
      blue: "bg-blue-600 text-white dark:bg-blue-500",
      green: "bg-green-600 text-white dark:bg-green-500",
      yellow: "bg-yellow-600 text-white dark:bg-yellow-500",
      red: "bg-red-600 text-white dark:bg-red-500"
    }
  };

  const className = `${baseStyles} ${sizeStyles[size]} ${colorStyles[variant][color]}`;

  return (
    <span className={className}>
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 -mr-0.5 inline-flex items-center justify-center hover:opacity-70 focus:outline-none focus:opacity-70"
          aria-label="Remove"
        >
          <svg
            className="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;

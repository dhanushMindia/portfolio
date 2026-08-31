"use client";

import { forwardRef, useEffect, useRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  autoResize?: boolean;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      autoResize = false,
      fullWidth = false,
      maxLength,
      value,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    useEffect(() => {
      if (autoResize && internalRef.current) {
        const textarea = internalRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : helperId}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          className={`
            w-full px-3 py-2 text-base
            bg-white dark:bg-neutral-900
            border rounded-md
            text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-400 dark:placeholder:text-neutral-600
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-neutral-300 dark:border-neutral-700 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            }
            ${autoResize ? "overflow-hidden" : ""}
          `}
          {...props}
        />
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-sm text-neutral-500 dark:text-neutral-400">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

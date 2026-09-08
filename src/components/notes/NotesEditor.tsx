"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useEffect, useState } from "react";
import "@blocknote/shadcn/style.css";
import { cn } from "@/lib/utils";

interface NotesEditorProps {
  content?: any; // BlockNote internal JSON format or HTML string
  initialContent?: any; // Alias for content
  onChange: (content: any) => void;
  editable?: boolean;
}

export function NotesEditor({ content, initialContent, onChange, editable = true }: NotesEditorProps) {
  const actualContent = content ?? initialContent;

  // Use useCreateBlockNote for better React integration than manual useEffect
  const editor = useCreateBlockNote({
    initialContent: Array.isArray(actualContent) && actualContent.length > 0 ? actualContent : undefined,
  });

  // Handle case where initial content is HTML string (like in TipTapEditor.tsx)
  useEffect(() => {
    async function loadHTML() {
      if (typeof actualContent === "string" && actualContent !== "") {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(actualContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch (err) {
          console.error("Failed to parse initial HTML content in BlockNote:", err);
        }
      }
    }

    // Only load HTML string if we have it - array content is handled by initialContent
    if (editor && typeof actualContent === "string") {
      loadHTML();
    }
  }, [editor, actualContent]);

  if (!editor) {
    return (
      <div className="p-4 rounded-md border min-h-[500px] animate-pulse bg-[var(--bg-secondary)] border-[var(--border-subtle)]" />
    );
  }

  return (
    <div className={cn(
      "border border-[var(--border-subtle)] rounded-md overflow-hidden bg-[var(--bg-primary)] relative min-h-[500px]",
      !editable && "opacity-90 pointer-events-none"
    )}>
      {/*
        We use BlockNoteView from @blocknote/shadcn.
        By not forcing dark/light theme on it, we can restyle it using global CSS variables
        or let it adapt based on shadcn defaults.
      */}
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={async () => {
          // Both blocks and HTML output may be needed depending on the backend,
          // but we follow TipTapEditor.tsx's approach or return blocks
          const blocks = editor.document;
          onChange(blocks);
        }}
        // "light" or "dark" is accepted, but relying on CSS vars is better
        theme="light"
        className="min-h-[500px] py-6 prose-editorial max-w-none"
      />
    </div>
  );
}

export default NotesEditor;

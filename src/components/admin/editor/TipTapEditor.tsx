"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useEffect, useState } from "react";

interface TipTapEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    async function init() {
      const e = BlockNoteEditor.create();
      try {
        if (typeof content === "string" && content !== "") {
          const blocks = await e.tryParseHTMLToBlocks(content);
          e.replaceBlocks(e.document, blocks);
        } else if (Array.isArray(content) && content.length > 0) {
          e.replaceBlocks(e.document, content);
        }
      } catch (err) {
        console.error("Failed to parse initial content in BlockNote:", err);
      }
      setEditor(e);
    }
    if (!editor) init();
  }, [content]);

  if (!editor) {
    return <div className="p-4 rounded-md border min-h-[300px] animate-pulse bg-[var(--bg-secondary)] border-structural"></div>;
  }

  return (
    <div className="border border-structural rounded-md overflow-hidden bg-[var(--bg-primary)] relative min-h-[300px]">
      <BlockNoteView
        editor={editor}
        onChange={async () => {
          // Serialize directly to HTML so frontend can render natively without BlockNote
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange(html);
        }}
        theme="light"
        className="min-h-[300px] py-4 prose-editorial max-w-none"
      />
    </div>
  );
}

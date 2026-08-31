"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900/50 rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          editor.isActive("bold")
            ? "bg-gray-200 dark:bg-gray-700 font-bold"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        title="Bold (Cmd+B)"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-xs rounded italic transition-colors ${
          editor.isActive("italic")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        title="Italic (Cmd+I)"
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 text-xs rounded line-through transition-colors ${
          editor.isActive("strike")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        S
      </button>
      <div className="w-px h-100 bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          editor.isActive("bulletList")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          editor.isActive("orderedList")
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Numbered List
      </button>
      <div className="w-px h-100 bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3 min-h-[100px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-950">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

"use client";

import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TipTapEditorProps {
  content: any;
  onChange: (content: any) => void;
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
  const contentString = typeof content === 'string' ? content : JSON.stringify(content) === '[]' ? '' : content;

  const editor = useEditor({
    extensions: [StarterKit],
    content: contentString,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3 min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      // For Article compat with JSON db field, we can return the JSON representation
      // or just HTML string. Let's return JSON to be safe with prisma Json type.
      onChange(editor.getJSON() as any);
    },
  });

  useEffect(() => {
    if (editor && typeof contentString === 'string' && contentString !== editor.getHTML()) {
      editor.commands.setContent(contentString);
    } else if (editor && typeof contentString === 'object') {
      // If it's TipTap JSON
      // @ts-ignore
      editor.commands.setContent(contentString);
    }
  }, [contentString, editor]);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-950 relative">
      <MenuBar editor={editor} />
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-1 p-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs' : 'px-2 py-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs' : 'px-2 py-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs' : 'px-2 py-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            Quote
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs' : 'px-2 py-1 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            Code
          </button>
        </FloatingMenu>
      )}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-1 p-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-bold' : 'px-2 py-1 rounded text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs italic' : 'px-2 py-1 rounded text-xs italic hover:bg-gray-100 dark:hover:bg-gray-700'}
          >
            I
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

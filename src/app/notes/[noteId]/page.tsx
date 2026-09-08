"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/notes/PageHeader";
import { PageProperties } from "@/components/notes/PageProperties";

const NotesEditor = dynamic(() => import("@/components/notes/NotesEditor").then(m => m.default || m), { ssr: false });

export default function SingleNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;

  const [note, setNote] = useState<any>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNote = useCallback(async () => {
    try {
      setLoading(true);
      const [res, foldersRes] = await Promise.all([
        fetch(`/api/notes/pages/${noteId}`),
        fetch(`/api/notes/folders`) // Need folders for the property panel
      ]);

      if (res.ok) {
        const data = await res.json();
        setNote(data.note);
      } else if (res.status === 404) {
        router.push("/notes");
      }

      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        const flatFolders: any[] = [];

        // Flatten folder tree for selector
        const flatten = (arr: any[]) => {
          arr.forEach(f => {
            flatFolders.push({ id: f.id, name: f.name });
            if (f.children && f.children.length > 0) {
              flatten(f.children);
            }
          });
        };

        flatten(foldersData.folders || []);
        setFolders(flatFolders);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [noteId, router]);

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId, fetchNote]);

  const handleUpdate = async (updates: any) => {
    try {
      setSaving(true);

      // Optimistic upate
      setNote((prev: any) => ({ ...prev, ...updates }));

      await fetch(`/api/notes/pages/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = useCallback((content: any) => {
    // Debounce the content saving in the editor component, just pass through here
    handleUpdate({ content });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="type-body text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="sticky top-0 z-10 flex justify-end px-12 py-4 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <span className={`type-metadata text-xs ${saving ? 'text-[var(--text-main)]' : 'text-[var(--text-faint)]'} transition-colors`}>
              {saving ? "Saving..." : "Saved"}
            </span>
          </div>
        </div>

        <PageHeader
          noteId={noteId}
          title={note.title}
          icon={note.icon}
          coverImage={note.coverImage}
          onTitleChange={(title) => handleUpdate({ title })}
          onIconChange={(icon) => handleUpdate({ icon })}
          onCoverImageChange={(coverImage) => handleUpdate({ coverImage })}
        />

        <div className="px-12 mb-4">
          <PageProperties
            note={note}
            folders={folders}
            onUpdate={handleUpdate}
          />
        </div>

        <div className="px-12 mt-4">
          <NotesEditor
            initialContent={note.content}
            onChange={handleContentChange}
            editable={true}
          />
        </div>
      </div>
    </div>
  );
}

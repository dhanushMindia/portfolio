"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { NotesSearch } from "@/components/notes/NotesSearch";

const NotesSidebar = dynamic(() => import("@/components/notes/NotesSidebar").then(m => m.default || m), { ssr: false });

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // The login page shouldn't show the workspace layout
  const isLoginPage = pathname === "/notes/login";

  const [folders, setFolders] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Extract note ID from pathname if we're on a note page
    const match = pathname.match(/\/notes\/([a-zA-Z0-9_-]+)/);
    if (match && match[1] !== "login") {
      setCurrentNoteId(match[1]);
    } else {
      setCurrentNoteId(null);
    }
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/notes/auth/verify");
      if (res.ok) {
        const data = await res.json();
        setUserName(data.user?.email || "User");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return false;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const isAuthenticated = await fetchUser();

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const [foldersRes, notesRes] = await Promise.all([
        fetch("/api/notes/folders"),
        fetch("/api/notes/pages"),
      ]);

      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        setFolders(foldersData.folders || []);
      }

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoginPage) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, isLoginPage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectNote = (noteId: string) => {
    setCurrentNoteId(noteId);
    router.push(`/notes/${noteId}`);
  };

  const handleCreatePage = async (folderId?: string) => {
    try {
      const res = await fetch("/api/notes/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled",
          folderId: folderId || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await fetchData(); // refresh sidebar
        handleSelectNote(data.note.id);
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Folder name:", "New Folder");
    if (!name) return;

    try {
      const res = await fetch("/api/notes/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/notes/auth/logout", { method: "POST" });
      router.push("/notes/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="type-body text-[var(--text-muted)] mt-4">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <NotesSidebar
        folders={folders}
        notes={notes}
        currentNoteId={currentNoteId || undefined}
        onSelectNote={handleSelectNote}
        onCreatePage={handleCreatePage}
        onCreateFolder={handleCreateFolder}
        onSearchOpen={() => setSearchOpen(true)}
        onLogout={handleLogout}
        userName={userName}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)] h-screen overflow-hidden">
        {children}
      </div>

      <NotesSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectNote={handleSelectNote}
      />
    </div>
  );
}

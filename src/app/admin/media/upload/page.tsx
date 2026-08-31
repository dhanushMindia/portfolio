"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function MediaUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile && !title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      if (description) formData.append("description", description);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload file");
      }

      router.push("/admin/media");
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
          Upload Media
        </h1>
        <p className="text-[var(--text-muted)]">
          Upload images, PDFs, or documents to your media library
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              File *
            </label>
            <input
              type="file"
              required
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="block w-full text-sm text-[var(--text-main)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 file:cursor-pointer cursor-pointer"
            />
            {file && (
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="File title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional description"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Privacy Notice</p>
            <p>
              All uploaded files default to <strong>PRIVATE</strong> visibility.
              You can change visibility after upload.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isUploading || !file}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 text-[var(--text-main)] px-6 py-2 rounded-lg font-medium"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

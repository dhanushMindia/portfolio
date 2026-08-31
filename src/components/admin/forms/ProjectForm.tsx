"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContentBlock } from "@/types/blocks";
import { BlockEditor } from "@/components/admin/editor/BlockEditor";
import { Button } from "@/components/ui/Button";
import { TaxonomySelector } from "@/components/admin/forms/TaxonomySelector";
import { ProjectRelationsSelector } from "@/components/admin/forms/ProjectRelationsSelector";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    blocks: ContentBlock[];
    status: string;
    visibility: string;
    featured: boolean;
    startDate: Date | null;
    endDate: Date | null;
    topics?: { topic: { id: string; name: string } }[];
    skills?: { skill: { id: string; name: string } }[];
    relatedProjects?: { relatedProjectId: string }[];
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    shortDescription: project?.shortDescription || "",
    blocks: project?.blocks || ([] as ContentBlock[]),
    status: project?.status || "DRAFT",
    progressStatus: (project as any)?.progressStatus || "ONGOING",
    visibility: project?.visibility || "PRIVATE",
    featured: project?.featured || false,
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : "",
    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().split("T")[0]
      : "",
    topicIds: project?.topics?.map((t) => t.topic.id) || [],
    skillIds: project?.skills?.map((s) => s.skill.id) || [],
    relatedProjectIds: project?.relatedProjects?.map((p) => p.relatedProjectId) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = project
        ? `/api/projects/${project.id}`
        : "/api/projects";
      const method = project ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save project");
      }

      const { project: savedProject } = await response.json();
      router.push(`/admin/projects/${savedProject.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Basic fields */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Basic Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSlug}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Project title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            pattern="^[a-z0-9-]+$"
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="project-slug"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            URL: /work/{formData.slug || "project-slug"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Short Description
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description for cards and previews"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Relationships */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Relationships
        </h2>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Topics
          </label>
          <TaxonomySelector
            type="topics"
            selectedIds={formData.topicIds}
            onChange={(ids) => setFormData({ ...formData, topicIds: ids })}
          />
        </div>

        <div className="pt-4 border-t border-structural">
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Skills Applied
          </label>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Only select skills where this project provides clear evidence of application.
          </p>
          <TaxonomySelector
            type="skills"
            selectedIds={formData.skillIds}
            onChange={(ids) => setFormData({ ...formData, skillIds: ids })}
          />
        </div>
      </div>

      {/* Content blocks */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6">
        <h2 className="text-lg font-medium text-[var(--text-main)] mb-6">
          Content Blocks
        </h2>
        <BlockEditor
          blocks={formData.blocks}
          onChange={(blocks) => setFormData({ ...formData, blocks })}
        />
      </div>

      {/* Status & visibility */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Publishing & Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PRIVATE">🔒 Private</option>
              <option value="UNLISTED">🔗 Unlisted</option>
              <option value="PUBLIC">🌐 Public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Lifecycle Status
            </label>
            <select
              value={formData.progressStatus}
              onChange={(e) => setFormData({ ...formData, progressStatus: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PLANNING">Planning</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Publish Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-[var(--text-main)]">
            Feature on homepage
          </span>
        </label>

        {formData.visibility === "PRIVATE" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
            🔒 This project is <strong>PRIVATE</strong>. It will not be visible
            to the public regardless of status.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : project ? "Update Project" : "Create Project"}
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
  );
}

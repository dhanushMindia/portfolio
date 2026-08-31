"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentBlock } from "@/types/blocks";
import { BlockEditor } from "@/components/admin/editor/BlockEditor";
import { Button } from "@/components/ui/Button";
import { TaxonomySelector } from "@/components/admin/forms/TaxonomySelector";

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    content: ContentBlock[];
    status: string;
    visibility: string;
    topics?: { topic: { id: string; name: string } }[];
  };
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    subtitle: article?.subtitle || "",
    content: article?.content || ([] as ContentBlock[]),
    status: article?.status || "DRAFT",
    visibility: article?.visibility || "PRIVATE",
    topicIds: article?.topics?.map((t) => t.topic.id) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = article
        ? `/api/articles?id=${article.id}`
        : "/api/articles";
      const method = article ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save article");
      }

      const { article: savedArticle } = await response.json();
      router.push(`/admin/articles/${savedArticle.id}`);
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Basic Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSlug}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Article title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            pattern="^[a-z0-9-]+$"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="article-slug"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            URL: /writing/{formData.slug || "article-slug"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Excerpt / Subtitle
          </label>
          <textarea
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief excerpt for cards and previews"
          />
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Topics
          </label>
          <TaxonomySelector
            type="topics"
            selectedIds={formData.topicIds}
            onChange={(ids) => setFormData({ ...formData, topicIds: ids })}
          />
        </div>
      </div>

      {/* Content blocks */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-6">
          Content Blocks
        </h2>
        <BlockEditor
          blocks={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      {/* Status & visibility */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
          Publishing
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PRIVATE">🔒 Private</option>
              <option value="UNLISTED">🔗 Unlisted</option>
              <option value="PUBLIC">🌐 Public</option>
            </select>
          </div>
        </div>

        {formData.visibility === "PRIVATE" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
            🔒 This article is <strong>PRIVATE</strong>. It will not be visible
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
          {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-lg font-medium"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

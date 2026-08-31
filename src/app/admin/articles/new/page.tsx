import { ArticleForm } from "@/components/admin/forms/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
          New Article
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Write a new article with flexible block-based content
        </p>
      </div>

      <ArticleForm />
    </div>
  );
}

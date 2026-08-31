export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { notFound } from "next/navigation";
import { ContentBlock } from "@/types/blocks";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    notFound();
  }

  // Ensure blocks is properly typed for the form
  const formattedArticle = {
    ...article,
    content: (article.content as unknown as ContentBlock[]) || [],
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
          Edit Article: {article.title}
        </h1>
      </div>

      <ArticleForm article={formattedArticle} />
    </div>
  );
}

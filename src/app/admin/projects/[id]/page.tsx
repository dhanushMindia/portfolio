export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { notFound } from "next/navigation";
import { ContentBlock } from "@/types/blocks";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const project = await prisma.project.findUnique({
    where: { id: (await params).id },
  });

  if (!project) {
    notFound();
  }

  // Ensure blocks is properly typed for the form
  const formattedProject = {
    ...project,
    blocks: (project.blocks as unknown as ContentBlock[]) || [],
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
          Edit Project: {project.title}
        </h1>
      </div>

      <ProjectForm project={formattedProject} />
    </div>
  );
}

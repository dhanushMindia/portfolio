import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
          New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new project entry with flexible block-based content
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}

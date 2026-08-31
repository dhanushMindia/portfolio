import { JournalForm } from "@/components/admin/forms/JournalForm";

export default function NewJournalEntryPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-50 mb-2">
          New Week Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Log your weekly progress and learnings
        </p>
      </div>

      <JournalForm />
    </div>
  );
}

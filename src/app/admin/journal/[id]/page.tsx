export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { JournalForm } from "@/components/admin/forms/JournalForm";
import { notFound } from "next/navigation";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journal = await prisma.journalEntry.findUnique({
    where: { id },
  });

  if (!journal) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-[var(--text-main)] mb-2">
          Edit Journal Entry
        </h1>
        <p className="text-[var(--text-muted)] font-mono text-sm">
          {new Date(journal.startDate).toLocaleDateString()} —{" "}
          {new Date(journal.endDate).toLocaleDateString()}
        </p>
      </div>

      <JournalForm entry={journal} />
    </div>
  );
}

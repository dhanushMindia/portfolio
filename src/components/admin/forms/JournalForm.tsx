"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { JournalProjectLinker } from "@/components/admin/forms/JournalProjectLinker";
import { TaxonomySelector } from "@/components/admin/forms/TaxonomySelector";

interface JournalFormProps {
  entry?: {
    id: string;
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    title: string;
    focus: string | null;
    workCompleted: string;
    outcomes: string | null;
    reflection: string | null;
    challenges: string | null;
    nextWeekFocus: string | null;
    status: string;
    visibility: string;
    projects?: { projectId: string }[];
    skills?: { skillId: string }[];
    attachments?: { id: string; title: string; url: string; fileType: string; size: number }[];
  };
}

export function JournalForm({ entry }: JournalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to current week
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  const weekDates = entry
    ? {
        start: new Date(entry.startDate).toISOString().split("T")[0],
        end: new Date(entry.endDate).toISOString().split("T")[0],
      }
    : getWeekDates();

  const [formData, setFormData] = useState({
    weekNumber: entry?.weekNumber || 1,
    startDate: weekDates.start,
    endDate: weekDates.end,
    title: entry?.title || "",
    focus: entry?.focus || "",
    workCompleted: entry?.workCompleted || "",
    outcomes: entry?.outcomes || "",
    reflection: entry?.reflection || "",
    challenges: entry?.challenges || "",
    nextWeekFocus: entry?.nextWeekFocus || "",
    status: entry?.status || "DRAFT",
    visibility: entry?.visibility || "PRIVATE",
    projectIds: entry?.projects?.map((p) => p.projectId) || [],
    skillIds: entry?.skills?.map((s) => s.skillId) || [],
    attachments: entry?.attachments || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = entry ? `/api/journal?id=${entry.id}` : "/api/journal";
      const method = entry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save journal entry");
      }

      const { entry: savedEntry } = await response.json();
      router.push(`/admin/journal/${savedEntry.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Week details */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Week Info
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
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="e.g. Week 1: Overview"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Week Number *
            </label>
            <input
              type="number"
              required
              value={formData.weekNumber}
              onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              End Date *
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            />
          </div>
        </div>
      </div>

      {/* Content fields - Dr. Subramanian 4-tier Framework */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[var(--text-main)]">
            Project Log (Execution & Impact)
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Document the specific research directive, methodology executed, and measurable outcomes.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            1. Context & Objectives (Focus)
          </label>
          <textarea
            value={formData.focus}
            onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="e.g. Initiated Telangana State Scan: Macroeconomic & Fiscal Profile (2014-2024)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            2. Action Taken & Methodology (Work Completed) *
          </label>
          <textarea
            required
            value={formData.workCompleted}
            onChange={(e) =>
              setFormData({ ...formData, workCompleted: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="Detailed methodology, dataset sourcing, modeling steps, and quantitative analysis..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            3. Impact & Deliverables (Outcomes)
          </label>
          <textarea
            value={formData.outcomes}
            onChange={(e) =>
              setFormData({ ...formData, outcomes: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="Summary tables generated, briefs published, datasets cleaned..."
          />
        </div>
      </div>

      {/* Weekly Reflection Ledger */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[var(--text-main)]">
            Weekly Reflection & Learning Ledger
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Analytical reflections, qualitative insights, bottlenecks encountered, and forward direction.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Wins & Milestones (Reflection)
          </label>
          <textarea
            value={formData.reflection}
            onChange={(e) =>
              setFormData({ ...formData, reflection: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="Key successes, breakthroughs in analysis, supervisor feedback..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Roadblocks & Challenges
          </label>
          <textarea
            value={formData.challenges}
            onChange={(e) =>
              setFormData({ ...formData, challenges: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="Data discrepancies, missing time-series records, methodological roadblocks..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Key Learnings & Next Steps
          </label>
          <textarea
            value={formData.nextWeekFocus}
            onChange={(e) =>
              setFormData({ ...formData, nextWeekFocus: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            placeholder="Concepts mastered, next week's focus areas and analytical plans..."
          />
        </div>
      </div>

      {/* Linked Projects */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Linked Projects
        </h2>
        <JournalProjectLinker
          selectedProjectIds={formData.projectIds}
          onChange={(projectIds) => setFormData({ ...formData, projectIds })}
        />
      </div>

      {/* Skills Used */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Skills Used
        </h2>
        <TaxonomySelector
          type="skills"
          selectedIds={formData.skillIds}
          onChange={(skillIds) => setFormData({ ...formData, skillIds })}
        />
      </div>

      {/* Attachments */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-[var(--text-main)]">
            Attachments & Assets
          </h2>
          <Button
            type="button"
            onClick={() => setFormData({
              ...formData,
              attachments: [
                ...formData.attachments,
                { id: `temp-${Date.now()}`, title: '', url: '', fileType: 'PDF', size: 0 }
              ]
            })}
            className="px-3 py-1 bg-[var(--bg-secondary)] text-sm rounded-md"
          >
            + Add Attachment
          </Button>
        </div>

        {formData.attachments.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] italic">No attachments added yet.</p>
        ) : (
          <div className="space-y-4">
            {formData.attachments.map((attachment, index) => (
              <div key={attachment.id} className="grid grid-cols-12 gap-3 items-center border border-structural p-3 rounded-md">
                <div className="col-span-4">
                  <label className="block text-xs mb-1 text-[var(--text-muted)]">Title</label>
                  <input
                    type="text"
                    value={attachment.title}
                    onChange={(e) => {
                      const newAttachments = [...formData.attachments];
                      newAttachments[index].title = e.target.value;
                      setFormData({ ...formData, attachments: newAttachments });
                    }}
                    className="w-full px-2 py-1 text-sm border border-[var(--border-strong)] rounded bg-[var(--bg-primary)] text-[var(--text-main)]"
                    placeholder="e.g. Q1 Fiscal Report"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs mb-1 text-[var(--text-muted)]">URL</label>
                  <input
                    type="text"
                    value={attachment.url}
                    onChange={(e) => {
                      const newAttachments = [...formData.attachments];
                      newAttachments[index].url = e.target.value;
                      setFormData({ ...formData, attachments: newAttachments });
                    }}
                    className="w-full px-2 py-1 text-sm border border-[var(--border-strong)] rounded bg-[var(--bg-primary)] text-[var(--text-main)]"
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs mb-1 text-[var(--text-muted)]">Type</label>
                  <select
                    value={attachment.fileType}
                    onChange={(e) => {
                      const newAttachments = [...formData.attachments];
                      newAttachments[index].fileType = e.target.value;
                      setFormData({ ...formData, attachments: newAttachments });
                    }}
                    className="w-full px-2 py-1 text-sm border border-[var(--border-strong)] rounded bg-[var(--bg-primary)] text-[var(--text-main)]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCUMENT">Document</option>
                    <option value="SPREADSHEET">Spreadsheet</option>
                    <option value="CODE">Code</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      const newAttachments = formData.attachments.filter((_, i) => i !== index);
                      setFormData({ ...formData, attachments: newAttachments });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status & visibility */}
      <div className="bg-[var(--bg-primary)] border border-structural rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-[var(--text-main)]">
          Publishing
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
              className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-main)]"
            >
              <option value="PRIVATE">🔒 Private</option>
              <option value="UNLISTED">🔗 Unlisted</option>
              <option value="PUBLIC">🌐 Public</option>
            </select>
          </div>
        </div>

        {formData.visibility === "PRIVATE" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
            🔒 This journal entry is <strong>PRIVATE</strong>. It will not be
            visible to the public regardless of status.
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
          {isSubmitting
            ? "Saving..."
            : entry
            ? "Update Entry"
            : "Create Entry"}
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

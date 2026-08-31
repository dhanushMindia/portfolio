"use client";

import { useState, useEffect } from "react";

interface JournalProjectLinkerProps {
  selectedProjectIds: string[];
  onChange: (ids: string[]) => void;
}

interface ProjectOption {
  id: string;
  title: string;
  slug: string;
  status: string;
}

/**
 * Component for linking projects to journal entries.
 * Shows which projects were worked on during a given week.
 */
export function JournalProjectLinker({
  selectedProjectIds,
  onChange,
}: JournalProjectLinkerProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No projects available. Create projects first to link them to journal entries.
      </div>
    );
  }

  const toggleProject = (id: string) => {
    if (selectedProjectIds.includes(id)) {
      onChange(selectedProjectIds.filter((pid) => pid !== id));
    } else {
      onChange([...selectedProjectIds, id]);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Link projects you worked on during this week. This creates evidence-based connections
        between your journal and project work.
      </p>

      {/* Search */}
      {projects.length > 5 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      )}

      {/* Selected projects */}
      {selectedProjectIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProjectIds.map((id) => {
            const project = projects.find((p) => p.id === id);
            if (!project) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full"
              >
                {project.title}
                <button
                  type="button"
                  onClick={() => toggleProject(id)}
                  className="hover:text-emerald-600 dark:hover:text-emerald-200"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Available projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded p-2">
        {filteredProjects.map((project) => {
          const isSelected = selectedProjectIds.includes(project.id);
          return (
            <label
              key={project.id}
              className={`flex items-start p-2 text-sm rounded cursor-pointer transition-colors ${
                isSelected
                  ? "bg-gray-50 dark:bg-gray-800 font-medium border border-emerald-500 dark:border-emerald-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleProject(project.id)}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mr-2 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="truncate">{project.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  /{project.slug}
                </div>
              </div>
            </label>
          );
        })}
        {filteredProjects.length === 0 && (
          <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No projects match your search.
          </div>
        )}
      </div>

      {selectedProjectIds.length === 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          Tip: Select all projects you actively worked on this week. This helps track skill usage
          and project progress over time.
        </div>
      )}
    </div>
  );
}

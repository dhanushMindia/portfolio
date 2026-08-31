"use client";

import { useState, useEffect } from "react";

interface ProjectRelationsSelectorProps {
  projectId?: string;
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
 * Component for selecting related projects to create cross-references.
 * Used in ProjectForm to link related work together.
 */
export function ProjectRelationsSelector({
  projectId,
  selectedProjectIds,
  onChange,
}: ProjectRelationsSelectorProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter out the current project if editing
          const availableProjects = data.projects.filter(
            (p: ProjectOption) => p.id !== projectId
          );
          setProjects(availableProjects);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [projectId]);

  if (loading) {
    return (
      <div className="text-sm text-[var(--text-muted)] animate-pulse">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-sm text-[var(--text-muted)]">
        No other projects available to link.
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
      {/* Search */}
      {projects.length > 5 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full text-sm px-3 py-1.5 border border-structural rounded bg-[var(--bg-secondary)] text-[var(--text-main)]"
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
              >
                {project.title}
                <button
                  type="button"
                  onClick={() => toggleProject(id)}
                  className="hover:text-blue-600 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Available projects list */}
      <div className="max-h-64 overflow-y-auto border border-structural rounded p-2 space-y-1">
        {filteredProjects.map((project) => {
          const isSelected = selectedProjectIds.includes(project.id);
          return (
            <label
              key={project.id}
              className={`flex items-start p-2 text-sm rounded cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[var(--bg-secondary)] font-medium"
                  : "hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleProject(project.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="truncate">{project.title}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  /{project.slug}
                </div>
              </div>
            </label>
          );
        })}
        {filteredProjects.length === 0 && (
          <div className="text-sm text-[var(--text-muted)] text-center py-4">
            No projects match your search.
          </div>
        )}
      </div>
    </div>
  );
}

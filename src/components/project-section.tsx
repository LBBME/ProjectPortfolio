"use client";

import { useState } from "react";
import type { Project } from "@/lib/project-types";
import { ProjectCard } from "@/components/project-card";

const PREVIEW_COUNT = 6;

type ProjectSectionProps = {
  title: string;
  projects: Project[];
  emptyMessage: string;
};

export function ProjectSection({ title, projects, emptyMessage }: ProjectSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = projects.length > PREVIEW_COUNT;
  const visibleProjects = expanded ? projects : projects.slice(0, PREVIEW_COUNT);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="h2">{title}</h2>
        <p className="text-xs text-zinc-600">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="surface-card p-5 text-sm text-zinc-600">{emptyMessage}</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} showImage />
            ))}
          </div>

          {hasMore ? (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="btn-secondary"
            >
              {expanded ? "Show less" : `Show more (${projects.length - PREVIEW_COUNT})`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}

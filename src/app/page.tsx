import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/project-types";
import { ProjectSection } from "@/components/project-section";
import { ProjectFilters } from "@/components/project-filters";
import { getAllProjects, getAllTags, filterProjects } from "@/lib/projects";

type SearchParams = {
  q?: string;
  tag?: string | string[];
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isOtherProject(project: Project): boolean {
  const combined = [project.title, project.slug, project.domain, ...project.tags]
    .join(" ")
    .toLowerCase();
  return (
    combined.includes("non-cfd") ||
    combined.includes("robotics") ||
    combined.includes("surrogate")
  );
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const projects = await getAllProjects();
  const tags = getAllTags(projects);
  const selectedTags = toArray(params.tag);
  const q = params.q ?? "";
  const filtered = filterProjects(projects, q, selectedTags);
  const cfdProjects = filtered.filter((project) => !isOtherProject(project));
  const otherProjects = filtered.filter((project) => isOtherProject(project));

  return (
    <div className="space-y-10">
      <section className="panel p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Project Portfolio</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-zinc-900 md:text-5xl">
              Dennis Joel Roman Salinas
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-700">
              CFD and aero simulation work with a focus on what matters: believable results,
              clean presentation, and transparent execution.
            </p>

            <div className="mt-5 space-y-2 text-sm text-zinc-700">
              <p><span className="font-semibold text-zinc-900">Focus:</span> CFD, V&V, automation, HPC execution</p>
              <p><span className="font-semibold text-zinc-900">Domains:</span> external aero, internal flows, and multi-physics workflows</p>
              <p><span className="font-semibold text-zinc-900">Tools:</span> Fluent, FENSAP-ICE, STAR-CCM+, OpenFOAM, Python, MATLAB, SLURM</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/resume" className="btn-secondary">
                Open Resume
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="relative h-[320px]">
                <Image
                  src="/api/robotech-image/about-profile"
                  alt="Dennis Joel Roman Salinas"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  priority
                />
              </div>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Site Intent</p>
              <p className="mt-2 text-sm leading-7 text-zinc-700">
                This site is designed to spark interview-level interest, not reveal every internal workflow detail online.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Project Tracks</p>
              <p className="mt-2 text-sm leading-7 text-zinc-700">
                HyTech Racing Formula SAE-EV, Ben T. Zinn Combustion Lab, and High Powered Electric Propulsion Lab context.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">What To Expect</p>
              <p className="mt-2 text-sm leading-7 text-zinc-700">
                Core results, validation markers, and tools/stack visibility. Full technical deep dives available in interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="h2">Project Explorer</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Direct project browsing from landing. Use search first; optional tag filters are available below.
        </p>

        <div className="mt-4">
          <ProjectFilters
            tags={tags}
            selectedTags={selectedTags}
            initialQuery={q}
          />
        </div>
      </section>

      <p className="text-sm text-zinc-600">
        Showing {filtered.length} of {projects.length} projects
      </p>

      <ProjectSection
        title="CFD Projects"
        projects={cfdProjects}
        emptyMessage="No CFD projects match this filter yet."
      />
      <ProjectSection
        title="Other Projects"
        projects={otherProjects}
        emptyMessage="No other projects match this filter yet."
      />
    </div>
  );
}

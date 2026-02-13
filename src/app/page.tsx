import Link from "next/link";
import type { Project } from "@/lib/project-types";
import { ProjectSection } from "@/components/project-section";
import { getAllProjects, getAllTags, filterProjects } from "@/lib/projects";

type SearchParams = {
  q?: string;
  tag?: string | string[];
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildTagHref(tag: string, selectedTags: string[], query: string): string {
  const nextTags = selectedTags.includes(tag)
    ? selectedTags.filter((t) => t !== tag)
    : [...selectedTags, tag];

  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  for (const value of nextTags) params.append("tag", value);
  const queryString = params.toString();
  return `/${queryString ? `?${queryString}` : ""}`;
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
            <p className="text-xs uppercase tracking-[0.16em] text-sky-300">Project Portfolio</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Dennis Joel Roman Salinas
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-100">
              CFD and aero simulation project portfolio designed for fast recruiter scanability:
              strong outcomes, clean visuals, and selective technical detail.
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-100">
              <p><span className="font-semibold text-white">Focus:</span> CFD, V&V, automation, HPC execution</p>
              <p><span className="font-semibold text-white">Domains:</span> external aero, internal flows, and multi-physics workflows</p>
              <p><span className="font-semibold text-white">Tools:</span> Fluent, FENSAP-ICE, STAR-CCM+, OpenFOAM, Python, MATLAB, SLURM</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/resume" className="btn-secondary">
                Open Resume
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Recruiter Intent</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                This site is designed to spark interview-level interest, not reveal every internal workflow detail online.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Project Tracks</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                HyTech Racing Formula SAE-EV, Ben T. Zinn Combustion Lab, and High Powered Electric Propulsion Lab context.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">What To Expect</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                Core results, validation markers, and tools/stack visibility. Full technical deep dives available in interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="h2">Project Explorer</h2>
        <p className="mt-2 text-sm text-slate-300">
          Direct project browsing from landing. Use search first; optional tag filters are available below.
        </p>

        <form action="/" method="get" className="mt-4">
          {selectedTags.map((tag) => (
            <input key={tag} type="hidden" name="tag" value={tag} />
          ))}
          <label htmlFor="q" className="sr-only">
            Search projects
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search: icing, transonic, diffuser, surrogate, OpenFOAM..."
            className="w-full rounded-md border border-edge bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </form>

        <details className="mt-4 rounded-md border border-edge/70 bg-slate-900/35 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
            Advanced Tag Filters (Optional)
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Link
                  key={tag}
                  href={buildTagHref(tag, selectedTags, q)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all duration-200 ${
                    active
                      ? "border-sky-300 bg-sky-500/10 text-sky-200"
                      : "border-edge bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </details>
      </section>

      <p className="text-sm text-slate-300">
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

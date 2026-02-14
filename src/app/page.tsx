import Link from "next/link";
import Image from "next/image";
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
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Project portfolio</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-zinc-900 md:text-5xl">
              Dennis Joel Roman Salinas
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-700">
              CFD and aero simulation work—strong outcomes, clear visuals, and enough technical
              detail to show what I did without drowning you in it.
            </p>

            <div className="mt-5 space-y-2 text-sm text-zinc-700">
              <p><span className="font-semibold text-zinc-900">Focus:</span> CFD, V&V, automation, HPC</p>
              <p><span className="font-semibold text-zinc-900">Domains:</span> external aero, internal flows, multi-physics</p>
              <p><span className="font-semibold text-zinc-900">Tools:</span> Fluent, FENSAP-ICE, STAR-CCM+, OpenFOAM, Python, MATLAB, SLURM</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/resume" className="btn-secondary">
                Open Resume
              </Link>
            </div>
          </div>

          <div>
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
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="h2">Projects</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Browse below or use search; tag filters are optional.
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
            className="w-full rounded-md border border-edge bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-500 transition-all duration-200 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </form>

        <details className="mt-4 rounded-md border border-edge/90 bg-zinc-50 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
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
                      ? "border-zinc-800 bg-zinc-900 text-white"
                      : "border-edge bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </details>
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

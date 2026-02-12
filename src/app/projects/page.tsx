import Link from "next/link";
import type { Project } from "@/lib/project-types";
import { ProjectSection } from "@/components/project-section";
import { getAllProjects, getAllTags, filterProjects } from "@/lib/projects";

type SearchParams = {
  q?: string;
  tag?: string | string[];
  folder?: string;
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildProjectsHref(query: string, selectedTags: string[], folder?: string): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (folder) params.set("folder", folder);
  for (const value of selectedTags) params.append("tag", value);
  const queryString = params.toString();
  return `/projects${queryString ? `?${queryString}` : ""}`;
}

function buildTagHref(
  tag: string,
  selectedTags: string[],
  query: string,
  folder?: string
): string {
  const nextTags = selectedTags.includes(tag)
    ? selectedTags.filter((t) => t !== tag)
    : [...selectedTags, tag];
  return buildProjectsHref(query, nextTags, folder);
}

type CfdFolder = "FSAE" | "FPCS" | "CFD Lab" | "BTZCL" | "AMG";

type FolderConfig = {
  id: CfdFolder;
  title: string;
  blurb: string;
};

const CFD_FOLDER_CONFIG: FolderConfig[] = [
  {
    id: "FSAE",
    title: "HyTech Racing Formula SAE-EV Aerodynamics",
    blurb: "Formula SAE aerodynamic development and subsystem studies."
  },
  {
    id: "FPCS",
    title: "Flow Physics and Computational Science Lab",
    blurb: "IPW/FENSAP icing verification and reproducible pipeline projects."
  },
  {
    id: "CFD Lab",
    title: "Computational Fluid Dynamics Lab",
    blurb: "Course/lab-driven CFD studies and benchmark reproductions."
  },
  {
    id: "BTZCL",
    title: "Ben T. Zinn Combustion Lab",
    blurb: "Placeholder folder for reacting-flow and combustion-related projects."
  },
  {
    id: "AMG",
    title: "Aerodynamics Modeling Group",
    blurb: "Placeholder folder for aerodynamic modeling and reduced-order method projects."
  }
];

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

function classifyCfdFolder(project: Project): CfdFolder {
  const combined = [
    project.title,
    project.slug,
    project.domain,
    ...project.tags,
    ...project.tools
  ]
    .join(" ")
    .toLowerCase();

  const has = (terms: string[]) => terms.some((term) => combined.includes(term));

  if (has(["fsae", "hytech", "motorsport", "side-aero", "diffuser", "radiator"])) {
    return "FSAE";
  }

  if (has(["fpcs", "ipw", "icing", "rg-15", "rg15"])) {
    return "FPCS";
  }

  if (has(["cfd-lab", "lab", "assignment", "cornell simcafe", "ansys innovation"])) {
    return "CFD Lab";
  }

  return "CFD Lab";
}

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const projects = await getAllProjects();
  const tags = getAllTags(projects);
  const selectedTags = toArray(params.tag);
  const q = params.q ?? "";
  const hasSearchQuery = q.trim().length > 0;
  const hasActiveFilters = hasSearchQuery || selectedTags.length > 0;
  const filtered = filterProjects(projects, q, selectedTags);
  const cfdProjects = filtered.filter((project) => !isOtherProject(project));
  const otherProjects = filtered.filter((project) => isOtherProject(project));
  const cfdProjectsByFolder: Record<CfdFolder, Project[]> = {
    FSAE: [],
    FPCS: [],
    "CFD Lab": [],
    BTZCL: [],
    AMG: []
  };

  for (const project of cfdProjects) {
    cfdProjectsByFolder[classifyCfdFolder(project)].push(project);
  }

  const selectedFolder = CFD_FOLDER_CONFIG.find((folder) => folder.id === params.folder)?.id;

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <h1 className="h1">Projects</h1>
        <p className="mt-2 text-sm text-slate-300">
          Search is primary. Tools/stack are shown on cards. Tag filters are available below as
          optional dev-side filters.
        </p>

        <form action="/projects" method="get" className="mt-4">
          {selectedTags.map((tag) => (
            <input key={tag} type="hidden" name="tag" value={tag} />
          ))}
          {selectedFolder ? <input type="hidden" name="folder" value={selectedFolder} /> : null}
          <label htmlFor="q" className="sr-only">
            Search projects
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search: icing, diffuser, surrogate, OpenFOAM..."
            className="w-full rounded-md border border-edge bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </form>

        <details className="mt-4 rounded-md border border-edge/70 bg-slate-900/35 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
            Advanced Tag Filters (Search Helpers)
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Link
                  key={tag}
                  href={buildTagHref(tag, selectedTags, q, selectedFolder)}
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

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="h2">CFD Projects</h2>
          <p className="text-xs text-slate-300">
            {cfdProjects.length} project{cfdProjects.length === 1 ? "" : "s"}
          </p>
        </div>

        {selectedFolder ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-200">
                Open folder: <span className="font-semibold text-white">{selectedFolder}</span>
              </p>
              <Link
                href={buildProjectsHref(q, selectedTags)}
                className="btn-secondary"
              >
                Back to folders
              </Link>
            </div>
            <ProjectSection
              title={`${selectedFolder} Projects`}
              projects={cfdProjectsByFolder[selectedFolder]}
              emptyMessage={`No ${selectedFolder} projects match this filter yet.`}
            />
          </div>
        ) : hasActiveFilters ? (
          <ProjectSection
            title="Filtered Results"
            projects={cfdProjects}
            emptyMessage="No CFD projects match this filter yet."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CFD_FOLDER_CONFIG.map((folder) => (
              <Link
                key={folder.id}
                href={buildProjectsHref(q, selectedTags, folder.id)}
                className="surface-card lift block p-5"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Folder</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{folder.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{folder.blurb}</p>
                <p className="mt-4 text-xs text-slate-300">
                  {cfdProjectsByFolder[folder.id].length} project
                  {cfdProjectsByFolder[folder.id].length === 1 ? "" : "s"}
                </p>
                <span className="btn-primary mt-4 inline-flex">Open folder</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ProjectSection
        title="Other Projects"
        projects={otherProjects}
        emptyMessage="No other projects match this filter yet."
      />
    </div>
  );
}

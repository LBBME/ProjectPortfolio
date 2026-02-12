import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export default async function HomePage() {
  const projects = await getAllProjects();
  const featuredPriority = [
    "ipw-icing-verification-pipeline",
    "fsae-side-aero-diffuser-radiator-study",
    "aeroelastic-surrogate-delta-map-tool"
  ];

  const featuredFromPriority = featuredPriority
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  const featuredFallback = projects.filter(
    (project) => project.featured && !featuredPriority.includes(project.slug)
  );

  const featured = [...featuredFromPriority, ...featuredFallback].slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="panel p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-sky-300">CFD Project Portfolio</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Dennis Joel Roman Salinas
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-100">
              Aerospace engineering student building recruiter-ready CFD project workflows with
              strong verification, validation, and reproducibility discipline.
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-100">
              <p><span className="font-semibold text-white">Focus:</span> CFD, V&V, automation, HPC execution</p>
              <p><span className="font-semibold text-white">Domains:</span> external aerodynamics, internal flows, and multi-physics simulation workflows</p>
              <p><span className="font-semibold text-white">Tools:</span> Fluent, FENSAP-ICE, STAR-CCM+, OpenFOAM, Python, MATLAB, SLURM</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link href="/resume" className="btn-secondary">
                Open Resume
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Role Focus</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                Targeting CFD and aero simulation roles where V&V discipline and decision speed both matter.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">What Each Project Shows</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                Setup assumptions, solver workflow, validation checks, and reproducible post-processing outputs.
              </p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Current Project Tracks</p>
              <p className="mt-2 text-sm leading-7 text-slate-100">
                HyTech Racing Formula SAE-EV, Ben T. Zinn Combustion Lab, and the High Powered Electric Propulsion Lab.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="h2">Featured Projects</h2>
          <Link href="/projects" className="text-sm text-sky-200">
            See all projects
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} showImage />
          ))}
        </div>
        <div className="flex justify-center pt-3">
          <Link
            href="/projects"
            className="btn-primary px-8 py-3 text-base md:px-10 md:py-3.5 md:text-lg"
          >
            See more projects
          </Link>
        </div>
      </section>
    </div>
  );
}

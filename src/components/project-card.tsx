import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/project-types";

type ProjectCardProps = {
  project: Project;
  showImage?: boolean;
};

const PROJECT_IMAGE_MAP: Record<string, { src: string; alt: string }> = {
  "ipw-icing-verification-pipeline": {
    src: "/api/robotech-image/ipw-setup-geometry",
    alt: "IPW setup geometry and domain layout screenshot"
  },
  "rg15-ipw2-2d-reproduction-study": {
    src: "/api/robotech-image/rg15-7bin-plot",
    alt: "RG-15 IPW2 reproduction 7-bin freezing fraction and growth plots"
  },
  "convergent-divergent-nozzle-flow-lab": {
    src: "/api/robotech-image/nozzle-extra-1",
    alt: "Convergent-divergent nozzle Mach contour"
  },
  "blood-flow-2d-artery-stenosis-lab": {
    src: "/api/robotech-image/artery-extra-3",
    alt: "2D artery stenosis velocity vectors"
  },
  "transonic-naca0012-airfoil-lab": {
    src: "/api/robotech-image/transonic-extra-1",
    alt: "Transonic NACA 0012 velocity vectors"
  },
  "forced-convection-flat-plate-lab": {
    src: "/api/robotech-image/flat-plate-extra-2",
    alt: "Flat plate boundary-layer velocity vectors"
  },
  "aeroelastic-surrogate-delta-map-tool": {
    src: "/project-media/aeroelastic-surrogate/deflection-vs-scale.png",
    alt: "Aeroelastic surrogate deflection vs stiffness plot"
  },
  "vertical-axis-wind-turbine-mrf-lab": {
    src: "/api/robotech-image/vawt-4",
    alt: "VAWT velocity magnitude contour"
  },
  "transonic-onera-m6-wing-study": {
    src: "/api/robotech-image/onera-4",
    alt: "ONERA M6 transonic velocity vectors"
  },
  "supersonic-flow-over-a-wedge-lab": {
    src: "/api/robotech-image/wedge-5",
    alt: "Supersonic wedge Mach contour"
  },
  "cfd-lab-multi-case-benchmark-series": {
    src: "/api/robotech-image/transonic-extra-1",
    alt: "CFD lab multi-case benchmark visual summary"
  },
  "fpcs-lab-icing-verification-series": {
    src: "/api/robotech-image/ipw-setup-geometry",
    alt: "FPCS lab icing verification workflow visual summary"
  },
  "hytech-aerodynamics-development-series": {
    src: "/api/robotech-image/hytech-third-element-2",
    alt: "HyTech third-element optimization contour result"
  },
  "high-school-winglet-shape-vortex-study": {
    src: "/api/robotech-image/winglet-hs-2",
    alt: "High school winglet study vortex visualization screenshot"
  },
  "fsae-side-aero-diffuser-radiator-study": {
    src: "/api/robotech-image/fsae-endurance-1",
    alt: "HyTech Racing Formula SAE car on endurance track"
  },
  "robotech-pipe-builder": {
    src: "/api/robotech-image/robotech-new-1",
    alt: "RoboTech updated prototype thumbnail"
  }
};

export function ProjectCard({ project, showImage = false }: ProjectCardProps) {
  const image = PROJECT_IMAGE_MAP[project.slug];

  return (
    <article className="panel lift p-5">
      {showImage ? (
        <div className="relative mb-4 h-44 overflow-hidden rounded-lg border border-slate-500/60 bg-slate-900/60">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800/85 to-slate-700/70 text-center text-sm text-slate-300">
              Image placeholder
            </div>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="metric-badge">
          {project.domain}
        </span>
        <span className="metric-badge">
          {project.status}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-sm text-slate-200">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <p className="w-full text-xs uppercase tracking-[0.12em] text-slate-300">Tools / Stack</p>
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="rounded border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs text-slate-200"
          >
            {tool}
          </span>
        ))}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="btn-primary mt-5"
      >
        View project
      </Link>
    </article>
  );
}

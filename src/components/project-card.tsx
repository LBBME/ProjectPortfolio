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
    src: "/api/robotech-image/fsae-endurance-1",
    alt: "HyTech Racing Formula SAE car on endurance track"
  },
  "btzcl-reacting-counterflow-openfoam-pipeline": {
    src: "/api/robotech-image/btzcl-reacting-2",
    alt: "BTZCL reacting counterflow temperature field"
  },
  "mx5-amateur-motorsports-aero-development": {
    src: "/api/robotech-image/mx5-aero-4",
    alt: "Mazda MX-5 external aerodynamic contour visualization"
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
    <Link
      href={`/projects/${project.slug}`}
      className="panel lift block p-5 transition-opacity hover:opacity-[0.98] focus:opacity-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
    >
      {showImage ? (
        <div className="relative mb-4 h-44 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-center text-sm text-zinc-600">
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

      <h3 className="mt-3 text-xl font-semibold text-zinc-900">{project.title}</h3>
      <p className="mt-2 text-sm text-zinc-700">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <p className="w-full text-xs uppercase tracking-[0.12em] text-zinc-600">Tools / Stack</p>
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-700"
          >
            {tool}
          </span>
        ))}
      </div>

      <span className="btn-primary mt-5 inline-block">
        View project
      </span>
    </Link>
  );
}

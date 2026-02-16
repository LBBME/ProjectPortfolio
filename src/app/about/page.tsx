import Image from "next/image";

const ABOUT_SECTIONS = [
  {
    title: "Interdisciplinary Collaboration",
    body: "My strongest projects live at the intersection of aerodynamics, structures, and practical execution. I work comfortably with teammates who specialize in different areas and translate between technical viewpoints to keep decisions aligned and schedule-safe."
  },
  {
    title: "Leadership",
    body: "I have led sub-teams on fast iteration cycles where clarity matters more than noise. My style is direct and execution-focused: define the objective, lock assumptions, validate quickly, and communicate what changed and why."
  },
  {
    title: "Engineering Mindset",
    body: "I treat simulation as engineering evidence, not decoration. That means verification and validation are always part of the workflow: mesh discipline, monitor tracking, cross-checks against known behavior, and reproducible post-processing."
  },
  {
    title: "Independent Thinking",
    body: "I enjoy owning difficult technical loops end-to-end, from setup to analysis to decision support. I move quickly when working solo, but I still document methods so results remain useful to a team after the first pass."
  }
];

const COURSEWORK = [
  "Fluid and Thermodynamics",
  "Aerodynamics",
  "Jet and Rocket Propulsion",
  "Deformable Bodies",
  "Statics",
  "Dynamics",
  "Calculus I",
  "Calculus II",
  "Calculus III",
  "Differential Equations",
  "Aerospace Vehicle Performance"
];

export default function AboutPage() {
  return (
    <section className="space-y-8">
      <div className="panel p-6 md:p-8">
        <h1 className="h1">About</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-4 text-[1.08rem] leading-8 text-zinc-800">
            <p className="text-base font-semibold uppercase tracking-[0.14em] text-zinc-600">
              CFD | V&V | Aero Simulation
            </p>
            <p>
              I am Dennis Joel Román Salinas, a Puerto Rican BSMS Aerospace Engineering student at
              Georgia Tech focused on high-confidence simulation workflows in aerodynamics and
              fluid-thermal systems. I like work where the result is not just visually convincing,
              but technically defensible through checks, trends, and quantified comparisons.
            </p>
            <p>
              Across research labs, HyTech Racing, and teaching, I have developed an approach built
              on disciplined analysis and clear communication. My technical center of gravity is CFD,
              verification/validation, and automation-enabled iteration, with recurring work in
              aircraft icing, motorsport aerodynamics, and surrogate modeling.
            </p>
            <p>
              I am targeting CFD and aero simulation roles where reproducibility, speed, and
              decision quality all matter. For the full timeline, you can also view my{" "}
              <a
                href="https://www.linkedin.com/in/dennis-joel-roman-salinas-201325260/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-sky-700 underline decoration-sky-300/70 underline-offset-4 hover:text-sky-800"
              >
                LinkedIn profile
              </a>
              .
            </p>
          </div>

          <div className="relative mx-auto h-[26rem] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
            <Image
              src="/api/robotech-image/about-profile-alt"
              alt="Dennis Joel Román Salinas"
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 360px, 100vw"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ABOUT_SECTIONS.map((item) => (
          <article key={item.title} className="surface-card p-5">
            <h2 className="text-2xl font-semibold text-zinc-900">{item.title}</h2>
            <p className="mt-2 text-[1.01rem] leading-8 text-zinc-700">{item.body}</p>
          </article>
        ))}
      </div>

      <section className="surface-card p-5">
        <h2 className="text-2xl font-semibold text-zinc-900">Relevant Coursework</h2>
        <p className="mt-2 text-zinc-700">
          Core classes most relevant to my current CFD and simulation workflow:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COURSEWORK.map((course) => (
            <span key={course} className="metric-badge">
              {course}
            </span>
          ))}
        </div>
      </section>

    </section>
  );
}

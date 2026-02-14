import Image from "next/image";

const ABOUT_SECTIONS = [
  {
    title: "Working Across Disciplines",
    body: "My best work sits where aero, structures, and real-world execution meet. I’m comfortable teaming with people from different specialties and translating between them so we stay aligned and on schedule."
  },
  {
    title: "Leadership & Scouting",
    body: "I’ve been in Boy Scouts for a long time and have led sub-teams on fast iteration cycles where clarity matters more than noise. I keep things direct and execution-focused: nail the objective, lock assumptions, validate quickly, and say what changed and why."
  },
  {
    title: "Evidence-Based Engineering",
    body: "I treat simulation as engineering evidence, not eye candy. So verification and validation are always in the loop: mesh discipline, monitor tracking, cross-checks against known behavior, and post-processing you can rerun."
  },
  {
    title: "Owning the Full Loop",
    body: "I like owning hard technical problems end-to-end, from setup through analysis to decision support. I move fast on my own but still document how things were done so the team can use the results after I’m done."
  }
];

const AWARDS = [
  { term: "Fall 2024", honors: ["Dean's List", "Faculty Honors"] },
  { term: "Spring 2025", honors: ["Dean's List", "Faculty Honors"] },
  { term: "Summer 2025", honors: ["Dean's List", "Faculty Honors"] },
  { term: "Fall 2025", honors: ["Dean's List", "Faculty Honors"] }
];

const COURSEWORK = [
  "Thermodynamics and Fluids Fundamentals (AE 2010)",
  "Aerodynamics (AE 3030)",
  "Jet and Rocket Propulsion (AE 4451)",
  "Mechanics of Deformable Bodies (COE 3001)",
  "Statics (COE 2001)",
  "Dynamics of Rigid Bodies (ME 2202)",
  "Differential Calculus (MATH 1551)",
  "Integral Calculus (MATH 1552)",
  "Multivariable Calculus (MATH 2551)",
  "Differential Equations (MATH 2552)",
  "Introduction to Aerospace Vehicle Performance (AE 3330)",
  "Principles of Physics I (PHYS 2211)",
  "Principles of Physics II (PHYS 2212)",
  "Principles of General Chemistry for Engineers (CHEM 1310)",
  "Introduction to Engineering Graphics and Visualization (ME 1670)",
  "Principles and Applications of Engineering Materials (MSE 2001)",
  "Circuits and Electronics (ECE 3710)"
];

export default function AboutPage() {
  return (
    <section className="space-y-8">
      <div className="panel p-6 md:p-8">
        <h1 className="h1">About</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-4 text-[1.08rem] leading-8 text-zinc-800">
            <p className="text-base font-semibold uppercase tracking-[0.14em] text-zinc-600">
              CFD · V&V · Aero simulation
            </p>
            <p>
              I’m Dennis Joel Román Salinas, a Puerto Rican BSMS Aerospace Engineering student at
              Georgia Tech. I focus on simulation workflows where the answer isn’t just pretty; it holds
              up to checks, trends, and numbers. Aerodynamics and fluid-thermal systems are where I
              spend most of my time.
            </p>
            <p>
              Between research labs, HyTech Racing, and teaching, I’ve built a style that’s heavy on
              clear analysis and communication. My core is CFD, verification/validation, and
              automation so we can iterate fast, with real work in aircraft icing, motorsport aero,
              and surrogate modeling.
            </p>
            <p>
              I’m aiming for CFD and aero simulation roles where reproducibility, speed, and
              decision quality all matter. For the full timeline and experience, check my{" "}
              <a
                href="https://www.linkedin.com/in/dennis-joel-roman-salinas-201325260/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-sky-700 underline decoration-sky-300/70 underline-offset-4 hover:text-sky-800"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>

          <div className="relative mx-auto h-[26rem] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
            <Image
              src="/api/robotech-image/about-profile-alt"
              alt="Dennis Joel Roman Salinas"
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
        <h2 className="text-2xl font-semibold text-zinc-900">Awards</h2>
        <p className="mt-2 text-zinc-700">
          Dean’s List and Faculty Honors for every semester so far at Georgia Tech:
        </p>
        <ul className="mt-3 space-y-1 text-zinc-700">
          {AWARDS.map(({ term, honors }) => (
            <li key={term}>
              <span className="font-medium text-zinc-900">{term}:</span>{" "}
              {honors.join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-2xl font-semibold text-zinc-900">Relevant Coursework</h2>
        <p className="mt-2 text-zinc-700">
          Classes that feed into my CFD and simulation work (with GT course numbers where it helps):
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

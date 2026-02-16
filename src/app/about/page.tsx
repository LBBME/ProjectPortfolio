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

const AWARDS_TERMS = "Fall 2024, Spring 2025, Summer 2025, Fall 2025";
const AWARDS_HONORS = "Dean's List, Faculty Honors";

const COURSEWORK: { label: string; href: string }[] = [
  { label: "Thermodynamics and Fluids Fundamentals (AE 2010)", href: "https://catalog.gatech.edu/coursesaz/ae/" },
  { label: "Aerodynamics (AE 3030)", href: "https://catalog.gatech.edu/coursesaz/ae/" },
  { label: "Jet and Rocket Propulsion (AE 4451)", href: "https://catalog.gatech.edu/coursesaz/ae/" },
  { label: "Introduction to Aerospace Vehicle Performance (AE 3330)", href: "https://catalog.gatech.edu/coursesaz/ae/" },
  { label: "Mechanics of Deformable Bodies (COE 3001)", href: "https://catalog.gatech.edu/coursesaz/coe/" },
  { label: "Statics (COE 2001)", href: "https://catalog.gatech.edu/coursesaz/coe/" },
  { label: "Dynamics of Rigid Bodies (ME 2202)", href: "https://catalog.gatech.edu/coursesaz/me/" },
  { label: "Introduction to Engineering Graphics and Visualization (ME 1670)", href: "https://catalog.gatech.edu/coursesaz/me/" },
  { label: "Differential Calculus (MATH 1551)", href: "https://catalog.gatech.edu/coursesaz/math/" },
  { label: "Integral Calculus (MATH 1552)", href: "https://catalog.gatech.edu/coursesaz/math/" },
  { label: "Multivariable Calculus (MATH 2551)", href: "https://catalog.gatech.edu/coursesaz/math/" },
  { label: "Differential Equations (MATH 2552)", href: "https://catalog.gatech.edu/coursesaz/math/" },
  { label: "Principles of Physics I (PHYS 2211)", href: "https://catalog.gatech.edu/coursesaz/phys/" },
  { label: "Principles of Physics II (PHYS 2212)", href: "https://catalog.gatech.edu/coursesaz/phys/" },
  { label: "Principles of General Chemistry for Engineers (CHEM 1310)", href: "https://catalog.gatech.edu/coursesaz/chem/" },
  { label: "Principles and Applications of Engineering Materials (MSE 2001)", href: "https://catalog.gatech.edu/coursesaz/mse/" },
  { label: "Circuits and Electronics (ECE 3710)", href: "https://catalog.gatech.edu/coursesaz/ece/" },
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
              Between my multiple Georgia Tech Research Labs, HyTech Racing FSAE-EV, and personal projects, I've built a style that's heavy on clear analysis and communication. My core experiences are in CFD, verification/validation, and automation of these processes so we can iterate fast, with real work in airfoil analysis, motorsport aero, and alternative modeling. I'm aiming for CFD and aero simulation roles where reproducibility, speed, and decision quality all matter.
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
        <h2 className="text-2xl font-semibold text-zinc-900">Awards</h2>
        <p className="mt-2 text-zinc-700">
          <span className="font-medium text-zinc-900">{AWARDS_TERMS}:</span>{" "}
          {AWARDS_HONORS}
        </p>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-2xl font-semibold text-zinc-900">Relevant Coursework</h2>
        <p className="mt-2 text-zinc-700">
          Classes that feed into my CFD and simulation work. Click a course to open the Georgia Tech catalog for that subject:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COURSEWORK.map((course) => (
            <a
              key={course.label}
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className="metric-badge inline-block transition-colors hover:border-zinc-500 hover:bg-zinc-100"
            >
              {course.label}
            </a>
          ))}
        </div>
      </section>

    </section>
  );
}

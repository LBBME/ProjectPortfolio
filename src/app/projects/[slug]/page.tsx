import { notFound } from "next/navigation";
import { getRenderedProject } from "@/lib/projects";
import { ResultsGlance } from "@/components/results-glance";
import { Toc } from "@/components/toc";
import { mdxComponents } from "@/components/mdx-components";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rendered = await getRenderedProject(slug, mdxComponents);
  if (!rendered) notFound();

  const { project, content } = rendered;

  return (
    <div className="space-y-8">
      <header className="border-b border-zinc-200 pb-5">
        <p className="text-xs uppercase tracking-[0.13em] text-zinc-600">{project.domain}</p>
        <h1 className="h1 mt-2">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-zinc-700">{project.summary}</p>
        <p className="mt-3 max-w-3xl text-sm text-zinc-600">
          Public-facing brief: selected highlights only. Full setup decisions, trade studies, and internal
          reasoning are reserved for interview discussion.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span key={tool} className="metric-badge">
              {tool}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <article className="prose-cfd min-w-0">{content}</article>
        <div className="min-w-0 space-y-6 border-l border-zinc-200 pl-5 lg:sticky lg:top-24">
          <ResultsGlance items={project.results} />
          <Toc items={project.headings} />
        </div>
      </div>

      <div className="grid gap-8 border-t border-zinc-200 pt-6 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">Validation Signals</h2>
          <ul className="mt-3 space-y-3">
            {project.validation.map((item) => (
              <li key={item.check} className="border-l-2 border-zinc-300 pl-3">
                <p className="text-sm font-medium text-zinc-900">{item.check}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600">{item.status}</p>
                {item.note ? <p className="mt-1 text-sm text-zinc-600">{item.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">Reproducibility Signals</h2>
          <ul className="mt-3 space-y-3">
            {project.reproducibility.map((item) => (
              <li key={item.step} className="border-l-2 border-zinc-300 pl-3">
                <p className="text-sm font-medium text-zinc-900">{item.step}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

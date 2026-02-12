import type { ProjectResult } from "@/lib/project-types";

type ResultsGlanceProps = {
  items: ProjectResult[];
};

export function ResultsGlance({ items }: ResultsGlanceProps) {
  return (
    <aside className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-100">Results at a glance</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="border-l-2 border-cyan-300/70 pl-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{item.value}</p>
            {item.note ? <p className="mt-1 text-xs text-slate-300">{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

import type { ProjectResult } from "@/lib/project-types";

type ResultsGlanceProps = {
  items: ProjectResult[];
};

export function ResultsGlance({ items }: ResultsGlanceProps) {
  return (
    <aside className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900">Results at a glance</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="border-l-2 border-zinc-300 pl-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{item.value}</p>
            {item.note ? <p className="mt-1 text-xs text-zinc-600">{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

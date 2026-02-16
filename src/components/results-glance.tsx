import type { ProjectResult } from "@/lib/project-types";

type ResultsGlanceProps = {
  items: ProjectResult[];
};

export function ResultsGlance({ items }: ResultsGlanceProps) {
  return (
    <aside className="flex min-h-0 flex-col">
      <h2 className="shrink-0 text-lg font-semibold text-zinc-900">Results at a glance</h2>
      <ul
        className="mt-3 min-h-0 space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 scroll-smooth"
        style={{ maxHeight: "min(400px, 50vh)" }}
      >
        {items.map((item) => (
          <li key={item.label} className="shrink-0 border-l-2 border-zinc-300 pl-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{item.value}</p>
            {item.note ? <p className="mt-1 text-xs text-zinc-600">{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

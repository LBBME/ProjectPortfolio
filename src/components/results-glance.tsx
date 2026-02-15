import type { ProjectResult } from "@/lib/project-types";

type ResultsGlanceProps = {
  items: ProjectResult[];
};

export function ResultsGlance({ items }: ResultsGlanceProps) {
  return (
    <aside className="overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-3">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900">
          Results at a glance
        </h2>
      </div>
      <ul className="divide-y divide-zinc-100 p-3">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex flex-col gap-0.5 px-3 py-2.5 first:pt-2 last:pb-2"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {item.label}
            </p>
            <p className="text-xl font-bold tabular-nums text-zinc-900">{item.value}</p>
            {item.note ? (
              <p className="mt-0.5 text-xs leading-snug text-zinc-600">{item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}

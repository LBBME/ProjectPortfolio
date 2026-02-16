"use client";

import { usePathname } from "next/navigation";

type ProjectFiltersProps = {
  tags: string[];
  selectedTags: string[];
  initialQuery: string;
  searchPlaceholder?: string;
};

function buildTagHref(
  path: string,
  tag: string,
  selectedTags: string[],
  query: string
): string {
  const nextTags = selectedTags.includes(tag)
    ? selectedTags.filter((t) => t !== tag)
    : [...selectedTags, tag];

  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  for (const value of nextTags) params.append("tag", value);
  const queryString = params.toString();
  const base = path.replace(/\/$/, "") || "";
  return `${base}${queryString ? `?${queryString}` : ""}`;
}

export function ProjectFilters({
  tags,
  selectedTags,
  initialQuery,
  searchPlaceholder = "Search: icing, transonic, diffuser, surrogate, OpenFOAM..."
}: ProjectFiltersProps) {
  const pathname = usePathname() ?? "/";
  const basePath = pathname.replace(/\/projects\/?$/, "") || "/";
  const formAction = basePath === "/" ? "/" : "/projects";

  return (
    <section className="space-y-4">
      <form action={formAction} method="get">
        {selectedTags.map((tag) => (
          <input key={tag} type="hidden" name="tag" value={tag} />
        ))}
        <label htmlFor="q" className="sr-only">
          Search projects
        </label>
        <input
          id="q"
          name="q"
          defaultValue={initialQuery}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-edge bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-500 transition-all duration-200 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </form>

      <details className="rounded-md border border-edge/90 bg-zinc-50 px-3 py-2">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Advanced Tag Filters (Optional)
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <a
                key={tag}
                href={buildTagHref(formAction, tag, selectedTags, initialQuery)}
                className={`rounded-full border px-3 py-1 text-xs transition-all duration-200 ${
                  active
                    ? "border-zinc-800 bg-zinc-900 text-white"
                    : "border-edge bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                {tag}
              </a>
            );
          })}
        </div>
      </details>
    </section>
  );
}

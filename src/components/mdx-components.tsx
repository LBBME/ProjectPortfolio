import type { ReactNode } from "react";
import { ImageCarousel } from "@/components/image-carousel";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function flattenText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return `${children}`;
  if (Array.isArray(children)) return children.map(flattenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return flattenText((children as { props?: { children?: ReactNode } }).props?.children ?? "");
  }
  return "";
}

export const mdxComponents = {
  h2: ({ children }: { children: ReactNode }) => {
    const text = flattenText(children);
    const id = slugify(text);
    return (
      <h2 id={id} className="scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }: { children: ReactNode }) => {
    const text = flattenText(children);
    const id = slugify(text);
    return (
      <h3 id={id} className="scroll-mt-20">
        {children}
      </h3>
    );
  },
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="rounded-md border-l-4 border-blue-300 bg-slate-900/70 p-3 text-slate-200">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children: ReactNode; href?: string }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
      className="font-medium text-blue-300 underline decoration-blue-400/50 underline-offset-4 transition-colors hover:text-blue-200"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? "project image"}
      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/70 object-cover shadow-md"
      loading="lazy"
    />
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="rounded bg-slate-900 px-1 py-0.5 text-sky-200">{children}</code>
  ),
  details: ({ children }: { children: ReactNode }) => (
    <details className="my-3 rounded-lg border border-slate-700/80 bg-slate-900/70 p-4">
      {children}
    </details>
  ),
  summary: ({ children }: { children: ReactNode }) => (
    <summary className="cursor-pointer text-sm font-semibold text-slate-100">{children}</summary>
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border border-slate-500/50 bg-slate-900/55">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm text-slate-100">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-slate-800/85 text-slate-50">{children}</thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => (
    <tbody className="[&_tr:nth-child(even)]:bg-slate-800/35">{children}</tbody>
  ),
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="border-t border-slate-600/50">{children}</tr>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 whitespace-normal">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-3 py-2 align-top text-slate-100 break-words">{children}</td>
  ),
  ImageCarousel
};

import type { ReactNode } from "react";
import { ImageCarouselBridge } from "@/components/image-carousel-bridge";

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
    <blockquote className="rounded-md border-l-4 border-zinc-300 bg-zinc-100 p-3 text-zinc-800">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children: ReactNode; href?: string }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
      className="font-medium text-sky-700 underline decoration-sky-300/70 underline-offset-4 transition-colors hover:text-sky-800"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? "project image"}
      className="w-full rounded-xl border border-zinc-200 bg-white object-cover shadow-md"
      loading="lazy"
    />
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-800">{children}</code>
  ),
  details: ({ children }: { children: ReactNode }) => (
    <details className="my-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      {children}
    </details>
  ),
  summary: ({ children }: { children: ReactNode }) => (
    <summary className="cursor-pointer text-sm font-semibold text-zinc-900">{children}</summary>
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm text-zinc-800">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: ReactNode }) => (
    <thead className="bg-zinc-100 text-zinc-900">{children}</thead>
  ),
  tbody: ({ children }: { children: ReactNode }) => (
    <tbody className="[&_tr:nth-child(even)]:bg-zinc-50">{children}</tbody>
  ),
  tr: ({ children }: { children: ReactNode }) => (
    <tr className="border-t border-zinc-200">{children}</tr>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-900 whitespace-normal">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-3 py-2 align-top text-zinc-800 break-words">{children}</td>
  ),
  ImageCarousel: ImageCarouselBridge
};

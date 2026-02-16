type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type TocProps = {
  items: TocItem[];
};

export function Toc({ items }: TocProps) {
  if (items.length === 0) return null;

  return (
    <aside>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">Contents</h2>
      <ul className="mt-3 max-h-[45vh] space-y-2 overflow-auto pr-1 text-sm scroll-smooth overscroll-contain">
        {items.map((item) => (
          <li key={`${item.id}-${item.level}`}>
            <a
              href={`#${item.id}`}
              className="inline-flex border-l border-transparent px-2 py-0.5 text-zinc-600 transition-colors duration-200 hover:border-zinc-400 hover:text-zinc-900"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

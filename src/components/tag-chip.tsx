type TagChipProps = {
  label: string;
  active?: boolean;
  href?: string;
};

export function TagChip({ label, active = false, href }: TagChipProps) {
  const classes = `inline-flex rounded-full border px-3 py-1 text-xs transition-all duration-200 ${
    active
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-edge bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
  }`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }

  return <span className={classes}>{label}</span>;
}

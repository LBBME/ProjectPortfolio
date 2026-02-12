type TagChipProps = {
  label: string;
  active?: boolean;
  href?: string;
};

export function TagChip({ label, active = false, href }: TagChipProps) {
  const classes = `inline-flex rounded-full border px-3 py-1 text-xs transition-all duration-200 ${
    active
      ? "border-sky-300 bg-sky-400/10 text-sky-200"
      : "border-edge bg-slate-900/40 text-slate-300 hover:border-slate-500 hover:text-white"
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

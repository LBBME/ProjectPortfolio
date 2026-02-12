import Link from "next/link";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge/80 bg-ink/80 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide text-slate-100 transition-colors hover:text-sky-200">
          Dennis Román | Project Portfolio
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-200">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

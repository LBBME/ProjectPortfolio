export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50/95">
      <div className="container-shell grid gap-6 py-8 text-sm text-zinc-700 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-zinc-900">Contact</p>
          <p className="mt-2">droman30@gatech.edu</p>
          <p className="mt-1">(787) 477-4989</p>
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-900">Location</p>
          <p className="mt-2">Atlanta, GA</p>
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-900">LinkedIn</p>
          <a
            href="https://www.linkedin.com/in/dennis-joel-roman-salinas-201325260/"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-sky-700 underline decoration-sky-300/80 underline-offset-4 hover:text-sky-800"
          >
            /in/dennis-joel-roman-salinas-201325260
          </a>
        </div>
      </div>

      <div className="container-shell border-t border-zinc-200 py-3 text-xs text-zinc-500">
        CFD portfolio focused on verification, validation, and reproducibility.
      </div>
    </footer>
  );
}

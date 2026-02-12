export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-500/50 bg-slate-950/55">
      <div className="container-shell grid gap-6 py-8 text-sm text-slate-300 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-slate-100">Contact</p>
          <p className="mt-2">droman30@gatech.edu</p>
          <p className="mt-1">(787) 477-4989</p>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-100">Location</p>
          <p className="mt-2">Atlanta, GA</p>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-100">LinkedIn</p>
          <a
            href="https://www.linkedin.com/in/dennis-joel-roman-salinas-201325260/"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block text-cyan-100 underline decoration-cyan-300/70 underline-offset-4 hover:text-white"
          >
            /in/dennis-joel-roman-salinas-201325260
          </a>
        </div>
      </div>

      <div className="container-shell border-t border-slate-600/60 py-3 text-xs text-slate-400">
        CFD portfolio focused on verification, validation, and reproducibility.
      </div>
    </footer>
  );
}

import { ResumeDocumentClient } from "@/components/resume-document-client";

export default function ResumePage() {
  return (
    <section className="space-y-4">
      <h1 className="h1">Resume</h1>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <a
          href="/api/resume?download=1"
          className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          download
        >
          Download PDF
        </a>
        <a
          href="/api/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Open in new tab
        </a>
      </div>

      <noscript>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Inline viewer needs JavaScript. Use the buttons above to open or download the resume.
        </p>
      </noscript>

      <div className="min-h-[480px]">
        <ResumeDocumentClient fileUrl="/api/resume" />
      </div>
    </section>
  );
}

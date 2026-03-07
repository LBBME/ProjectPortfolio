import { ResumeDocumentClient } from "@/components/resume-document-client";
import { DownloadPdfButton } from "@/components/download-pdf-button";

export default function ResumePage() {
  return (
    <section className="space-y-4">
      <h1 className="h1">Resume</h1>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <DownloadPdfButton
          url="/api/resume?download=1"
          filename="Dennis_Roman_Resume.pdf"
          className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Download PDF
        </DownloadPdfButton>
        <a
          href="/api/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Open in new tab
        </a>
        <DownloadPdfButton
          url="/api/portfolio"
          filename="Dennis_Roman_Project_Portfolio.pdf"
          className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Download portfolio PDF
        </DownloadPdfButton>
      </div>

      <noscript>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Inline viewer needs JavaScript. Use the buttons above to open or download the resume.
        </p>
      </noscript>

      <ResumeDocumentClient fileUrl="/resume/resume.pdf" />
    </section>
  );
}

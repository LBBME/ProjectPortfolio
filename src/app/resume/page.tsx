import { ResumeDocumentClient } from "@/components/resume-document-client";

export default function ResumePage() {
  return (
    <section className="space-y-4">
      <h1 className="h1">Resume</h1>
      <ResumeDocumentClient fileUrl="/resume/resume.pdf" />
    </section>
  );
}

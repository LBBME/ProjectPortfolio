"use client";

import dynamic from "next/dynamic";

type ResumeDocumentClientProps = {
  fileUrl: string;
};

const ResumeDocument = dynamic(
  () => import("@/components/resume-document").then((mod) => mod.ResumeDocument),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-slate-500/60 bg-slate-900/55 p-6 text-center text-slate-300">
        Loading resume...
      </div>
    )
  }
);

export function ResumeDocumentClient({ fileUrl }: ResumeDocumentClientProps) {
  return <ResumeDocument fileUrl={fileUrl} />;
}

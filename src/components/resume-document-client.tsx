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
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-zinc-600">
        Loading resume...
      </div>
    )
  }
);

export function ResumeDocumentClient({ fileUrl }: ResumeDocumentClientProps) {
  return <ResumeDocument fileUrl={fileUrl} />;
}

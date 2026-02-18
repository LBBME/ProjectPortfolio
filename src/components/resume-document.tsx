"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";

// Keep worker/API versions in lockstep to avoid runtime mismatch warnings.
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ResumeDocumentProps = {
  fileUrl: string;
};

export function ResumeDocument({ fileUrl }: ResumeDocumentProps) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setContainerWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pageWidth = useMemo(() => {
    if (!containerWidth) return 900;
    return Math.min(1100, Math.max(320, containerWidth - 24));
  }, [containerWidth]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="inline-block rounded-xl border border-zinc-200 bg-white p-3">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
          loading={<p className="p-6 text-center text-zinc-600">Loading resume...</p>}
          error={<p className="p-6 text-center text-rose-600">Failed to load resume.</p>}
        >
          <div className="flex flex-col items-center gap-4">
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`resume-page-${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={true}
                className="overflow-hidden rounded-md border border-zinc-300 shadow-md"
              />
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}

"use client";

type Props = {
  url: string;
  filename: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Programmatic download via fetch+blob. Works reliably on Safari/Mac
 * where the native download attribute is often ignored for PDFs.
 */
export function DownloadPdfButton({ url, filename, children, className }: Props) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

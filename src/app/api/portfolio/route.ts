import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export const runtime = "nodejs";

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const LINE_HEIGHT = 6;

const ASSETS_DIR = path.join(process.cwd(), "assets");
const LOCAL_DEV_ASSETS_DIR =
  "/Users/dennisroman/.cursor/projects/Users-dennisroman-Documents-Website/assets";

// Minimal mapping of key projects to hero images used elsewhere in the site.
const PROJECT_IMAGE_KEYS: Record<string, string> = {
  "hytech-aerodynamics-development-series": "fsae-endurance-1",
  "fpcs-lab-icing-verification-series": "ipw-setup-geometry",
  "btzcl-reacting-counterflow-openfoam-pipeline": "btzcl-reacting-2",
  "cfd-lab-multi-case-benchmark-series": "transonic-extra-1",
  "mx5-amateur-motorsports-aero-development": "mx5-aero-4"
};

// Mirror of the subset from /api/robotech-image/[image]/route.ts
const IMAGE_FILE_MAP: Record<string, string> = {
  "fsae-endurance-1": "endurance-c942a0e2-d528-4689-8d31-d0f75989da81.png",
  "ipw-setup-geometry": "Screenshot_2026-02-11_at_11.29.01_PM-9abf8a54-f317-437e-a8a0-555a06c0d16c.png",
  "btzcl-reacting-2": "Screenshot_2026-02-14_at_4.55.00_PM-77b313e0-7fbc-4b6e-b84f-6ce1aa6f33a3.png",
  "transonic-extra-1": "Screenshot_2026-02-11_at_7.31.34_PM-288f242d-a5f1-4e34-ac83-e9cf6a92ad6e.png",
  "mx5-aero-4": "Screenshot_2026-02-14_at_5.49.30_PM-1c9ccb5f-5a85-4184-a50c-8e21aeaa88e9.png"
};

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

async function loadProjectImageBase64(slug: string): Promise<{ base64: string; format: "PNG" | "JPEG" } | null> {
  const key = PROJECT_IMAGE_KEYS[slug];
  if (!key) return null;

  const fileName = IMAGE_FILE_MAP[key];
  if (!fileName) return null;

  const candidates = [
    path.join(ASSETS_DIR, fileName),
    path.join(LOCAL_DEV_ASSETS_DIR, fileName)
  ];

  for (const absolutePath of candidates) {
    try {
      const data = await fs.readFile(absolutePath);
      const ext = path.extname(fileName).toLowerCase();
      const format: "PNG" | "JPEG" = ext === ".jpg" || ext === ".jpeg" ? "JPEG" : "PNG";
      return { base64: data.toString("base64"), format };
    } catch {
      // try next candidate
    }
  }

  return null;
}

async function renderPortfolio(doc: jsPDF, projects: Project[]) {
  const maxW = PAGE_W - 2 * MARGIN;
  let y = MARGIN;

  doc.setFontSize(22);
  doc.text("Dennis Román - Project Portfolio", PAGE_W / 2, y, { align: "center" });
  y += 12;

  doc.setFontSize(11);
  doc.text("CFD, simulation, and experimental infrastructure work", PAGE_W / 2, y, {
    align: "center"
  });
  y += 16;

  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  for (const [index, project] of projects.entries()) {
    if (index > 0) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text(project.domain, MARGIN, y);
    doc.text(`Status: ${project.status}`, PAGE_W - MARGIN, y, { align: "right" });
    y += LINE_HEIGHT + 2;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const titleLines = wrapText(doc, project.title, maxW);
    doc.text(titleLines, MARGIN, y);
    y += titleLines.length * LINE_HEIGHT + 4;

    // Optional hero image for visually rich projects.
    const image = await loadProjectImageBase64(project.slug);
    if (image) {
      const imgWidth = maxW;
      const imgHeight = 55;
      // Ensure there is enough space; otherwise start a new page.
      if (y + imgHeight + 6 > PAGE_H - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
      doc.addImage(image.base64, image.format, MARGIN, y, imgWidth, imgHeight);
      y += imgHeight + 6;
    }

    doc.setFontSize(11);

    const summaryLines = wrapText(doc, project.summary, maxW);
    doc.text(summaryLines, MARGIN, y);
    y += summaryLines.length * LINE_HEIGHT + 8;

    if (project.tools?.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Tools / stack:", MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      const toolsLines = wrapText(doc, project.tools.join(", "), maxW);
      doc.text(toolsLines, MARGIN, y);
      y += toolsLines.length * LINE_HEIGHT + 6;
    }

    if (project.results?.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Results at a glance", MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      for (const result of project.results) {
        const line = `• ${result.label}: ${result.value}`;
        const lines = wrapText(doc, line, maxW);
        doc.text(lines, MARGIN, y);
        y += lines.length * LINE_HEIGHT;
      }
      y += 4;
    }

    if (project.validation?.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Validation signals", MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      for (const item of project.validation) {
        const line = `• [${item.status}] ${item.check}`;
        const lines = wrapText(doc, line, maxW);
        doc.text(lines, MARGIN, y);
        y += lines.length * LINE_HEIGHT;
      }
      y += 4;
    }

    if (project.reproducibility?.length) {
      doc.setFont("helvetica", "bold");
      doc.text("Reproducibility signals", MARGIN, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      for (const step of project.reproducibility) {
        const line = `• ${step.step}: ${step.detail}`;
        const lines = wrapText(doc, line, maxW);
        doc.text(lines, MARGIN, y);
        y += lines.length * LINE_HEIGHT;
      }
    }
  }
}

export async function GET(_request: NextRequest) {
  const projects = await getAllProjects();
  const doc = new jsPDF({ format: "a4", unit: "mm" });

  await renderPortfolio(doc, projects);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Dennis_Roman_Project_Portfolio.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}

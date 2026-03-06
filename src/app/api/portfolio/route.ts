import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export const runtime = "nodejs";

const MARGIN = 20;
const PAGE_W = 210;
const LINE_HEIGHT = 6;

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

function renderPortfolio(doc: jsPDF, projects: Project[]) {
  const maxW = PAGE_W - 2 * MARGIN;
  let y = MARGIN;

  doc.setFontSize(22);
  doc.text("Dennis Román - Project Portfolio", PAGE_W / 2, y, { align: "center" });
  y += 12;

  doc.setFontSize(11);
  doc.text("CFD, simulation, and experimental infrastructure work", PAGE_W / 2, y, {
    align: "center"
  });
  y += 20;

  for (const [index, project] of projects.entries()) {
    if (index > 0) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const titleLines = wrapText(doc, project.title, maxW);
    doc.text(titleLines, MARGIN, y);
    y += titleLines.length * LINE_HEIGHT + 4;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`${project.domain} • ${project.status}`, MARGIN, y);
    doc.setTextColor(0, 0, 0);
    y += LINE_HEIGHT + 6;

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
      doc.text("Results at a glance:", MARGIN, y);
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
      doc.text("Validation signals:", MARGIN, y);
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
      doc.text("Reproducibility signals:", MARGIN, y);
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

  renderPortfolio(doc, projects);

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

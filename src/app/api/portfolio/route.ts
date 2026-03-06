import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  const projects = await getAllProjects();

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });

  renderPortfolio(doc, projects);
  doc.end();

  const pdfBuffer = await done;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Dennis_Roman_Project_Portfolio.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function renderPortfolio(doc: PDFKit.PDFDocument, projects: Project[]) {
  doc.fontSize(22).text("Dennis Román - Project Portfolio", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(11).text("CFD, simulation, and experimental infrastructure work", {
    align: "center"
  });
  doc.moveDown(1.5);

  for (const [index, project] of projects.entries()) {
    if (index > 0) {
      doc.addPage();
    }

    doc.fontSize(16).text(project.title, { underline: false });
    doc.moveDown(0.25);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`${project.domain} • ${project.status}`, { align: "left" });

    doc.moveDown(0.5);

    doc.fillColor("black").fontSize(11).text(project.summary, {
      align: "left"
    });

    doc.moveDown(0.5);

    if (project.tools?.length) {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Tools / stack:", { continued: true })
        .font("Helvetica")
        .text(` ${project.tools.join(", ")}`);
      doc.moveDown(0.4);
    }

    if (project.results?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Results at a glance:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const result of project.results) {
        doc.text(`• ${result.label}: ${result.value}`);
      }
      doc.moveDown(0.4);
    }

    if (project.validation?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Validation signals:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const item of project.validation) {
        doc.text(`• [${item.status}] ${item.check}`);
      }
      doc.moveDown(0.4);
    }

    if (project.reproducibility?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Reproducibility signals:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const step of project.reproducibility) {
        doc.text(`• ${step.step}: ${step.detail}`);
      }
      doc.moveDown(0.4);
    }
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  const projects = await getAllProjects();

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });

  renderPortfolio(doc, projects);
  doc.end();

  const pdfBuffer = await done;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Dennis_Roman_Project_Portfolio.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function renderPortfolio(doc: PDFKit.PDFDocument, projects: Project[]) {
  doc.fontSize(22).text("Dennis Román - Project Portfolio", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(11).text("CFD, simulation, and experimental infrastructure work", {
    align: "center"
  });
  doc.moveDown(1.5);

  for (const [index, project] of projects.entries()) {
    if (index > 0) {
      doc.addPage();
    }

    doc.fontSize(16).text(project.title, { underline: false });
    doc.moveDown(0.25);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`${project.domain} • ${project.status}`, { align: "left" });

    doc.moveDown(0.5);

    doc.fillColor("black").fontSize(11).text(project.summary, {
      align: "left"
    });

    doc.moveDown(0.5);

    if (project.tools?.length) {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Tools / stack:", { continued: true })
        .font("Helvetica")
        .text(` ${project.tools.join(", ")}`);
      doc.moveDown(0.4);
    }

    if (project.results?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Results at a glance:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const result of project.results) {
        doc.text(`• ${result.label}: ${result.value}`);
      }
      doc.moveDown(0.4);
    }

    if (project.validation?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Validation signals:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const item of project.validation) {
        doc.text(`• [${item.status}] ${item.check}`);
      }
      doc.moveDown(0.4);
    }

    if (project.reproducibility?.length) {
      doc.fontSize(10).font("Helvetica-Bold").text("Reproducibility signals:");
      doc.moveDown(0.15);
      doc.font("Helvetica");
      for (const step of project.reproducibility) {
        doc.text(`• ${step.step}: ${step.detail}`);
      }
      doc.moveDown(0.4);
    }
  }
}


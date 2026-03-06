import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/project-types";

export const runtime = "nodejs";

const MARGIN = 40; // points
const LINE_HEIGHT = 14;

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
  "ipw-setup-geometry":
    "Screenshot_2026-02-11_at_11.29.01_PM-9abf8a54-f317-437e-a8a0-555a06c0d16c.png",
  "btzcl-reacting-2":
    "Screenshot_2026-02-14_at_4.55.00_PM-77b313e0-7fbc-4b6e-b84f-6ce1aa6f33a3.png",
  "transonic-extra-1":
    "Screenshot_2026-02-11_at_7.31.34_PM-288f242d-a5f1-4e34-ac83-e9cf6a92ad6e.png",
  "mx5-aero-4": "Screenshot_2026-02-14_at_5.49.30_PM-1c9ccb5f-5a85-4184-a50c-8e21aeaa88e9.png"
};

type LoadedImage = {
  data: Uint8Array;
  ext: ".png" | ".jpg" | ".jpeg";
};

async function loadProjectImage(slug: string): Promise<LoadedImage | null> {
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
      const ext = path.extname(fileName).toLowerCase() as LoadedImage["ext"];
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        return { data: new Uint8Array(data), ext };
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

function drawWrappedText(options: {
  page: import("pdf-lib").PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: import("pdf-lib").PDFFont;
  size: number;
  lineHeight: number;
}) {
  const { page, text, x, maxWidth, font, size, lineHeight } = options;
  let { y } = options;

  const words = text.split(/\s+/);
  let currentLine = "";

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(next, size);
    if (width > maxWidth && currentLine) {
      page.drawText(currentLine, { x, y, size, font });
      y -= lineHeight;
      currentLine = word;
    } else {
      currentLine = next;
    }
  }

  if (currentLine) {
    page.drawText(currentLine, { x, y, size, font });
    y -= lineHeight;
  }

  return y;
}

async function renderProjectPage(
  pdfDoc: PDFDocument,
  project: Project,
  sharedImages: Map<string, LoadedImage>
) {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const contentWidth = width - 2 * MARGIN;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - MARGIN;

  // Header
  page.drawText("Dennis Román - Project Portfolio", {
    x: MARGIN,
    y,
    size: 18,
    font: fontBold
  });
  y -= 20;

  page.drawText("CFD, simulation, and experimental infrastructure work", {
    x: MARGIN,
    y,
    size: 11,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25)
  });
  y -= 24;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: width - MARGIN, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });
  y -= 20;

  // Domain + status line
  page.drawText(project.domain, {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.25, 0.25, 0.25)
  });

  const statusText = `Status: ${project.status}`;
  const statusWidth = fontRegular.widthOfTextAtSize(statusText, 11);
  page.drawText(statusText, {
    x: width - MARGIN - statusWidth,
    y,
    size: 11,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25)
  });
  y -= 18;

  // Title
  y = drawWrappedText({
    page,
    text: project.title,
    x: MARGIN,
    y,
    maxWidth: contentWidth,
    font: fontBold,
    size: 16,
    lineHeight: LINE_HEIGHT
  });
  y -= 4;

  // Optional hero image
  const imageKey = PROJECT_IMAGE_KEYS[project.slug];
  if (imageKey) {
    let loaded = sharedImages.get(imageKey);
    if (!loaded) {
      const fromDisk = await loadProjectImage(project.slug);
      if (fromDisk) {
        loaded = fromDisk;
        sharedImages.set(imageKey, fromDisk);
      }
    }

    if (loaded) {
      const embedded =
        loaded.ext === ".png"
          ? await pdfDoc.embedPng(loaded.data)
          : await pdfDoc.embedJpg(loaded.data);

      const imgDims = embedded.scaleToFit(contentWidth, 150);
      page.drawImage(embedded, {
        x: MARGIN,
        y: y - imgDims.height,
        width: imgDims.width,
        height: imgDims.height
      });
      y -= imgDims.height + 16;
    }
  }

  // Summary
  y = drawWrappedText({
    page,
    text: project.summary,
    x: MARGIN,
    y,
    maxWidth: contentWidth,
    font: fontRegular,
    size: 11,
    lineHeight: LINE_HEIGHT
  });
  y -= 6;

  // Tools
  if (project.tools?.length) {
    page.drawText("Tools / stack", {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold
    });
    y -= LINE_HEIGHT;

    y = drawWrappedText({
      page,
      text: project.tools.join(", "),
      x: MARGIN,
      y,
      maxWidth: contentWidth,
      font: fontRegular,
      size: 10,
      lineHeight: LINE_HEIGHT
    });
    y -= 4;
  }

  // Results
  if (project.results?.length) {
    page.drawText("Results at a glance", {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold
    });
    y -= LINE_HEIGHT;

    for (const result of project.results) {
      const line = `• ${result.label}: ${result.value}`;
      y = drawWrappedText({
        page,
        text: line,
        x: MARGIN,
        y,
        maxWidth: contentWidth,
        font: fontRegular,
        size: 10,
        lineHeight: LINE_HEIGHT
      });
    }
    y -= 4;
  }

  // Validation
  if (project.validation?.length) {
    page.drawText("Validation signals", {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold
    });
    y -= LINE_HEIGHT;

    for (const item of project.validation) {
      const line = `• [${item.status}] ${item.check}`;
      y = drawWrappedText({
        page,
        text: line,
        x: MARGIN,
        y,
        maxWidth: contentWidth,
        font: fontRegular,
        size: 10,
        lineHeight: LINE_HEIGHT
      });
    }
    y -= 4;
  }

  // Reproducibility
  if (project.reproducibility?.length) {
    page.drawText("Reproducibility signals", {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold
    });
    y -= LINE_HEIGHT;

    for (const step of project.reproducibility) {
      const line = `• ${step.step}: ${step.detail}`;
      y = drawWrappedText({
        page,
        text: line,
        x: MARGIN,
        y,
        maxWidth: contentWidth,
        font: fontRegular,
        size: 10,
        lineHeight: LINE_HEIGHT
      });
    }
  }
}

export async function GET(_request: NextRequest) {
  const projects = await getAllProjects();
  const pdfDoc = await PDFDocument.create();

  const sharedImages = new Map<string, LoadedImage>();

  for (const project of projects) {
    await renderProjectPage(pdfDoc, project, sharedImages);
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Dennis_Roman_Project_Portfolio.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}

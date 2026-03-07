import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
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

/** Normalize image to JPEG so pdf-lib can embed it (avoids PNG parser issues). */
async function normalizeImageForPdf(loaded: LoadedImage): Promise<Uint8Array | null> {
  try {
    const jpeg = await sharp(loaded.data)
      .resize(1200, 800, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    return new Uint8Array(jpeg);
  } catch (e) {
    console.warn("[portfolio] sharp normalize failed:", e instanceof Error ? e.message : String(e));
    return null;
  }
}

/** Fetch image from the app's own API (same source as the site). */
async function loadProjectImageFromApi(
  imageKey: string,
  baseUrl: string
): Promise<LoadedImage | null> {
  const url = `${baseUrl}/api/robotech-image/${imageKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[portfolio] API image failed: ${imageKey} ${url} → ${res.status}`);
      return null;
    }
    const buf = await res.arrayBuffer();
    const data = new Uint8Array(buf);
    const contentType = res.headers.get("content-type") ?? "";
    const ext: LoadedImage["ext"] =
      contentType.includes("jpeg") || contentType.includes("jpg")
        ? ".jpg"
        : ".png";
    return { data, ext };
  } catch (e) {
    console.warn(`[portfolio] API image fetch error: ${imageKey} ${url}`, e);
    return null;
  }
}

async function loadProjectImage(
  imageKey: string,
  baseUrl?: string
): Promise<LoadedImage | null> {
  const fileName = IMAGE_FILE_MAP[imageKey];
  if (!fileName) {
    console.warn(`[portfolio] No file mapping for imageKey: ${imageKey}`);
    return null;
  }

  const candidates: { path: string; label: string }[] = [
    { path: path.join(ASSETS_DIR, fileName), label: "assets" },
    { path: path.join(LOCAL_DEV_ASSETS_DIR, fileName), label: "local-dev" }
  ];

  for (const { path: absolutePath, label } of candidates) {
    try {
      const data = await fs.readFile(absolutePath);
      const ext = path.extname(fileName).toLowerCase() as LoadedImage["ext"];
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        if (data.length === 0) {
          console.warn(`[portfolio] Empty file (${label}): ${imageKey} → ${absolutePath}`);
          continue;
        }
        console.log(`[portfolio] Image loaded from disk (${label}): ${imageKey} (${data.length} bytes)`);
        return { data: new Uint8Array(data), ext };
      }
    } catch (e) {
      console.log(`[portfolio] Disk miss (${label}): ${imageKey} → ${absolutePath}`);
    }
  }

  // On Vercel, Deployment Protection returns 401 for same-origin fetch; skip API fallback.
  if (baseUrl && process.env.VERCEL !== "1") {
    const fromApi = await loadProjectImageFromApi(imageKey, baseUrl);
    if (fromApi) console.log(`[portfolio] Image loaded from API: ${imageKey}`);
    return fromApi;
  }
  if (!baseUrl) console.warn(`[portfolio] Image not found (no baseUrl): ${imageKey}`);
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
  sharedImages: Map<string, LoadedImage>,
  baseUrl: string
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
      const fromDisk = await loadProjectImage(imageKey, baseUrl);
      if (fromDisk) {
        loaded = fromDisk;
        sharedImages.set(imageKey, fromDisk);
      }
    }

    if (loaded) {
      try {
        const jpegData = await normalizeImageForPdf(loaded);
        if (jpegData) {
          const embedded = await pdfDoc.embedJpg(jpegData);
          const imgDims = embedded.scaleToFit(contentWidth, 150);
          page.drawImage(embedded, {
            x: MARGIN,
            y: y - imgDims.height,
            width: imgDims.width,
            height: imgDims.height
          });
          y -= imgDims.height + 16;
        }
      } catch (e) {
        console.warn(
          `[portfolio] Embed failed for ${imageKey} (${project.slug}):`,
          e instanceof Error ? e.message : String(e)
        );
      }
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

/** Run image load diagnostics for troubleshooting; returns JSON. */
async function runImageDiagnostics(
  baseUrl: string
): Promise<{
  baseUrl: string;
  cwd: string;
  summary: string;
  howToFix: string[];
  usage: string;
  images: Record<string, unknown>[];
}> {
  const projects = await getAllProjects();
  const cwd = process.cwd();
  const results: Record<string, unknown>[] = [];
  const howToFix: string[] = [];

  for (const project of projects) {
    const imageKey = PROJECT_IMAGE_KEYS[project.slug];
    if (!imageKey) {
      results.push({ slug: project.slug, imageKey: null, source: "none", note: "no hero image" });
      continue;
    }

    const fileName = IMAGE_FILE_MAP[imageKey];
    const path1 = path.join(ASSETS_DIR, fileName ?? "");
    const path2 = path.join(LOCAL_DEV_ASSETS_DIR, fileName ?? "");

    let disk1 = false;
    let disk2 = false;
    try {
      await fs.access(path1);
      disk1 = true;
    } catch {
      // not found
    }
    try {
      await fs.access(path2);
      disk2 = true;
    } catch {
      // not found
    }

    let apiStatus: number | null = null;
    let apiError: string | null = null;
    try {
      const res = await fetch(`${baseUrl}/api/robotech-image/${imageKey}`);
      apiStatus = res.status;
      if (!res.ok) apiError = (await res.text().catch(() => res.statusText)).slice(0, 200);
    } catch (e) {
      apiError = e instanceof Error ? e.message : String(e);
    }

    const loaded = disk1 || disk2 || (apiStatus === 200);
    const source = disk1 ? "disk (assets)" : disk2 ? "disk (local-dev)" : apiStatus === 200 ? "api" : "missing";
    results.push({
      slug: project.slug,
      title: project.title,
      imageKey,
      fileName: fileName ?? null,
      source,
      loaded,
      diskAssets: disk1,
      diskLocalDev: disk2,
      diskPathAssets: path1,
      diskPathLocalDev: path2,
      apiUrl: `${baseUrl}/api/robotech-image/${imageKey}`,
      apiStatus,
      apiError: apiError ?? null
    });
  }

  const withImage = results.filter((r) => r.imageKey != null);
  const loadedCount = withImage.filter((r) => r.loaded === true).length;
  const total = withImage.length;
  const summary = `Portfolio images: ${loadedCount}/${total} load (baseUrl: ${baseUrl}, cwd: ${cwd})`;

  if (loadedCount < total) {
    howToFix.push("Add missing image files to the repo under an 'assets' folder (same filenames as in IMAGE_FILE_MAP), or ensure /api/robotech-image/<key> returns 200 for each key.");
    howToFix.push("Check Vercel/server logs for [portfolio] lines: disk miss, API image failed, or Embed failed.");
  }
  if (withImage.some((r) => r.apiStatus === 401)) {
    howToFix.push("apiStatus 401 = Vercel Deployment Protection. PDF generation on Vercel uses disk only (no API fallback) so this does not affect the PDF.");
  }

  return {
    baseUrl,
    cwd,
    summary,
    howToFix,
    usage: "Remove ?debug=1 to get the PDF. In Vercel: Project → Logs to see [portfolio] disk/API/embed messages.",
    images: results
  };
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl =
      process.env.VERCEL_URL != null
        ? `https://${process.env.VERCEL_URL}`
        : new URL(request.url).origin;

    const debug = request.nextUrl.searchParams.get("debug");
    if (debug === "1" || debug === "images") {
      const diagBaseUrl = new URL(request.url).origin;
      const diag = await runImageDiagnostics(diagBaseUrl);
      return new NextResponse(JSON.stringify(diag, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
      });
    }

    const projects = await getAllProjects();
    const pdfDoc = await PDFDocument.create();

    const sharedImages = new Map<string, LoadedImage>();

    console.log(`[portfolio] Generating PDF baseUrl=${baseUrl} projects=${projects.length}`);

    for (const project of projects) {
      await renderProjectPage(pdfDoc, project, sharedImages, baseUrl);
    }

    console.log(`[portfolio] PDF generated; ${sharedImages.size} hero images embedded. Use ?debug=1 for diagnostics.`);

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
  } catch (err) {
    console.error("[portfolio] PDF generation failed:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate portfolio PDF" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

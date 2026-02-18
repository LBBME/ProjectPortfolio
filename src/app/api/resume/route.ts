import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const DEPLOY_SAFE_RESUME_PATH = path.join(process.cwd(), "public", "resume", "resume.pdf");
const LOCAL_DEV_RESUME_PATH =
  "/Users/dennisroman/Desktop/Resumes/Resume Spring 2026 V5.pdf";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const download = searchParams.get("download") === "1";

  const candidates = [DEPLOY_SAFE_RESUME_PATH, LOCAL_DEV_RESUME_PATH];

  for (const resumePath of candidates) {
    try {
      const data = await fs.readFile(resumePath);
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
      };
      if (download) {
        headers["Content-Disposition"] = 'attachment; filename="Dennis_Roman_Resume.pdf"';
      }
      return new NextResponse(data, {
        status: 200,
        headers,
      });
    } catch {
      // Try next candidate path.
    }
  }

  return new NextResponse("Resume file not found", { status: 404 });
}

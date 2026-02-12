import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const DEPLOY_SAFE_RESUME_PATH = path.join(process.cwd(), "public", "resume", "resume.pdf");
const LOCAL_DEV_RESUME_PATH =
  "/Users/dennisroman/Desktop/Resumes/Cover Letters/Resume Spring 2026 V4.pdf";

export async function GET() {
  const candidates = [DEPLOY_SAFE_RESUME_PATH, LOCAL_DEV_RESUME_PATH];

  for (const resumePath of candidates) {
    try {
      const data = await fs.readFile(resumePath);
      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Cache-Control": "public, max-age=3600"
        }
      });
    } catch {
      // Try next candidate path.
    }
  }

  return new NextResponse("Resume file not found", { status: 404 });
}

import fs from "node:fs/promises";
import { NextResponse } from "next/server";

const RESUME_PATH = "/Users/dennisroman/Desktop/Resumes/Cover Letters/Resume Spring 2026 V4.pdf";

export async function GET() {
  try {
    const data = await fs.readFile(RESUME_PATH);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new NextResponse("Resume file not found", { status: 404 });
  }
}

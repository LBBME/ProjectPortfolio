import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ASSETS_DIR = path.join(process.cwd(), "assets");
const LOCAL_DEV_ASSETS_DIR =
  "/Users/dennisroman/.cursor/projects/Users-dennisroman-Documents-Website/assets";

const IMAGE_MAP: Record<string, string> = {
  rig: "a73807_8df4ae589d9e4b08bf0aae093b7e4462_mv2-42e4e662-3a4d-4b59-aeac-175f358b964d.png",
  team: "a73807_fdecd814cbd7485aac7ff6215f368d23f000-14ef7221-18d6-43cb-8a35-bb56e8dfb1f2.png",
  assembly: "IMG_2409_edited-ceed86df-2bdc-4086-bfb4-8607d4224b6c.png",
  cad: "RoboTech_Sketch_edited-4126ef63-fc88-4b9f-a1d9-e6d1e28392d4.png",
  "about-profile": "IMG_0779-2bd67db0-8d97-474b-a0d0-83a35bb105fe.png",
  "flat-plate-extra-1": "Screenshot_2026-02-11_at_7.28.30_PM-b98e1891-9527-4fc1-ac13-202d42fd0fdb.png",
  "flat-plate-extra-2": "Screenshot_2026-02-11_at_7.28.51_PM-79e13e5a-e7a4-4b76-b7c3-090b0c3a69ec.png",
  "flat-plate-extra-3": "Screenshot_2026-02-11_at_7.29.48_PM-149becaa-efcc-4e06-96ca-d9d90c51e04c.png",
  "transonic-extra-1": "Screenshot_2026-02-11_at_7.31.34_PM-288f242d-a5f1-4e34-ac83-e9cf6a92ad6e.png",
  "transonic-extra-2": "Screenshot_2026-02-11_at_7.31.48_PM-95fbb96f-f5f6-4565-aabc-7cd026ea5532.png",
  "artery-extra-1": "Screenshot_2026-02-11_at_7.32.28_PM-478714ad-9987-41c0-b874-fda49833413b.png",
  "artery-extra-2": "Screenshot_2026-02-11_at_7.32.36_PM-b91dc5ac-cebd-4d24-aa74-b049c486b296.png",
  "artery-extra-3": "Screenshot_2026-02-11_at_7.32.44_PM-b156a80f-2852-4090-a071-9e4810e8e315.png",
  "artery-extra-4": "Screenshot_2026-02-11_at_7.32.58_PM-558fca0c-a4b5-4850-84eb-97cee29dacbd.png",
  "nozzle-extra-1": "Screenshot_2026-02-11_at_7.33.54_PM-39c38ba2-b9b1-440d-a40f-034147fd1bc9.png",
  "nozzle-extra-2": "Screenshot_2026-02-11_at_7.34.03_PM-bbc9ee03-d6e6-421d-9f62-37425f53ac94.png",
  "fsae-sideaero-1": "Screenshot_2026-02-11_at_7.39.37_PM-9b773d34-fdc5-461a-bb64-52359ae19ac3.png",
  "fsae-sideaero-2": "Screenshot_2026-02-11_at_7.39.45_PM-9698be31-24f7-4613-a047-70ce65379765.png",
  "fsae-sideaero-3": "Screenshot_2026-02-11_at_7.40.02_PM-228fdf66-08f9-4764-9340-7db2525ec1e9.png",
  "fsae-sideaero-4": "Screenshot_2026-02-11_at_7.40.15_PM-85908ba3-d746-4fb8-ad49-bbf92ed3c40c.png",
  "fsae-sideaero-5": "Screenshot_2026-02-11_at_7.40.26_PM-701e47b7-3406-487f-897e-7acf968bf657.png",
  "fsae-sideaero-6": "Screenshot_2026-02-11_at_7.40.36_PM-9ae79ac6-03e3-42d8-b78e-75fae62ecb24.png",
  "fsae-sideaero-7": "Screenshot_2026-02-11_at_7.40.45_PM-fb9fa1bb-26b3-4d10-afab-6604737e638b.png",
  "fsae-sideaero-8": "Screenshot_2026-02-11_at_7.40.54_PM-8e296996-2ae0-4c4b-9ed6-81a8d059824f.png",
  "fsae-sideaero-9": "Screenshot_2026-02-11_at_7.41.05_PM-fcff1e27-9e0d-486a-b9ba-435d16e33864.png",
  "fsae-sideaero-10": "Screenshot_2026-02-11_at_7.44.40_PM-396432e0-436f-4af0-b1ae-2d6a9d7e1aed.png",
  "fsae-sideaero-11": "Screenshot_2026-02-11_at_7.44.55_PM-be68e5c6-2bc4-492b-b460-b04dceee62fd.png",
  "fsae-sideaero-12": "Screenshot_2026-02-11_at_7.45.18_PM-0c5f6fc6-382a-40c6-be1e-878a1b2f8eaa.png",
  "fsae-sideaero-13": "Screenshot_2026-02-11_at_7.46.03_PM-8a01a2e0-7f02-45fa-9e95-5115df80b171.png",
  "fsae-sideaero-14": "Screenshot_2026-02-11_at_7.46.12_PM-3538d3cb-0beb-4b9a-8a84-ae592879b80c.png",
  "vawt-1": "Screenshot_2026-02-11_at_7.58.03_PM-e561c627-7c81-43a3-be28-81ffa4fa1340.png",
  "vawt-2": "Screenshot_2026-02-11_at_7.58.20_PM-2b67bf28-eb83-409d-8b3f-a3e83b2a895b.png",
  "vawt-3": "Screenshot_2026-02-11_at_7.58.28_PM-572be271-1ee2-437b-9fbb-0da99b08362c.png",
  "vawt-4": "Screenshot_2026-02-11_at_7.58.39_PM-72f55326-d553-455f-a59a-21b2d8764e6c.png",
  "vawt-5": "Screenshot_2026-02-11_at_7.58.48_PM-3b3853be-4a61-4317-906c-6ff6c0cf72fd.png",
  "onera-1": "Screenshot_2026-02-11_at_9.59.09_PM-59487bbe-f670-4466-b3ad-76b30aad0ca0.png",
  "onera-2": "Screenshot_2026-02-11_at_9.59.30_PM-b552f766-3efd-4dd4-9e59-b0f20b54bd79.png",
  "onera-3": "Screenshot_2026-02-11_at_10.00.13_PM-81d4fcf9-9528-432a-a7c4-b32a7a02d612.png",
  "onera-4": "Screenshot_2026-02-11_at_10.00.47_PM-f60e0bd1-22fb-4135-aa71-062f5f3949ce.png",
  "onera-5": "Screenshot_2026-02-11_at_10.01.40_PM-ef0cde5d-e6e6-4db0-995d-b6fe5b4ce804.png",
  "onera-6": "Screenshot_2026-02-11_at_10.02.55_PM-37afe45e-5d5a-4823-8a67-73068ee276ce.png",
  "wedge-1": "Screenshot_2026-02-11_at_10.07.54_PM-93b20822-5470-4824-90ae-1b64e1339a3d.png",
  "wedge-2": "Screenshot_2026-02-11_at_10.08.00_PM-718eb202-7021-4ecc-bf61-8b260e256bd4.png",
  "wedge-3": "Screenshot_2026-02-11_at_10.08.08_PM-1d2e765a-a9a8-45a8-9ed1-872628d37120.png",
  "wedge-4": "Screenshot_2026-02-11_at_10.08.15_PM-cf3102d1-9677-4f23-ac2b-20138dbf61c5.png",
  "wedge-5": "Screenshot_2026-02-11_at_10.08.26_PM-d6a7fd79-74c9-4366-9ae6-3aaf8856a1c7.png",
  "wedge-6": "Screenshot_2026-02-11_at_10.08.32_PM-de7c8696-88b8-401b-bf37-b9853870ab55.png",
  "wedge-7": "Screenshot_2026-02-11_at_10.09.01_PM-132b3e7a-a733-4273-8600-61e1c1245689.png",
  "wedge-8": "Screenshot_2026-02-11_at_10.09.10_PM-bae46529-262a-4439-8703-549ceff40435.png",
  "robotech-new-1": "Screenshot_2026-02-11_at_10.14.07_PM-e49ec187-7af1-43ca-ba4e-100a1e1d66a4.png",
  "robotech-new-2": "Screenshot_2026-02-11_at_10.16.13_PM-62aa1abe-c914-4f09-afec-f5e4a0f7542d.png",
  "robotech-new-3": "Screenshot_2026-02-11_at_10.16.26_PM-ec4888fd-8f74-4284-b02d-b28944f29720.png",
  "winglet-hs-1": "Screenshot_2026-02-11_at_10.18.02_PM-76839789-dbbd-4797-82f5-649b2c9b5fe3.png",
  "winglet-hs-2": "Screenshot_2026-02-11_at_10.20.00_PM-cc5bad69-372c-470f-a317-b5aae5f9342e.png",
  "ipw-setup-geometry": "Screenshot_2026-02-11_at_11.29.01_PM-9abf8a54-f317-437e-a8a0-555a06c0d16c.png",
  "rg15-1bin-plot": "Screenshot_2026-02-11_at_11.37.49_PM-0de6f25d-5d09-4fb1-b3aa-cb4e627ebe74.png",
  "rg15-7bin-plot": "Screenshot_2026-02-11_at_11.38.02_PM-915b044a-ffad-417c-be1d-4850c2d5b1cb.png",
  "fsae-endurance-1": "endurance-c942a0e2-d528-4689-8d31-d0f75989da81.png",
  "hytech-third-element-1": "Screenshot_2026-02-14_at_4.35.49_PM-57737c62-a063-47ef-824d-120da0f013c7.png",
  "hytech-third-element-2": "Screenshot_2026-02-14_at_4.36.03_PM-985d68e5-d8d1-4f6a-8446-f4738adb56f1.png",
  "btzcl-reacting-1": "Screenshot_2026-02-14_at_4.54.06_PM-cda1d08b-5a4c-4a1a-85a4-e1920e209e1b.png",
  "btzcl-reacting-2": "Screenshot_2026-02-14_at_4.55.00_PM-77b313e0-7fbc-4b6e-b84f-6ce1aa6f33a3.png",
  "btzcl-reacting-3": "Screenshot_2026-02-14_at_4.55.13_PM-7d39e79d-d9ec-4abd-851f-2636d38b54e0.png",
  "btzcl-reacting-4": "Screenshot_2026-02-14_at_4.56.26_PM-0235188d-f935-4cfe-abb0-9856ab72f963.png",
  "hytech-composites-1": "IMG_0774-cc0d191b-df8d-42e9-8596-d04c0d8e124d.png",
  "hytech-composites-2": "IMG_0773-2871ebb8-d256-4af4-a5b1-2f55a25f2c64.png"
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ image: string }> }
) {
  const { image } = await context.params;
  const fileName = IMAGE_MAP[image];
  if (!fileName) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const candidates = [
    path.join(ASSETS_DIR, fileName),
    path.join(LOCAL_DEV_ASSETS_DIR, fileName)
  ];

  for (const absolutePath of candidates) {
    try {
      const data = await fs.readFile(absolutePath);
      const ext = path.extname(fileName).toLowerCase();
      const contentType =
        ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : "image/png";

      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600"
        }
      });
    } catch {
      // Try next candidate path.
    }
  }

  return new NextResponse("Image file missing", { status: 404 });
}

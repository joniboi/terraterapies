// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Check Size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (Max 20MB)" },
        { status: 400 },
      );
    }

    // 2. Check Type (Basic check)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for Sharp
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Initialize Sharp and inspect metadata
    const image = sharp(buffer);
    const metadata = await image.metadata().catch(() => null);

    if (!metadata) {
      return NextResponse.json(
        { error: "Invalid image file or unsupported format" },
        { status: 400 },
      );
    }

    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // 3. Purpose-Aware Validation
    if (type === "hero-desktop") {
      if (width < height) {
        return NextResponse.json(
          {
            error:
              "This image does not have a suitable panoramic composition for the desktop hero. Please upload a wider image.",
          },
          { status: 400 },
        );
      }
      if (width < 1600) {
        return NextResponse.json(
          {
            error:
              "This image is not wide enough for a desktop hero. Recommended width: approximately 1920px or more.",
          },
          { status: 400 },
        );
      }
    }

    if (type === "hero-mobile") {
      if (width > height) {
        return NextResponse.json(
          {
            error:
              "This image does not have a suitable portrait composition for the mobile hero. Please upload a portrait-oriented image, approximately 3:4.",
          },
          { status: 400 },
        );
      }
    }

    // 4. Process based on type
    let fileName: string;
    let filePath: string;

    if (type === "pdf-bg") {
      // PDF Background: Use PNG/JPG for compatibility
      fileName = `${uuidv4()}.jpg`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await image
        .resize(1724, 947, { fit: "fill" }) // Exact PDF dimensions
        .jpeg({ quality: 90 }) // High quality lossless
        .toFile(filePath);
    } else if (type === "hero-desktop") {
      // Hero Desktop: High-impact panoramic preservation
      fileName = `${uuidv4()}.webp`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await image
        .resize(2400, null, { withoutEnlargement: true }) // Width scaling, preserves user's vertical crop
        .webp({ quality: 85 })
        .toFile(filePath);
    } else if (type === "hero-mobile") {
      // Hero Mobile: Portrait preservation
      fileName = `${uuidv4()}.webp`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await image
        .resize(1350, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filePath);
    } else {
      // DEFAULT FALLBACK: For existing components (treatments, categories, etc.)
      fileName = `${uuidv4()}.webp`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await image
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filePath);
    }

    // 5. Return the clean public URL
    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Server error during upload" },
      { status: 500 },
    );
  }
}

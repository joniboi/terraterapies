import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 15 * 1024 * 1024; // 4MB

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
        { error: "File too large (Max 4MB)" },
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

    // 3. Process based on type
    let fileName: string;
    let filePath: string;

    if (type === "pdf-bg") {
      // PDF Background: Use PNG for compatibility + transparency support
      fileName = `${uuidv4()}.jpg`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await sharp(buffer)
        .resize(1724, 947, { fit: "fill" }) // Exact PDF dimensions
        .jpeg({ quality: 90 }) // High quality lossless
        .toFile(filePath);
    } else {
      // Normal images: Use WebP for speed
      fileName = `${uuidv4()}.webp`;
      filePath = path.join(UPLOAD_DIR, fileName);

      await sharp(buffer)
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

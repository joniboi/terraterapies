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

    // 3. Witness Protection & Processing (The Secure Renaming)
    const fileName = `${uuidv4()}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Ensure directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // 4. Sharp: Resize, Convert to WebP, and Save
    await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true }) // Shrink if too big, but don't stretch small ones
      .webp({ quality: 80 }) // High quality WebP
      .toFile(filePath);

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

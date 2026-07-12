"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils"; // Assuming you have a cn helper

interface ImageUploadFieldProps {
  label?: string; // 1. MADE OPTIONAL
  description?: string;
  currentImage?: string;
  uploadType?: string;
  aspectRatioClass?: string;
  onUploadSuccess: (newUrl: string) => void;
}

export default function ImageUploadField({
  label,
  description,
  currentImage,
  uploadType,
  aspectRatioClass = "aspect-video",
  onUploadSuccess,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      if (uploadType) form.append("type", uploadType);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* 2. ONLY RENDER LABEL IF PROVIDED (Avoids double labels in FormField) */}
      {label && (
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {label}
          {description && (
            <span className="block text-[10px] font-normal text-muted-foreground mt-1 lowercase italic">
              {description}
            </span>
          )}
        </label>
      )}

      {/* 3. SEMANTIC THEME COLORS (border-border, bg-muted/20) */}
      <div
        className={cn(
          "relative w-full rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/20 group",
          aspectRatioClass,
        )}
      >
        {currentImage ? (
          <Image
            src={currentImage}
            alt={label || "Upload"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xs">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <label className="cursor-pointer">
            <span className="bg-background text-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 shadow-lg inline-flex items-center gap-2 border border-border">
              {isUploading ? "Uploading..." : "📷 Change Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  currentImage?: string;
  aspectRatioClass?: string; // e.g., "aspect-[3/4]", "aspect-video", "aspect-square"
  onUploadSuccess: (newUrl: string) => void;
}

export default function ImageUploadField({
  label,
  description,
  currentImage,
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

      // Call the Secure API we built in Milestone 3
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Send the new URL back to the parent
      onUploadSuccess(data.url);
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {description && (
          <span className="block text-xs font-normal text-gray-500 mt-1">
            {description}
          </span>
        )}
      </label>

      <div
        className={`relative w-full max-w-[300px] rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 group ${aspectRatioClass}`}
      >
        {currentImage ? (
          <Image src={currentImage} alt={label} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Hover overlay to upload */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <label className="cursor-pointer">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 shadow-lg inline-flex items-center gap-2">
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

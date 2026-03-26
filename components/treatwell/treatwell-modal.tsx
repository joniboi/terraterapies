// components/TreatwellModal.tsx
"use client";

import TreatwellWidget from "@/components/treatwell/treatwell-widget";

export default function TreatwellModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/70 hidden md:block"
        onClick={onClose}
      />

      <div className="relative w-full h-full md:w-full md:max-w-5xl md:h-[80vh] bg-white md:rounded-2xl shadow-xl overflow-hidden">
        <button
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-500 hover:text-black hover:bg-white md:bg-transparent md:shadow-none"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="w-full h-full overflow-y-auto">
          <TreatwellWidget />
        </div>
      </div>
    </div>
  );
}

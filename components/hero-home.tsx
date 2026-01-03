"use client";

import { useState } from "react";
import TreatwellWidget from "@/components/treatwell-widget";
import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  const [showWidget, setShowWidget] = useState(false);
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]"
              data-aos="zoom-y-out"
            >
              <div className="-mx-0.5 flex justify-center -space-x-3"></div>
            </div>
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Terrateràpies Thai & Bali
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Massatges amb essencia Tailandesa i Balinesa
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:mb-0 sm:w-auto cursor-pointer"
                    onClick={() => setShowWidget(true)}
                  >
                    <span className="relative inline-flex items-center">
                      Reserva ara
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative aspect-[3/2] mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900">
              <img
                src="/images/hero/spa1.jpg"
                alt="Spa 1"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-1_30s_infinite]"
              />
              <img
                src="/images/hero/spa2.jpg"
                alt="Spa 2"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-2_30s_infinite]"
              />
              <img
                src="/images/hero/spa3.jpg"
                alt="Spa 3"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-3_30s_infinite]"
              />
              <img
                src="/images/hero/spa1.jpg"
                alt="Spa 4"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-4_30s_infinite]"
              />
              <img
                src="/images/hero/spa2.jpg"
                alt="Spa 5"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-5_30s_infinite]"
              />
              <img
                src="/images/hero/spa3.jpg"
                alt="Spa 6"
                className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[code-6_30s_infinite]"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modal wrapper – always in the DOM */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 transition-opacity ${
          showWidget
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Close button */}
          <button
            className="absolute right-4 top-4 z-10 text-gray-600 hover:text-black text-2xl"
            onClick={() => setShowWidget(false)}
          >
            ✕
          </button>

          {/* Only the widget scrolls */}
          <div className="w-full h-full overflow-auto">
            <TreatwellWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

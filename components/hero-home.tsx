"use client";

import { useState } from "react";
import TreatwellWidget from "@/components/treatwell-widget";
import PageIllustration from "@/components/page-illustration";

// 1. Define the Dictionary Interface
interface HeroDict {
  title: string;
  tagline: string;
  cta: string;
}

export default function HeroHome({ dict }: { dict: HeroDict }) {
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
              {dict.title}
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                {dict.tagline}
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
                      {dict.cta}
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

      {/* 
        ================================================================
        MODAL WRAPPER (UPDATED FOR RESPONSIVENESS)
        ================================================================
      */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          showWidget
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 
          A. DARK OVERLAY
          - Only visible on Desktop (md:block)
          - Hidden on Mobile because the modal covers 100% of the screen anyway
        */}
        <div
          className="absolute inset-0 bg-black/70 hidden md:block"
          onClick={() => setShowWidget(false)}
        />

        {/* 
          B. THE CONTAINER
          - Mobile (default): w-full h-full (Full Screen Takeover)
          - Desktop (md:): max-w-5xl h-[80vh] rounded-2xl (Centered Card)
        */}
        <div className="relative w-full h-full md:w-full md:max-w-5xl md:h-[80vh] bg-white md:rounded-2xl shadow-xl overflow-hidden">
          {/* Close button - Styled for visibility on both white/dark backgrounds if needed */}
          <button
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-500 hover:text-black hover:bg-white md:bg-transparent md:shadow-none"
            onClick={() => setShowWidget(false)}
          >
            {/* SVG X Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Widget Container - Scrolls internally */}
          <div className="w-full h-full overflow-y-auto">
            <TreatwellWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

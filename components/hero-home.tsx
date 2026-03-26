"use client";

import { useState } from "react";
import TreatwellWidget from "@/components/treatwell/treatwell-widget";
import PageIllustration from "@/components/page-illustration";
import TreatwellModal from "@/components/treatwell/treatwell-modal";

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
      <TreatwellModal open={showWidget} onClose={() => setShowWidget(false)} />
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import { ChevronDown } from "lucide-react";

// Define the shape of the dictionary part this component needs
interface FooterDict {
  copyright: string;
  experiences: { title: string; thai: string; bali: string; combos: string };
  collabs: { title: string; mezzanote: string };
  info: { title: string; contact: string; about: string; faq: string };
  social: { title: string; whatsappMsg: string };
  bigText: string;
}

interface FooterProps {
  border?: boolean;
  dict: FooterDict;
}

export default function Footer({ border = false, dict }: FooterProps) {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div
          className={`grid gap-8 py-8 sm:grid-cols-12 md:py-12 ${
            border
              ? "border-t [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1]"
              : ""
          }`}
        >
          {/* 1st block: Branding (Always visible) */}
          <div className="space-y-4 sm:col-span-12 lg:col-span-4 mb-4 lg:mb-0">
            <div>
              <Logo />
            </div>
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Terraterapies Thai & Bali.{" "}
              {dict.copyright}
            </div>
          </div>

          {/* 2nd block: Experiences */}
          <FooterSection
            title={dict.experiences.title}
            className="sm:col-span-6 md:col-span-3 lg:col-span-2"
          >
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.experiences.thai}
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.experiences.bali}
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.experiences.combos}
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* 3rd block: Collabs */}
          <FooterSection
            title={dict.collabs.title}
            className="sm:col-span-6 md:col-span-3 lg:col-span-2"
          >
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.collabs.mezzanote}
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* 4th block: Info */}
          <FooterSection
            title={dict.info.title}
            className="sm:col-span-6 md:col-span-3 lg:col-span-2"
          >
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.info.contact}
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.info.about}
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-gray-900"
                  href="#0"
                >
                  {dict.info.faq}
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* 5th block: Social (Always visible as grid/list, rarely accordion) */}
          <div className="space-y-4 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              {dict.social.title}
            </h3>
            <ul className="flex gap-4">
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600 hover:scale-110"
                  href={`https://wa.me/34603177049?text=${encodeURIComponent(dict.social.whatsappMsg)}`}
                  aria-label="Whatsapp"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600 hover:scale-110"
                  href="https://www.facebook.com/people/Terraterapies-Thai-Y-Bali/61580296106688"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600 hover:scale-110"
                  href="https://www.instagram.com/terrapiesthaiybali"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Big text */}
      <div
        className="pointer-events-none relative -mt-16 h-60 w-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -z-10 -translate-x-1/2 text-center text-[120px] md:text-[348px] font-bold leading-none before:bg-linear-to-b before:from-gray-200 before:to-gray-100/30 before:to-80% before:bg-clip-text before:text-transparent before:content-['Thai&Bali'] after:absolute after:inset-0 after:bg-gray-300/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-['Thai&Bali'] after:[text-shadow:0_1px_0_white]"></div>
        {/* Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3"
          aria-hidden="true"
        >
          <div className="h-40 w-40 md:h-56 md:w-56 rounded-full border-[20px] border-blue-700 blur-[60px] md:blur-[80px]"></div>
        </div>
      </div>
    </footer>
  );
}

// --------------------------------------------------------------------------------
// HELPER COMPONENT: Responsive Accordion
// - On Mobile: It's a button that toggles visibility
// - On Desktop: It's just a static block
// --------------------------------------------------------------------------------
function FooterSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`space-y-2 border-b border-gray-100 sm:border-none pb-4 sm:pb-0 ${className}`}
    >
      {/* 
         MOBILE HEADER: Clickable
         DESKTOP HEADER: Static
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between sm:hidden group"
      >
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <h3 className="hidden sm:block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
        {title}
      </h3>

      {/* 
         CONTENT: 
         - Mobile: Hidden unless open
         - Desktop: Always visible (block)
      */}
      <div
        className={`${isOpen ? "block" : "hidden"} sm:block animate-in slide-in-from-top-1`}
      >
        {children}
      </div>
    </div>
  );
}

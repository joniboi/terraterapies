"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { NavItem, Dictionary } from "@/types/definitions";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react"; // Make sure to install lucide-react if you haven't

interface HeaderProps {
  lang: string;
  dict: Dictionary["header"];
  navItems: NavItem[];
}

export default function Header({ lang, dict, navItems }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Expanded states for mobile accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const switchLang = (newLang: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newUrl = segments.join("/");
    setMobileMenuOpen(false); // Close menu on switch
    router.push(newUrl);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // --- DESKTOP HEADER CONTENT ---
  const DesktopNav = () => (
    <div className="hidden md:flex flex-1 items-center justify-between">
      <div className="flex items-center">
        <Logo lang={lang} />
      </div>

      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {navItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger
                className={`transition-colors duration-200 ${
                  item.highlight
                    ? "text-amber-700 hover:text-amber-800 font-bold"
                    : "text-gray-700 hover:text-gray-900 font-medium"
                }`}
              >
                {item.emoji && <span className="mr-1">{item.emoji}</span>}
                {item.label}
              </NavigationMenuTrigger>
              {/* ... YOUR EXISTING MEGA MENU CONTENT HERE (Keep exactly as it was) ... */}
              <NavigationMenuContent className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50">
                {/* Reuse your existing layouts (A & B) here unchanged */}
                {item.layout === "mega-menu" && (
                  <div className="flex flex-col w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/30">
                      {item.categories.map((cat) => (
                        <NavigationMenuLink asChild key={cat.slug}>
                          <Link
                            href={`/${lang}/${cat.slug}`}
                            className="group relative flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-lg hover:-translate-y-1"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 group-hover:border-blue-100">
                              <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover group-hover:scale-110"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-900">
                                {cat.title}
                              </span>
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                {cat.subcategories
                                  .map((s) => s.title)
                                  .join(", ")}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                )}
                {item.layout === "rich-dropdown" && (
                  <div className="flex flex-col w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                    {/* ... Your existing Layout B code ... */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/30">
                      {item.categories[0]?.subcategories.map((sub) => (
                        <NavigationMenuLink asChild key={sub.slug}>
                          <Link
                            href={`/${lang}/${item.categories[0].slug}/${sub.slug}`}
                            className="group relative flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-amber-300 hover:shadow-lg hover:-translate-y-1"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl border border-amber-100 group-hover:bg-amber-100">
                              {sub.emoji}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-gray-800 group-hover:text-amber-900">
                                {sub.title}
                              </span>
                              {sub.tagline && (
                                <span className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                  {sub.tagline}
                                </span>
                              )}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Lang Switcher */}
      <ul className="flex items-center justify-end gap-3">
        {["es", "ca", "en"].map((l) => (
          <li key={l}>
            <button
              onClick={() => switchLang(l)}
              // Added cursor-pointer here 👇
              className={`cursor-pointer transition hover:scale-110 ${lang === l ? "opacity-100" : "opacity-50 grayscale"}`}
            >
              <Image
                src={
                  l === "ca"
                    ? "/images/flags/es-ct.svg"
                    : l === "en"
                      ? "/images/flags/gb.svg"
                      : "/images/flags/es.svg"
                }
                alt={l}
                width={24}
                height={24}
                className="rounded-full shadow-sm pointer-events-none"
                // 👆 Optional: pointer-events-none ensures the button always catches the click
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <header className="fixed top-2 z-30 w-full md:top-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs">
            {/* 1. Desktop View (Hidden on mobile) */}
            <DesktopNav />

            {/* 2. Mobile View (Visible only on mobile) */}
            <div className="flex md:hidden w-full items-center justify-between">
              <Logo lang={lang} />

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE FULL SCREEN MENU (DRAWER) --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-300">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Logo lang={lang} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  {/* Mobile Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="flex w-full items-center justify-between py-4 text-lg font-medium text-gray-900"
                  >
                    <span className="flex items-center gap-2">
                      {item.emoji} {item.label}
                    </span>
                    {openAccordion === item.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Mobile Accordion Content */}
                  {openAccordion === item.id && (
                    <div className="pb-4 pl-4 space-y-3 animate-in slide-in-from-top-2">
                      {/* Logic for Layout A (Treatments) */}
                      {item.layout === "mega-menu" &&
                        item.categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/${lang}/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg active:bg-gray-50"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0">
                              <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {cat.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {cat.subcategories.length} options
                              </div>
                            </div>
                          </Link>
                        ))}

                      {/* Logic for Layout B (Rituals) */}
                      {item.layout === "rich-dropdown" &&
                        item.categories[0]?.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/${lang}/${item.categories[0].slug}/${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg active:bg-amber-50"
                          >
                            <span className="text-2xl">{sub.emoji}</span>
                            <div className="font-semibold text-gray-800">
                              {sub.title}
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile Footer: BIG Language Buttons */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Select Language
            </p>
            <div className="flex justify-center gap-6">
              {["es", "ca", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  // Added cursor-pointer here 👇
                  className={`cursor-pointer flex flex-col items-center gap-2 transition active:scale-95 ${lang === l ? "opacity-100" : "opacity-40 grayscale"}`}
                >
                  <div
                    className={`relative w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 ${lang === l ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"}`}
                  >
                    <Image
                      src={
                        l === "ca"
                          ? "/images/flags/es-ct.svg"
                          : l === "en"
                            ? "/images/flags/gb.svg"
                            : "/images/flags/es.svg"
                      }
                      alt={l}
                      fill
                      className="object-cover pointer-events-none"
                      // 👆 Optional: prevents the image from interfering with the button's hover state
                    />
                  </div>
                  <span className="text-sm font-medium uppercase pointer-events-none">
                    {l}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

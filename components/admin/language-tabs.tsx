"use client";

import React from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

const LANGUAGES = [
  { code: "es", label: "Español 🇪🇸", short: "ES" },
  { code: "en", label: "English 🇬🇧", short: "EN" },
  { code: "ca", label: "Català 🟦", short: "CA" },
] as const;

// Define the exact literal type so TypeScript can help us in the form
export type LangCode = "es" | "en" | "ca";

interface LanguageTabsProps {
  headerText: string;
  className?: string;
  useShortLabels?: boolean;
  // This is the magic "Render Prop". It passes the current language code down to whatever is inside!
  children: (lang: LangCode) => React.ReactNode;
}

export default function LanguageTabs({
  headerText,
  className = "",
  useShortLabels = false,
  children,
}: LanguageTabsProps) {
  return (
    <Tabs
      defaultValue="es"
      className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${className}`}
    >
      {/* HEADER */}
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400 uppercase">
          {headerText}
        </span>
        <TabsList variant="underline">
          {LANGUAGES.map((lang) => (
            <TabsTab key={lang.code} value={lang.code}>
              {useShortLabels ? lang.short : lang.label}
            </TabsTab>
          ))}
        </TabsList>
      </div>

      {/* CONTENT PANELS */}
      {LANGUAGES.map((lang) => (
        <TabsPanel key={lang.code} value={lang.code} className="outline-none">
          {/* We execute the children function and pass it the current language! */}
          {children(lang.code)}
        </TabsPanel>
      ))}
    </Tabs>
  );
}

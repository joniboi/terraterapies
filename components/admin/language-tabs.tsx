"use client";

import React from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { cn } from "@/app/lib/utils";

const LANGUAGES = [
  { code: "es", label: "Español 🇪🇸", short: "ES" },
  { code: "en", label: "English 🇬🇧", short: "EN" },
  { code: "ca", label: "Català 🟦", short: "CA" },
] as const;

export type LangCode = "es" | "en" | "ca";

interface LanguageTabsProps {
  headerText?: string; // 1. NOW OPTIONAL!
  className?: string;
  useShortLabels?: boolean;
  variant?: "card" | "inline"; // 2. SUPPORT FOR COMPACT OR CARD LAYOUTS
  children: (lang: LangCode) => React.ReactNode;
}

export default function LanguageTabs({
  headerText,
  className,
  useShortLabels = false,
  variant = "card",
  children,
}: LanguageTabsProps) {
  // --- INLINE MODE (For small fields like Input / Textarea inside forms) ---
  if (variant === "inline") {
    return (
      <Tabs defaultValue="es" className={cn("w-full space-y-1.5", className)}>
        <div className="flex justify-between items-center">
          {headerText && (
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {headerText}
            </span>
          )}
          <TabsList
            variant="underline"
            className="h-7 border-none bg-transparent p-0"
          >
            {LANGUAGES.map((lang) => (
              <TabsTab
                key={lang.code}
                value={lang.code}
                className="px-2 py-0.5 text-xs"
              >
                {useShortLabels ? lang.short : lang.label}
              </TabsTab>
            ))}
          </TabsList>
        </div>

        {LANGUAGES.map((lang) => (
          <TabsPanel key={lang.code} value={lang.code} className="outline-none">
            {children(lang.code)}
          </TabsPanel>
        ))}
      </Tabs>
    );
  }

  // --- CARD MODE (For wrapping entire form sections) ---
  return (
    <Tabs
      defaultValue="es"
      className={cn(
        "border border-border rounded-xl overflow-hidden bg-background shadow-sm",
        className,
      )}
    >
      {/* HEADER BAR */}
      <div className="px-4 py-2 border-b border-border bg-muted/40 flex justify-between items-center min-h-[42px]">
        {headerText ? (
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {headerText}
          </span>
        ) : (
          <span />
        )}
        <TabsList variant="underline">
          {LANGUAGES.map((lang) => (
            <TabsTab key={lang.code} value={lang.code}>
              {useShortLabels ? lang.short : lang.label}
            </TabsTab>
          ))}
        </TabsList>
      </div>

      {/* PANELS */}
      {LANGUAGES.map((lang) => (
        <TabsPanel key={lang.code} value={lang.code} className="outline-none">
          {children(lang.code)}
        </TabsPanel>
      ))}
    </Tabs>
  );
}

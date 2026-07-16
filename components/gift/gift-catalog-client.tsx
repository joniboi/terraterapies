"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Info, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PricingPills } from "@/components/treatment/pricing-pills";
import { PromoBadge } from "@/components/ui/promo-badge";
import { ServicesData } from "@/types/definitions";

export default function GiftCatalogClient({
  servicesData,
  lang,
  dict,
}: {
  servicesData: ServicesData;
  lang: string;
  dict: any;
}) {
  const [search, setSearch] = useState("");

  // Flatten all treatments for the search, but keep them grouped for the UI
  const filteredNavItems = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return servicesData.navItems;

    return servicesData.navItems
      .map((item) => ({
        ...item,
        categories: item.categories
          .map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.filter(
              (sub) =>
                sub.title.toLowerCase().includes(query) ||
                sub.shortDescription?.toLowerCase().includes(query) ||
                sub.longDescription?.toLowerCase().includes(query),
            ),
          }))
          .filter((cat) => cat.subcategories.length > 0),
      }))
      .filter((item) => item.categories.length > 0);
  }, [search, servicesData]);

  return (
    <div className="flex flex-col gap-10">
      {/* 🔍 SEARCH BAR - Sticky on Mobile */}
      <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-sm py-4">
        <div className="max-w-md mx-auto relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            className="pl-10 h-12 rounded-2xl border-border shadow-lg focus:ring-primary/20"
            placeholder={
              dict.giftStore?.searchPlaceholder || "Busca un masaje..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🧩 CATALOG LIST */}
      <div className="space-y-20">
        {filteredNavItems.map((navItem) => (
          <section
            key={navItem.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-8 text-foreground border-b pb-4">
              <span>{navItem.emoji}</span> {navItem.label}
            </h2>

            <div className="space-y-12">
              {navItem.categories.map((cat) => (
                <div key={cat.slug} className="space-y-6">
                  <h3 className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">
                    {cat.title}
                  </h3>

                  {/* ADAPTIVE GRID: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.slug}
                        className="flex flex-col bg-card rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group"
                      >
                        {/* Image Section */}
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={sub.image}
                            alt={sub.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <PromoBadge
                            text={sub.promoBadgeText}
                            className="absolute top-3 right-3"
                          />
                        </div>

                        {/* Text Content */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {sub.title}
                            </h4>
                            <span className="text-xl">{sub.emoji}</span>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                            {sub.shortDescription}
                          </p>

                          {/* REUSABLE PRICING PILLS */}
                          <div className="mt-auto space-y-4">
                            <PricingPills
                              options={sub.options || []}
                              baseLink={`/${lang}/${cat.slug}/${sub.slug}`}
                            />

                            <Link
                              href={`/${lang}/${cat.slug}/${sub.slug}`}
                              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary-hover transition-colors shadow-sm"
                            >
                              <Gift className="w-4 h-4" />
                              {dict.giftStore?.giftButton || "Gift Treatment"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredNavItems.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground italic">
              {dict.giftStore?.noResults ||
                "No se han encontrado tratamientos."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

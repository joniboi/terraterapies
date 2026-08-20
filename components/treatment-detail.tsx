"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Option, Dictionary } from "@/types/definitions";
import { BigPriceDisplay } from "@/components/treatment/big-price-display";

interface TreatmentDetailProps {
  lang: string;
  dict: Dictionary["booking"];
  categorySlug: string;
  subCategorySlug: string;
  title: string;
  description: string;
  backgroundImage: string;
  options: Option[];
  bookingUrl: string | null | undefined;
  businessName: string;
}

export default function TreatmentDetail({
  lang,
  dict,
  categorySlug,
  subCategorySlug,
  title,
  description,
  backgroundImage,
  options,
  bookingUrl,
  businessName,
}: TreatmentDetailProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [form, setForm] = useState({ from: "", to: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanTitle = title
    .replace(
      /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
      "",
    )
    .replace("—", "")
    .trim();

  const seoAltText = `${cleanTitle} - ${businessName}`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const durationParam = params.get("duration");

    if (durationParam && options.length > 0) {
      const matchedOption = options.find(
        (opt) => opt.duration === durationParam,
      );
      setSelectedOption(matchedOption || options[0]);
    } else if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  const handlePayment = async () => {
    setErrorMessage(null);
    if (!selectedOption || !form.from || !form.to) {
      setErrorMessage(dict.alerts.fillAll);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          categorySlug,
          subCategorySlug,
          optionIndex: options.indexOf(selectedOption),
          from: form.from,
          to: form.to,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(dict.alerts.error);
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-stretch pt-32 md:pt-40">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt={seoAltText}
          fill
          className="object-cover brightness-95 opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* Left side — description */}
      <div className="w-full md:w-2/3 px-8 md:px-16 py-20 flex flex-col justify-between">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-white mb-8 drop-shadow-lg">
            {title}
          </h1>
          <div className="prose prose-invert prose-lg max-w-none drop-shadow-md">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Right side — gift panel */}
      <div className="w-full md:w-1/3 bg-gray-900/45 border border-white/30 p-8 md:p-12 flex flex-col justify-center rounded-2xl shadow-xl">
        <h2 className="font-heading text-2xl font-semibold text-white mb-6">
          {dict.giftTitle}
        </h2>

        <div className="space-y-4">
          <DropdownMenu color="light">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                color="light"
                className="w-full justify-between text-gray-700 font-medium"
              >
                {selectedOption ? selectedOption.duration : dict.selectDuration}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {options.map((opt, i) => (
                <DropdownMenuItem
                  key={i}
                  onSelect={() => setSelectedOption(opt)}
                  className="flex justify-between w-full cursor-pointer"
                >
                  <span>{opt.duration}</span>
                  {opt.isPromo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        {opt.originalPrice}
                      </span>
                      <span className="font-bold text-highlight">
                        {opt.price}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-gray-700">
                      {opt.price}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 🚀 EXTRACTED COMPONENT */}
          <BigPriceDisplay option={selectedOption} />

          <div className="space-y-3 mt-6">
            <Input
              placeholder={dict.fromPlaceholder}
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              color="light"
              required
            />
            <Input
              placeholder={dict.toPlaceholder}
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              color="light"
              required
            />
            <Textarea
              placeholder={dict.msgPlaceholder}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              color="light"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm font-medium mt-4">
              {errorMessage}
            </div>
          )}

          <Button
            className="w-full mt-8 bg-primary text-primary-foreground text-lg py-3 rounded-full hover:bg-primary-hover transition-all"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? dict.processing : dict.payBtn}
          </Button>
        </div>
      </div>
    </section>
  );
}

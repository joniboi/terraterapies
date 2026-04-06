"use client";

import { useState } from "react";
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
import TreatwellModal from "@/components/treatwell/treatwell-modal";
import ReactMarkdown from "react-markdown";
import { Option, Dictionary } from "@/types/definitions";

interface TreatmentDetailProps {
  lang: string; // <--- New Prop
  dict: Dictionary["booking"]; // <--- New Prop

  categorySlug: string;
  subCategorySlug: string;
  title: string;
  description: string;
  backgroundImage: string;
  options: Option[];
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
}: TreatmentDetailProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [form, setForm] = useState({ from: "", to: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  const handlePayment = async () => {
    if (!selectedOption || !form.from || !form.to) {
      alert(dict.alerts.fillAll); // <--- Dynamic Alert
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang, // <--- Send language to API
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
      alert(dict.alerts.error); // <--- Dynamic Alert
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-stretch pt-32 md:pt-40">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover brightness-95 opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* Left side — description */}
      <div className="w-full md:w-2/3 px-8 md:px-16 py-20 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-8 drop-shadow-lg">
            {title}
          </h1>
          {/* 2. REPLACE THE <p> TAG WITH THIS: */}
          {/* 
            'prose' activates the typography plugin 
            'prose-invert' makes the text white (since your background is dark)
            'prose-lg' makes it slightly larger and more readable
          */}
          <div className="prose prose-invert prose-lg max-w-none drop-shadow-md">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-12">
          <Button size="lg" onClick={() => setShowWidget(true)}>
            {dict.bookBtn}
          </Button>
        </div>
      </div>

      {/* Right side — gift panel */}
      <div className="w-full md:w-1/3 bg-gray-900/45 border border-white/30 p-8 md:p-12 flex flex-col justify-center rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {dict.giftTitle} {/* <--- Dynamic */}
        </h2>

        {/* Duration / Price selector */}
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

                  {/* 1. SHOW CROSSED OUT PRICE IN THE DROPDOWN */}
                  {opt.isPromo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        {opt.originalPrice}
                      </span>
                      <span className="font-bold text-amber-600">
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

          {/* 2. THE LARGE PRICE DISPLAY */}
          {selectedOption && (
            <div className="text-center py-2 animate-in fade-in zoom-in duration-300">
              {selectedOption.isPromo ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl text-gray-400 line-through decoration-red-400">
                      {selectedOption.originalPrice}
                    </span>
                    <span className="text-4xl text-amber-400 font-bold drop-shadow-md">
                      {selectedOption.price}
                    </span>
                  </div>
                  {/* Optional: Add a little urgency! */}
                  {selectedOption.promoEnds && (
                    <span className="inline-block mt-2 text-xs text-amber-200 uppercase tracking-widest font-semibold bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                      Offer ends {selectedOption.promoEnds}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-4xl text-white font-bold drop-shadow-md">
                  {selectedOption.price}
                </p>
              )}
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-3 mt-6">
            <Input
              placeholder={dict.fromPlaceholder} // <--- Dynamic
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              color="light"
              required
            />
            <Input
              placeholder={dict.toPlaceholder} // <--- Dynamic
              color="light"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              required
            />
            <Textarea
              placeholder={dict.msgPlaceholder} // <--- Dynamic
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              color="light"
            />
          </div>

          {/* Payment button */}
          <Button
            className="w-full mt-8 bg-gray-900 text-white text-lg py-3 rounded-full hover:bg-gray-800 transition-all"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? dict.processing : dict.payBtn} {/* <--- Dynamic */}
          </Button>
        </div>
      </div>
      <TreatwellModal open={showWidget} onClose={() => setShowWidget(false)} />
    </section>
  );
}

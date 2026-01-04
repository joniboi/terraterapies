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

interface Option {
  duration: string;
  price: string;
}

interface TreatmentDetailProps {
  categorySlug: string;
  subCategorySlug: string;

  title: string;
  description: string;
  backgroundImage: string;
  options: Option[];
}

export default function TreatmentDetail({
  categorySlug,
  subCategorySlug,
  title,
  description,
  backgroundImage,
  options,
}: TreatmentDetailProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [form, setForm] = useState({ from: "", to: "", message: "" });
  const [loading, setLoading] = useState(false); // Optional: nice for UX

  const handlePayment = async () => {
    if (!selectedOption || !form.from || !form.to) {
      alert("Por favor rellena todos los datos");
      return;
    }

    setLoading(true);

    // Assuming you can get slug/index from props or derived state
    // You might need to pass the slug as a prop to TreatmentDetail

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: categorySlug, // You need to pass this prop
          subCategorySlug: subCategorySlug,
          optionIndex: options.indexOf(selectedOption), // Find index
          from: form.from,
          to: form.to,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-stretch pt-32 md:pt-40">
      {/* Background image with soft fade */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover brightness-95 opacity-90"
          priority
        />
        {/* No fade overlay at all */}
        <div className="absolute inset-0 bg-transparent" />
      </div>

      {/* Left side — description */}
      <div className="w-full md:w-2/3 px-8 md:px-16 py-20 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-8 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-line drop-shadow-md">
            {description}
          </p>
        </div>

        <div className="mt-12">
          <Button
            size="lg"
            className="px-10 py-4 text-lg rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all"
            onClick={() => alert("Open Treatwell widget here")}
          >
            Reservar
          </Button>
        </div>
      </div>

      {/* Right side — gift panel */}
      <div className="w-full md:w-1/3 bg-gray-900/45 border border-white/30 p-8 md:p-12 flex flex-col justify-center rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Regala este tratamiento
        </h2>

        {/* Duration / Price selector */}
        <div className="space-y-4">
          <DropdownMenu color="light">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                color="light"
                className="w-full justify-between text-gray-700"
              >
                {selectedOption
                  ? selectedOption.duration
                  : "Selecciona duración"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {options.map((opt, i) => (
                <DropdownMenuItem
                  key={i}
                  onSelect={() => setSelectedOption(opt)}
                >
                  {opt.duration} ({opt.price})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedOption && (
            <p className="text-lg text-white font-medium text-center">
              {selectedOption.price}
            </p>
          )}

          {/* Form fields */}
          <div className="space-y-3 mt-6">
            <Input
              placeholder="De (tu nombre)"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              color="light"
              required
            />
            <Input
              placeholder="Para (nombre del destinatario)"
              color="light"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              required
            />
            <Textarea
              placeholder="Mensaje o dedicatoria (opcional)"
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
            {loading ? "Procesando..." : "Proceder al pago"}
          </Button>
        </div>
      </div>
    </section>
  );
}

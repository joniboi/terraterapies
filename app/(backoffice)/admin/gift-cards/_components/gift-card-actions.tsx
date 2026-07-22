"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download, Mail, Send, CheckCircle2 } from "lucide-react";
import RedeemButton from "./redeem-button"; // <-- Import your existing button!
import { useRouter } from "next/dist/client/components/navigation";

interface UnifiedActionsProps {
  card: {
    id: string;
    locatorCode: string;
    buyerEmail: string;
    status: string;
    totalSessions: number;
    usedSessions: number;
    redeemedAt: Date | null;
  };
}

export function GiftCardActions({ card }: UnifiedActionsProps) {
  const router = useRouter();
  const [email, setEmail] = useState(card.buyerEmail);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = () => {
    window.location.href = `/api/admin/gift-cards/${card.id}/download?lang=es`;
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setIsSuccess(false);

    try {
      const res = await fetch(`/api/admin/gift-cards/${card.id}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: email, lang: "es" }),
      });

      if (res.ok) {
        setIsSuccess(true);
        router.refresh(); // 3. <-- Trigger the background table refresh!
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert("Error al reenviar. Revisa la consola.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 w-full">
      {/* --- ADMIN ACTIONS (Download / Resend) --- */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
          onClick={handleDownload}
          title="Descargar PDF"
        >
          <Download className="w-4 h-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
              title="Corregir Email y Reenviar"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-72 p-4 border-border bg-popover text-popover-foreground shadow-md rounded-lg"
          >
            <form onSubmit={handleResend} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`email-${card.id}`}
                  className="text-sm font-semibold"
                >
                  Fix Email and resend
                </Label>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  The email will be updated in the database automatically.
                </p>
                <Input
                  id={`email-${card.id}`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-input h-8 text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={isSending || isSuccess}
                className="w-full h-8 text-xs flex items-center justify-center gap-2"
              >
                {isSending ? (
                  "Enviando..."
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> ¡Enviado!
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" /> Enviar PDF
                  </>
                )}
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      {/* --- BUSINESS ACTION (Redeem / Completed Status) --- */}
      <div className="w-[180px] flex justify-end">
        {card.status === "valid" ? (
          <RedeemButton
            id={card.id}
            code={card.locatorCode}
            isBono={card.totalSessions > 1}
            remaining={card.totalSessions - card.usedSessions}
          />
        ) : (
          <div className="text-[10px] text-success font-black uppercase tracking-widest px-2 text-right">
            Completed {card.redeemedAt?.toLocaleDateString("en-GB")}
          </div>
        )}
      </div>
    </div>
  );
}

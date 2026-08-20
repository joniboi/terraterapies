"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";

export default function RedeemButton({
  id,
  code,
  remaining,
  isBono,
}: {
  id: string;
  code: string;
  remaining?: number;
  isBono?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/gift-cards/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError("Error: No se pudo registrar la visita en el servidor.");
      }
    } catch (err) {
      console.error(err);
      setError("Error: Error de conexión de red.");
    } finally {
      setLoading(false);
    }
  };

  const btnText = isBono
    ? `Consume 1 Session (${remaining} left)`
    : "Mark as Redeemed";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) setError(null); // Reset error state on close
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full text-success border-success-border hover:bg-success-background hover:text-success font-bold"
          />
        }
      >
        {btnText}
      </AlertDialogTrigger>

      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Registrar Visita?</AlertDialogTitle>
          <AlertDialogDescription>
            {isBono
              ? `You are about to deduct 1 session from pack ${code}. There will be ${remaining! - 1} sessions remaining.`
              : `You are about to mark gift card ${code} as REDEEMED. This action is final.`}
          </AlertDialogDescription>

          {error && (
            <div className="mt-3 text-sm text-destructive font-semibold">
              {error}
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <Button
            className="bg-success hover:opacity-90 text-success-foreground"
            onClick={handleRedeem}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Visit"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

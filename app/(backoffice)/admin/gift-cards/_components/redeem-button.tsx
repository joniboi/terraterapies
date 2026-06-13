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

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gift-cards/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Error updating card");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const btnText = isBono
    ? `Consume 1 Session (${remaining} left)`
    : "Mark as Redeemed";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { redeemGiftCardAction } from "@/app/(backoffice)/admin/gift-cards/actions";
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
}: {
  id: string;
  code: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRedeem = async () => {
    setLoading(true);
    const res = await redeemGiftCardAction(id);
    if (!res.success) {
      alert("Error updating card");
      setLoading(false);
    } else {
      // revalidatePath in the action will handle the UI update
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* 1. Use 'render' instead of 'asChild' */}
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 cursor-pointer"
          />
        }
      >
        Mark Used
      </AlertDialogTrigger>

      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Redeem Gift Card</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark locator{" "}
            <span className="font-mono font-bold text-gray-900">{code}</span> as
            **REDEEMED**? This will record the current time and cannot be
            reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* 2. Cancel Button with 'render' */}
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>

          {/* 3. Confirm Button - We manually handle click to show loading state */}
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={handleRedeem}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Redemption"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function GiftCardStatusFilter({
  currentStatus,
}: {
  currentStatus: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Base UI logic:
    // If you click an unselected item, 'values' becomes [newItem]
    // If you click the already selected item, 'values' becomes [] (Unselect All)
    const nextValue = values[0];

    if (nextValue) {
      params.set("status", nextValue);
    } else {
      params.delete("status");
    }

    router.push(`/admin/gift-cards?${params.toString()}`);
  };

  return (
    <ToggleGroup
      multiple={false}
      value={currentStatus ? [currentStatus] : []}
      onValueChange={handleValueChange}
      variant="outline"
    >
      <ToggleGroupItem value="valid">Valid</ToggleGroupItem>
      <ToggleGroupItem value="redeemed">Redeemed</ToggleGroupItem>
    </ToggleGroup>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { AdminAction } from "@/components/admin/admin-action";
import { CampaignWithRelations } from "@/types/definitions";

export default function CampaignActionsCell({
  campaign,
}: {
  campaign: CampaignWithRelations;
}) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(campaign.isActive);

  const toggleStatus = async (checked: boolean) => {
    setIsActive(checked);
    try {
      await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campaign, isActive: checked }),
      });
      router.refresh();
    } catch {
      setIsActive(!checked);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete campaign "${campaign.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Cannot delete campaign.");
      } else {
        router.refresh();
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div
      className="flex items-center justify-end gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5" title="Toggle active status">
        <Switch checked={isActive} onCheckedChange={toggleStatus} />
      </div>
      <AdminAction
        href={`/admin/campaigns/${campaign.id}`}
        type="edit"
        label="Edit"
      />
      <AdminAction onClick={handleDelete} type="delete" label="Delete" />
    </div>
  );
}

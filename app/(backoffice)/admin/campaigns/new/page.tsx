import { db } from "@/db";
import CampaignForm from "../_components/campaign-form";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const [serviceGroups, categories, treatments, existingCampaigns] =
    await Promise.all([
      db.query.serviceGroups.findMany({
        orderBy: (sg, { asc }) => [asc(sg.orderIndex)],
      }),
      db.query.categories.findMany({
        orderBy: (c, { asc }) => [asc(c.orderIndex)],
      }),
      db.query.treatments.findMany({ with: { variants: true } }),
      db.query.campaigns.findMany({
        where: (c, { eq }) => eq(c.isActive, true),
        with: {
          serviceGroupTargets: true,
          categoryTargets: true,
          treatmentTargets: true,
        },
      }),
    ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Create Promotional Campaign
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set up a new promotional campaign with dynamic targeting and purchase
          limits.
        </p>
      </div>

      <CampaignForm
        availableServiceGroups={serviceGroups}
        availableCategories={categories}
        availableTreatments={treatments}
        existingActiveCampaigns={existingCampaigns}
      />
    </div>
  );
}

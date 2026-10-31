import { db } from "@/db";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { campaigns } from "@/db/schema";
import CampaignForm from "../_components/campaign-form";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [campaign, serviceGroups, categories, treatments, existingCampaigns] =
    await Promise.all([
      db.query.campaigns.findFirst({
        where: eq(campaigns.id, id),
        with: {
          serviceGroupTargets: true,
          categoryTargets: true,
          treatmentTargets: true,
        },
      }),
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

  if (!campaign) notFound();

  const formattedInitialData = {
    ...campaign,
    serviceGroupIds: campaign.serviceGroupTargets.map((t) => t.serviceGroupId),
    categoryIds: campaign.categoryTargets.map((t) => t.categoryId),
    treatmentIds: campaign.treatmentTargets.map((t) => t.treatmentId),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Edit Campaign: {campaign.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update targets, adjust promotional percentages, or change manual
          availability.
        </p>
      </div>

      <CampaignForm
        initialData={formattedInitialData}
        availableServiceGroups={serviceGroups}
        availableCategories={categories}
        availableTreatments={treatments}
        existingActiveCampaigns={existingCampaigns}
      />
    </div>
  );
}

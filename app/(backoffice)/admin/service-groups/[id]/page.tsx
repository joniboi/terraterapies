import { db } from "@/db";
import { eq } from "drizzle-orm";
import { serviceGroups } from "@/db/schema";
import { notFound } from "next/navigation";
import ServiceGroupForm from "../_components/service-group-form";

export default async function EditServiceGroupPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const group = await db.query.serviceGroups.findFirst({
    where: eq(serviceGroups.id, params.id),
  });

  if (!group) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Group: {group.label?.es}</h1>
      <ServiceGroupForm initialData={group} />
    </div>
  );
}

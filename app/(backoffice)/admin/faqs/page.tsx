import { db } from "@/db";
import FAQForm from "./_components/faq-form";

export default async function AdminFAQPage() {
  const settings = await db.query.siteSettings.findFirst();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">FAQ Manager</h1>
      <p className="text-muted-foreground mb-8">
        Manage the frequently asked questions, organized by sections.
      </p>

      <FAQForm initialData={settings} />
    </div>
  );
}

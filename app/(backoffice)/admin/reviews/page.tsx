import { db } from "@/db";
import { AdminTable, ColumnDef } from "@/components/admin/table/admin-table";
import { AdminHeader } from "@/components/admin/table/admin-header";
import { AdminAction } from "@/components/admin/admin-action";
import { StarIcon } from "lucide-react";

export default async function ReviewsListPage() {
  const allReviews = await db.query.reviews.findMany({
    orderBy: (reviews, { asc }) => [asc(reviews.orderIndex)],
  });

  const columns: ColumnDef<(typeof allReviews)[0]>[] = [
    {
      header: "Author",
      render: (rev) => (
        <div className="font-semibold text-foreground">{rev.authorName}</div>
      ),
    },
    {
      header: "Preview (ES)",
      render: (rev) => (
        <div className="text-sm text-muted-foreground truncate max-w-xs">
          {typeof rev.text === "string"
            ? rev.text
            : (rev.text as any)?.es || "No text"}
        </div>
      ),
    },
    {
      header: "Rating",
      render: (rev) => (
        <div className="flex text-highlight">
          {[...Array(rev.rating)].map((_, i) => (
            <StarIcon key={i} className="size-4 fill-current" />
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      render: (rev) =>
        rev.isActive ? (
          /* Using our new semantic Success tokens! */
          <span className="bg-success-background text-success border border-success-border px-2 py-1 rounded-md text-xs font-bold">
            Active
          </span>
        ) : (
          /* Using Muted for inactive/hidden states */
          <span className="bg-muted text-muted-foreground border border-border px-2 py-1 rounded-md text-xs font-bold">
            Hidden
          </span>
        ),
    },
    {
      header: "Action",
      className: "text-right w-32",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <AdminAction type="edit" href={`/admin/reviews/${row.id}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <AdminHeader
        title="Customer Reviews"
        subtitle="Manage the hand-picked reviews shown on the homepage slider"
        actionLabel="+ Add Review"
        actionHref="/admin/reviews/new"
      />
      <AdminTable data={allReviews} columns={columns} />
    </div>
  );
}

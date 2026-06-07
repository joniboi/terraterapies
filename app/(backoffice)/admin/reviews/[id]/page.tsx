import { db } from "@/db";
import { eq } from "drizzle-orm";
import { reviews } from "@/db/schema";
import { notFound } from "next/navigation";
import ReviewForm from "../_components/review-form";

export default async function EditReviewPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, parseInt(params.id)),
  });

  if (!review) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Edit Review: {review.authorName}
      </h1>
      <ReviewForm initialData={review} />
    </div>
  );
}

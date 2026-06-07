import ReviewForm from "../_components/review-form";

export default function NewReviewPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Review</h1>
      <ReviewForm />
    </div>
  );
}

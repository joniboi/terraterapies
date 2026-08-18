import ServiceGroupForm from "../_components/service-group-form";

export default function NewServiceGroupPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Service Group</h1>
      <ServiceGroupForm />
    </div>
  );
}

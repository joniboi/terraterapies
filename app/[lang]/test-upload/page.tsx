"use client";
export default function TestUpload() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    console.log("Uploaded URL:", data.url);
    alert(`Success! File saved at: ${data.url}`);
  };

  return (
    <div className="p-20">
      <h1 className="mb-4">Test Image Guardrail</h1>
      <input type="file" onChange={handleUpload} accept="image/*" />
    </div>
  );
}

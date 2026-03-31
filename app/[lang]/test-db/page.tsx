import { kv } from "@vercel/kv";

export default async function TestDBPage() {
  try {
    // 1. Write to the database
    // We are setting a key named "test_connection" with the text "Success!"
    await kv.set("test_connection", "Success! Connected to Upstash.");

    // 2. Read from the database
    const value = await kv.get("test_connection");

    // 3. Display result
    return (
      <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
        <h1>Database Connection Test</h1>
        <p>
          <strong>Status:</strong> {value ? "✅ Working" : "❌ Failed"}
        </p>
        <p>
          <strong>Value from DB:</strong> {value as string}
        </p>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: "50px", color: "red" }}>
        <h1>❌ Connection Error</h1>
        <p>Check your .env.local keys.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}

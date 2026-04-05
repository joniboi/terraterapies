import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Login | Terraterapies Thai & Bali",
  description: "Secure backoffice login",
};

// 1. Make the component async and type searchParams as a Promise
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // 2. Await the searchParams to "unwrap" them
  const resolvedSearchParams = await searchParams;

  const loginAction = async (formData: FormData) => {
    "use server";

    // 1. Extract exactly what we need (prevents NextAuth from getting confused by hidden fields)
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 2. Pass the exact credentials and the strict redirect path
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });
    } catch (error) {
      // 3. Handle the AuthError (Wrong password)
      if (error instanceof AuthError) {
        redirect("/signin?error=invalid");
      }

      // 4. CRITICAL: If login succeeds, NextAuth throws a "RedirectError".
      // We MUST re-throw it, otherwise the redirect to /admin gets cancelled!
      throw error;
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Terraterapies Thai & Bali Admin</h1>
        <p className="text-gray-500 mt-2">
          Sign in to manage treatments and prices.
        </p>
      </div>

      {/* 3. Use the unwrapped search params */}
      {resolvedSearchParams?.error === "invalid" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
          Invalid email or password. Please try again.
        </div>
      )}

      <form action={loginAction}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              className="form-input w-full py-2"
              type="email"
              placeholder="admin@terraterapies.com"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              className="form-input w-full py-2"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%]"
          >
            Sign In
          </button>
        </div>
      </form>
    </>
  );
}

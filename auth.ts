import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Compare with .env.local variables
        const adminEmail = process.env.ADMIN_EMAIL; // Use EMAIL instead of USERNAME
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPass
        ) {
          return { id: "1", name: "Admin", email: adminEmail };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Tell Auth.js to use your beautiful template!
  },
});

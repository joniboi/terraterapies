// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "./auth"; // <-- Import the Auth.js logic

const locales = ["es", "en", "ca"];
const defaultLocale = "es";

function getLocale(request: NextRequest) {
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

// Wrap the entire proxy function with our Auth "Bouncer"
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth; // True if your wife is logged in

  // --- 1. SECURITY LOGIC (Auth) ---
  const isInsideAdmin = pathname.startsWith("/admin");
  if (isInsideAdmin && !isLoggedIn) {
    // If she's not logged in, redirect to the beautiful login page
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  // --- 2. EXCLUSION LOGIC ---
  // We tell Next.js to ignore system files, uploads, and our admin/auth pages
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") || // <-- Ensure uploads are ignored!
    pathname.startsWith("/fonts") ||
    pathname.includes(".")
  ) {
    return; // Pass through untouched
  }

  // --- 3. I18N LANGUAGE LOGIC ---
  // Check for existing locale in the URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if language is missing
  const locale = getLocale(request as NextRequest);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
});

export const config = {
  matcher: ["/((?!_next).*)"],
};

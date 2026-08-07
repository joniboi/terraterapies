import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function intercepts incoming requests before they reach your pages
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the user visits the exact root domain (no language prefix)
  if (pathname === "/") {
    // Force a redirect to the default language folder (/es)
    return NextResponse.redirect(new URL("/es", request.url));
  }

  // Allow all other requests (like /ca, /en, /admin) to pass through normally
  return NextResponse.next();
}

// ⚙️ Optimization: Tell Next.js exactly which paths to run this middleware on.
// We exclude images, API routes, Next.js static files, and the admin panel
// to ensure your site stays blazing fast.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - uploads (your persistent image folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|uploads).*)",
  ],
};

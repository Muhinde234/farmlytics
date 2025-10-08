// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

// This is your next-intl middleware for internationalization
const handleI18nRouting = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Apply next-intl routing first
  const response = handleI18nRouting(request);
  const { pathname } = request.nextUrl;
  const locale = pathname.split('/')[1] || routing.defaultLocale; // Get the detected locale

  // Define protected routes (e.g., anything under /admin)
  const protectedPaths = [`/${locale}/admin`]; // Add more as needed
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // 2. Handle authentication for protected routes
  if (isProtectedRoute) {
    if (!token) {
      // If no token, redirect to the login page
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    // If token exists, allow access (middleware continues to next step or route handler)
    // Note: We're only checking for the *presence* of a token here.
    // Full token validation (e.g., expiry, signature) should ideally happen on the server/API.
  }

  // If not a protected route or if authenticated, continue with the response
  return response;
}

export const config = {
  // Match all pathnames except for static files, Next.js internals, and public assets.
  // We need to match `/` for the root path and then handle locale prefixes.
  matcher: [
    // This matcher will apply to all routes that are handled by next-intl,
    // which includes your localized paths.
    // It specifically excludes static files and internal Next.js paths.
    // This pattern should cover:
    // /
    // /{locale}
    // /{locale}/admin
    // /{locale}/login
    // etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ]
};
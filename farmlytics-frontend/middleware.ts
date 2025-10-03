import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Ignore Next internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    /\.(.*)$/.test(pathname)
  ) {
    return;
  }

  // Redirect if no locale in URL
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
  if (!localePattern.test(pathname)) {
    const defaultLocale = routing.defaultLocale || "en";
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}${search}`, req.url));
  }

  // Otherwise handle intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

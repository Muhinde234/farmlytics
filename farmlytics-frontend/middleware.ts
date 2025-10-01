import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from "next/server";
import { routing } from '@/i18n/routing';

export function middleware(request: NextRequest) {
  
  const intlResponse = createMiddleware(routing)(request);
  
 const pathname = request.nextUrl.pathname;
  
  
  

  
  return intlResponse;
}

export const config = {

  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
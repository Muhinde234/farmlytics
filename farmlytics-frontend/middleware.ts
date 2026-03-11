import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

export function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)
  const { pathname } = request.nextUrl
  const locale = pathname.split('/')[1] || routing.defaultLocale
  const isProtectedRoute = pathname.startsWith(`/${locale}/admin`)
  const token = request.cookies.get('token')?.value

  if (isProtectedRoute && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}

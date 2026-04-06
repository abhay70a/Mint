import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isDemo = req.nextUrl.searchParams.get('mode') === 'demo'
  const isDemoUI = pathname === '/' || pathname === '/demo' || pathname === '/dashboard'

  // Public paths (no auth required)
  if (
    pathname === '/' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/demo' ||
    (isDemo && isDemoUI)
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get('refreshToken')?.value || req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload }: any = await jwtVerify(token, secret)
    
    // Role-based protection
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    const response = NextResponse.next()
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;")

    return response
  } catch (err) {
    if (pathname.startsWith('/api')) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/requests/:path*',
    '/api/admin/:path*',
    '/api/profile/:path*',
  ],
}

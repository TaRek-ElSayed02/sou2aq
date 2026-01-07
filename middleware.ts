// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔍 Middleware checking:', pathname)
  console.log('🍪 All cookies:', request.cookies.getAll())
  console.log('🔑 AccessToken cookie:', request.cookies.get('accessToken')?.value)
  
  // المسارات العامة
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgotPassword',
    '/api',
    '/_next',
    '/favicon.ico'
  ]
  
  // تحقق إذا كان المسار عاماً
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    (pathname.startsWith(path + '/') && path !== '/')
  )
  
  if (isPublicPath) {
    console.log('✅ Public path, allowing access')
    return NextResponse.next()
  }
  
  // تحقق إذا كان المسار محمياً
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value
    
    console.log('🔐 Checking token for dashboard:', {
      path: pathname,
      hasCookieToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    })
    
    if (!token) {
      console.log('❌ No token in cookies, redirecting to login')
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('✅ Token found in cookies, allowing access')
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
}
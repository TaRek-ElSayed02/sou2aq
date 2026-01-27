// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // المسارات العامة
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgotPassword',
    '/auth/forgetPassword',
    '/auth/resetPassword',
    '/auth/verifyCode',
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
    return NextResponse.next()
  }
  
  // تحقق من التوكن للمسارات المحمية
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value
    
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // إذا كان في token، دع الطلب يمرر
    // الـ layout سيتولى الـ role-based access
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
}
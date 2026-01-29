// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  
  console.log('Middleware - Host:', host, 'Pathname:', pathname)
  
  // Handle subdomains (e.g., sub.localhost:3000 or sub.example.com)
  // Split by '.' and check if there's a subdomain
  const hostWithoutPort = host.split(':')[0]
  const hostParts = hostWithoutPort.split('.')
  
  // Check if this is a subdomain request for localhost
  // localhost has 1 part, sub.localhost has 2 parts
  const isLocalhost = hostParts[hostParts.length - 1] === 'localhost'
  const hasSubdomain = isLocalhost && hostParts.length === 2
  
  if (hasSubdomain) {
    const subdomain = hostParts[0]
    console.log('Detected subdomain:', subdomain)
    
    // Skip API and static file requests
    if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
      // Rewrite to the dynamic route
      const rewritePath = `/${subdomain}${pathname === '/' ? '' : pathname}`
      console.log('Rewriting to:', rewritePath)
      const url = new URL(rewritePath, request.url)
      return NextResponse.rewrite(url)
    }
  }
  
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
    '/favicon.ico',
    '/mysite'
  ]
  
  // تحقق إذا كان المسار عاماً
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    (pathname.startsWith(path + '/') && path !== '/')
  )
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Allow dynamic subdomain routes
  if (pathname.match(/^\/\[a-zA-Z0-9\-]+($|\/)/)) {
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
    '/:path*',
  ]
}
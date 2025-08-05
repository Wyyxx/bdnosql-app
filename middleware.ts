import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si el usuario está intentando acceder a rutas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Verificar si hay información de usuario en las cookies o headers
    const userRole = request.cookies.get('userRole')?.value
    const username = request.cookies.get('username')?.value
    
    // Si no hay información de usuario, redirigir al login
    if (!userRole || !username) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cars/:path*',
    '/clients/:path*',
    '/rentals/:path*',
    '/reports/:path*',
    '/repairs/:path*',
    '/returns/:path*'
  ]
} 
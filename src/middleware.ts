import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/rubicon-gate-portal')) {
    if (request.nextUrl.pathname === '/rubicon-gate-portal/login') {
      return NextResponse.next();
    }
    const auth = request.cookies.get('rubicon_admin_auth');
    if (!auth) {
      return NextResponse.redirect(new URL('/rubicon-gate-portal/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/rubicon-gate-portal/:path*'],
};

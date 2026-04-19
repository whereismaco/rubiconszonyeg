import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/portal')) {
    if (request.nextUrl.pathname === '/portal/login') {
      return NextResponse.next();
    }
    const auth = request.cookies.get('rubicon_admin_auth');
    if (!auth) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};

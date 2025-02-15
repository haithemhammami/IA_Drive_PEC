import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const productId = url.pathname.split('/').pop() || '';

  if (!productId || isNaN(Number(productId))) {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  req.nextUrl.searchParams.set('productId', productId);
  return NextResponse.next();
}

export const config = {
  matcher: '/products/:path*',
};

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/_next') || path.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const publicPaths = ['/', '/auth/signin', '/auth/signup', '/api/auth'];

  const isPublic =
    publicPaths.includes(path) ||
    publicPaths.some((p) => path.startsWith(`${p}/`));

  if (isPublic) {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  if (!session) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};

import { NextResponse, type NextRequest } from "next/server";

/**
 * Filesystem routes are case-sensitive, so /Halloween would 404. A
 * next.config `redirects()` entry can't do this: its matcher is
 * case-insensitive, so /halloween would match the /Halloween source and
 * redirect to itself forever. Hence an exact-case check here.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/Halloween") {
    const url = request.nextUrl.clone();
    url.pathname = "/halloween";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/Halloween",
};

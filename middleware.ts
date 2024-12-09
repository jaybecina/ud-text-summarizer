import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Define public and private routes
  const publicRoutes = ["/signin", "/signup"];
  const privateRoutes = ["/", "/profile", "/settings", "/history"];

  if (!authToken && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (authToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/settings", "/history", "/signin", "/signup"],
};

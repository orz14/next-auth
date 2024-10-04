import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token");

  const protectedPaths = ["/dashboard"];
  const isProtectedRoute = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (isProtectedRoute && !token) {
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/auth") && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|public).*)"],
};

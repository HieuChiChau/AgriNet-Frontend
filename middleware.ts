import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { AgriNetRoutes } from "./constants/route";
import { getAuthorization } from "./lib/apis/cache";
// import { UserRole } from "./constants/role";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = await getAuthorization();

  // const isPublicRoute = AgriNetRoutes.Public.some((route) =>
  //   path.startsWith(route)
  // );

  const isAdminRoute = path.startsWith("/manage");

  if (isAdminRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|assets).*)"],
};

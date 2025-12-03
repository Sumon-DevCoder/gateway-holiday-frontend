import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TUser } from "./types";
import { verifyJWT } from "./utils/verifyJWT";

// Public routes that don't require authentication
const PublicRoutes = [
  "/",
  "/tours",
  "/packages",
  "/blogs",
  "/contact",
  "/about",
  "/query", // Add query pages as public routes
];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  user: [
    /^\/dashboard\/user/,
    /^\/$/,
    /^\/tours/,
    /^\/packages/,
    /^\/blogs/,
    /^\/contact/,
    /^\/about/,
  ],
  admin: [
    /^\/dashboard\/admin/,
    /^\/$/,
    /^\/tours/,
    /^\/packages/,
    /^\/blogs/,
    /^\/contact/,
    /^\/about/,
  ],
  super_admin: [
    /^\/dashboard\/admin/,
    /^\/$/,
    /^\/tours/,
    /^\/packages/,
    /^\/blogs/,
    /^\/contact/,
    /^\/about/,
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (
    PublicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  // No token - redirect to home page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verify token and check role-based access
  try {
    const user = verifyJWT(token) as TUser;

    if (!user?.role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const allowedRoutes = roleBasedRoutes[user.role as Role];

    if (!allowedRoutes) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check if user has access to current route
    const hasAccess = allowedRoutes.some((route) => pathname.match(route));

    if (hasAccess) {
      return NextResponse.next();
    } else {
      // Redirect to appropriate dashboard based on role
      const dashboardPath = `/dashboard/${user.role}`;
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  } catch (error) {
    // Invalid token - redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/query/:path*", // Protect all query pages (package-tour, umrah, etc.)
  ],
};

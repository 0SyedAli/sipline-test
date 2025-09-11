// middleware.ts
import { NextResponse } from "next/server";

// Routes only accessible when NOT signed in
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

// Role-based protected routes
const roleRoutes = {
  user: [
    "/",
    "/add-address",
    "/product-details",
    "/wishlist",
    "/cart",
    "/checkout",
    "/payment-method",
    "/add-new-card",
    "/orders",
    "/shop",
    "/order-track",
  ],
  vendor: [
    "/dashboard",
    "/dashboard/products",
    "/dashboard/products/:path*",
    "/dashboard/management",
    "/dashboard/management/:path*",
    "/dashboard/categories",
    "/dashboard/inbox",
    "/dashboard/reviews",
    "/dashboard/settings",
    "/dashboard/about-app",
    "/dashboard/terms-and-condition",
    "/dashboard/privacy-policy",
    "/dashboard/payment-history",
  ],
  driver: [
    "/driver-home",
    "/add-address",
    "/my-profile",
    "/edit-profile",
    "/vehicle-information",
    "/edit-vehicle-information",
    "/profile",
    "/wallet",
    "/select-bank",
    "/account-details",
    "/contact-admin",
    "/faqs",
    "/terms-and-conditions",
    "/privacy-policy",
    "/my-orders",
    "/order-details",
    "/order-details/:path*",
  ],
};

// Common protected routes accessible to all authenticated users
const commonProtectedRoutes = ["/profile", "/settings"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;


  // Check if the path is an auth route (exact match)
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Check if the path is a common protected route
  const isCommonProtectedRoute = commonProtectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // Check if the path is a role-specific route
  const isUserRoute = roleRoutes.user.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  const isVendorRoute = roleRoutes.vendor.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  const isDriverRoute = roleRoutes.driver.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  const isRoleSpecificRoute = isUserRoute || isVendorRoute || isDriverRoute;
  const isProtectedRoute = isRoleSpecificRoute || isCommonProtectedRoute;

  // Handle auth routes - redirect if logged in
  if (isAuthRoute && token) {
    // Redirect to appropriate dashboard based on role
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Handle protected routes - redirect if not logged in
  if (isProtectedRoute && !token) {
    // Store the requested URL to redirect back after login
    request.nextUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(new URL("/auth/splash", request.url));
  }

  // Handle role-based access control
  if (token && isRoleSpecificRoute) {
    // Check if user has access to the specific role route
    if (isUserRoute && userRole !== "user") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isVendorRoute && userRole !== "vendor") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isDriverRoute && userRole !== "driver") {
      return NextResponse.redirect(new URL("/driver-home", request.url));
    }
  }

  // Public routes - always allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (api/)
     * - Static files (_next/static, _next/image)
     * - Favicon (favicon.ico)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
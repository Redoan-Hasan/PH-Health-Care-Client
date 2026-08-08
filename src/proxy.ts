import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";
type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings"],
  patterns: [], //[/password/change-password, /password/reset-password]
};

const doctorProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/doctor/], // Matches any route starting with /doctor/
};

const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin/], // Matches any route starting with /admin/
};

const patientProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/patient/], // Matches any route starting with /patient/
};

const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) =>pattern.test(pathname));
};

const getRouteOwner = (pathname:string): "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if(isRouteMatches(pathname, doctorProtectedRoutes)){
    return "DOCTOR";
  }
  if(isRouteMatches(pathname, adminProtectedRoutes)){
    return "ADMIN";
  }
  if(isRouteMatches(pathname, patientProtectedRoutes)){
    return "PATIENT";
  }
  if(isRouteMatches(pathname, commonProtectedRoutes)){
    return "COMMON";
  }
  return null;
};

const getDefaultDashboardRoute = (role: UserRole) => {
  if(role === "ADMIN") {
    return "/admin/dashboard";
  }
  if( role === "DOCTOR") {
    return "/doctor/dashboard";
  }
  if(role === "PATIENT") {
    return "/dashboard";
  }
  return "/";
}


// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value || null;
  let userRole: UserRole | null = null;

  if(accessToken){
    const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
    if(typeof verifiedToken === "string"){
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url))
    }
    userRole = verifiedToken.role;
  }
  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);


  //if user is logged in and trying to access auth routes, redirect to default dashboard
  if(accessToken && isAuth){
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
  }

  //if user is trying to access open public routes
  if(routeOwner === null){
    return NextResponse.next();
  }

  //if user is trying to access common protected routes 
  if(routeOwner === "COMMON"){
    if(!accessToken){
      return NextResponse.redirect(new URL("/login", request.url));
    }
  return NextResponse.next();
  }


  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};

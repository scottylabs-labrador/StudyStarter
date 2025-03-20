import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    '/feed(.*)',
    '/profile(.*)',
    '/login(.*)',
    '/create_account(.*)',
  ]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
});
  
export const config = {
  matcher: ['/', '/create_account(.*)', '/login', '/profile', '/feed'],
};
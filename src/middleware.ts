import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
    '/feed(.*)',
    '/myGroup(.*)',
    '/profile(.*)',
    '/login(.*)',
    '/create_account(.*)',
  ]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
});
  
export const config = {
  matcher: ['/', '/create_account(.*)', '/login', '/profile(.*)', '/feed(.*)', '/myGroup(.*)'],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/feed(.*)",
//   "/profile(.*)",
//   "/login(.*)",
//   "/create_account(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (!isProtectedRoute(req)) return;

//   const { userId, sessionClaims } = await auth();

//   // 🔒 Not logged in → let Clerk handle it (DO NOT return)
//   if (!userId) {
//     auth().protect();
//     return;
//   }

//   const email = sessionClaims?.email;

//   // 🚫 Block @andrew.cmu.edu users
//   if (email && email.endsWith("@andrew.cmu.edu")) {
//     return NextResponse.redirect(new URL("/faculty-restricted", req.url));
//   }

//   // ✅ Allow access
//   auth().protect();
// });

// export const config = {
//   matcher: ["/", "/create_account(.*)", "/login", "/profile", "/feed"],
// };

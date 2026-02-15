import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    (await auth()).protect({
      unauthenticatedUrl: "/sign-in",
    });
  }
});

export const config = {
  matcher: [
    // Include auth pages and other routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|cur|heic|heif|mp4)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

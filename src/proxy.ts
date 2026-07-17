import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { PROTECTED_ROUTE_PREFIXES, matchesRoutePrefix } from "@/lib/constants";

export default clerkMiddleware(async (auth, request) => {
  if (matchesRoutePrefix(request.nextUrl.pathname, PROTECTED_ROUTE_PREFIXES)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?|map)).*)",
    "/(api|trpc)(.*)",
  ],
};

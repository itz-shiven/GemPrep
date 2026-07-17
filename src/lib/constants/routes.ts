export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  interviewWorkspace: "/workspace/interview",
  room: (roomId: string) => `/room/${roomId}`,
  roomWaiting: (roomId: string) => `/room/${roomId}/waiting`,
} as const;

export const PUBLIC_ROUTE_PREFIXES = [
  ROUTES.home,
  ROUTES.signIn,
  ROUTES.signUp,
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.onboarding,
  ROUTES.dashboard,
  "/workspace",
  "/room",
] as const;

export function matchesRoutePrefix(
  pathname: string,
  prefixes: readonly string[],
) {
  return prefixes.some((prefix) => {
    if (prefix === ROUTES.home) {
      return pathname === ROUTES.home;
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

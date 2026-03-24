const PUBLIC_AUTH_ROUTE_KEYS = new Set([
    "POST /auth/register",
    "POST /auth/login",
    "POST /auth/verify-code",
    "POST /auth/social",
    "POST /auth/refresh",
    "POST /auth/logout",
    "POST /auth/password-reset/request",
    "POST /auth/password-reset/confirm"
]);

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) {
        return path.slice(0, -1);
    }

    return path;
}

export function isPublicAuthRoute(method: string, path: string): boolean {
    const routeKey = `${method.toUpperCase()} ${normalizePath(path)}`;
    return PUBLIC_AUTH_ROUTE_KEYS.has(routeKey);
}

import type {NextFunction, Request, Response} from "express";

import {isPublicAuthRoute} from "@/entities/auth/constants/public-auth-routes";
import {validateAccessToken} from "@/integrations/auth-service/services/auth-service-service";
import {HttpError} from "@/shared/http-error";

function getAuthorizationHeader(req: Request): string | undefined {
    return req.get("Authorization")?.trim();
}

function isPublicRequest(req: Request): boolean {
    if (req.method.toUpperCase() === "OPTIONS") {
        return true;
    }

    if (req.path === "/health") {
        return true;
    }

    return isPublicAuthRoute(req.method, req.path);
}

export async function authenticateRequest(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (isPublicRequest(req)) {
        next();
        return;
    }

    const authorization = getAuthorizationHeader(req);

    if (!authorization?.startsWith("Bearer ")) {
        next(new HttpError("Unauthorized", {status: 401}));
        return;
    }

    try {
        req.authUser = await validateAccessToken(authorization, req.get("X-Request-Id"));
        next();
    } catch (error) {
        next(error);
    }
}

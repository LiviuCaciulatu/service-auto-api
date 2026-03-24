import type {Request, Response} from "express";
import {Router} from "express";

import type {
    AuthLoginRequest,
    AuthMessageResponse,
    AuthPasswordResetConfirmRequest,
    AuthPasswordResetRequest,
    AuthRefreshTokenRequest,
    AuthRegisterRequest,
    AuthServiceResponse,
    AuthSocialRequest,
    AuthTokenResponse,
    AuthVerifyCodeRequest
} from "@/integrations/auth-service/types";
import {proxyAuthServiceRequest} from "@/integrations/auth-service/services/auth-service-service";
import {HttpError} from "@/shared/http-error";
import {asyncHandler} from "@/shared/async-handler";

const router: import("express").Router = Router();

function sendAuthServiceResponse(res: Response, response: AuthServiceResponse<unknown>): void {
    res.status(response.status).json(response.body);
}

function getRequestId(req: Request): string | undefined {
    return req.get("X-Request-Id");
}

function getRequiredAuthorizationHeader(req: Request): string {
    const authorization = req.get("Authorization")?.trim();

    if (!authorization?.startsWith("Bearer ")) {
        throw new HttpError("Unauthorized", {status: 401});
    }

    return authorization;
}

function normalizeSocialRequestBody(body: AuthSocialRequest): AuthSocialRequest {
    return {
        ...body,
        provider: typeof body.provider === "string" ? body.provider.toUpperCase() : body.provider
    };
}

router.post("/register", asyncHandler(async (req: Request<{}, unknown, AuthRegisterRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/auth/register",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/login", asyncHandler(async (req: Request<{}, unknown, AuthLoginRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/auth/login",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/verify-code", asyncHandler(async (req: Request<{}, unknown, AuthVerifyCodeRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/auth/verify-code",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/social", asyncHandler(async (req: Request<{}, unknown, AuthSocialRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/auth/social",
        body: normalizeSocialRequestBody(req.body),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/social/link", asyncHandler(async (req: Request<{}, unknown, AuthSocialRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/social-accounts/link",
        body: normalizeSocialRequestBody(req.body),
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/refresh", asyncHandler(async (req: Request<{}, unknown, AuthRefreshTokenRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthTokenResponse>({
        method: "POST",
        path: "/api/v1/auth/refresh",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/logout", asyncHandler(async (req: Request<{}, unknown, AuthRefreshTokenRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthMessageResponse>({
        method: "POST",
        path: "/api/v1/auth/logout",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/password-reset/request", asyncHandler(async (req: Request<{}, unknown, AuthPasswordResetRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthMessageResponse>({
        method: "POST",
        path: "/api/v1/auth/password-reset/request",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/password-reset/confirm", asyncHandler(async (req: Request<{}, unknown, AuthPasswordResetConfirmRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthMessageResponse>({
        method: "POST",
        path: "/api/v1/auth/password-reset/confirm",
        body: req.body,
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.get("/validate", asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) {
        throw new HttpError("Unauthorized", {status: 401});
    }

    res.status(200).json(req.authUser);
}));

export default router;

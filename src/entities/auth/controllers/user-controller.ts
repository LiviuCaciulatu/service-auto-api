import type {Request, Response} from "express";
import {Router} from "express";

import type {
    AuthAdminCreateUserRequest,
    AuthMessageResponse,
    AuthServiceResponse,
    AuthUserEnable2FARequest,
    AuthUserResponse,
    AuthUsersReportResponse,
    AuthUserUpdateRequest
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

function getQueryString(req: Request): string {
    const queryIndex = req.url.indexOf("?");
    return queryIndex >= 0 ? req.url.slice(queryIndex) : "";
}

router.get("/own", asyncHandler(async (req: Request, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUserResponse>({
        method: "GET",
        path: "/api/v1/users/own",
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.patch("/own", asyncHandler(async (req: Request<{}, unknown, AuthUserUpdateRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUserResponse>({
        method: "PATCH",
        path: "/api/v1/users/own",
        body: req.body,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.get("/report", asyncHandler(async (req: Request, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUsersReportResponse>({
        method: "GET",
        path: `/api/v1/users/report${getQueryString(req)}`,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.post("/admins", asyncHandler(async (req: Request<{}, unknown, AuthAdminCreateUserRequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUserResponse>({
        method: "POST",
        path: "/api/v1/users/admins",
        body: req.body,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.patch("/two-factor-authentication", asyncHandler(async (req: Request<{}, unknown, AuthUserEnable2FARequest>, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthMessageResponse>({
        method: "PATCH",
        path: "/api/v1/users/two-factor-authentication",
        body: req.body,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUserResponse>({
        method: "GET",
        path: `/api/v1/users/${req.params.id}`,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

router.patch("/:id", asyncHandler(async (req: Request, res: Response) => {
    const response = await proxyAuthServiceRequest<AuthUserResponse>({
        method: "PATCH",
        path: `/api/v1/users/${req.params.id}`,
        body: req.body as AuthUserUpdateRequest,
        authorization: getRequiredAuthorizationHeader(req),
        requestId: getRequestId(req)
    });

    sendAuthServiceResponse(res, response);
}));

export default router;

import {env} from "@/config/env";
import type {AuthServiceResponse, AuthValidationResponse} from "@/integrations/auth-service/types";
import {HttpError} from "@/shared/http-error";

type AuthServiceRequestOptions = {
    method: "GET" | "POST" | "PATCH";
    path: string;
    body?: unknown;
    authorization?: string | undefined;
    requestId?: string | undefined;
};

const AUTHORIZATION_HEADER = "Authorization";
const CLIENT_CODE_HEADER = "X-Client-Code";
const JSON_CONTENT_TYPE = "application/json";
const REQUEST_ID_HEADER = "X-Request-Id";

function buildAuthServiceUrl(path: string): string {
    const baseUrl = env.authServiceEndpoint.endsWith("/")
        ? env.authServiceEndpoint
        : `${env.authServiceEndpoint}/`;

    return new URL(path.replace(/^\//, ""), baseUrl).toString();
}

function getHeaders(options: AuthServiceRequestOptions): Headers {
    const headers = new Headers({
        [CLIENT_CODE_HEADER]: env.authServiceAuthorizationCode
    });

    if (options.authorization) {
        headers.set(AUTHORIZATION_HEADER, options.authorization);
    }

    if (options.requestId) {
        headers.set(REQUEST_ID_HEADER, options.requestId);
    }

    if (options.body !== undefined) {
        headers.set("Content-Type", JSON_CONTENT_TYPE);
    }

    return headers;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getResponseMessage(body: unknown): string | undefined {
    if (!isRecord(body)) {
        return undefined;
    }

    return typeof body.message === "string" ? body.message : undefined;
}

function getResponseErrors(body: unknown): Record<string, string> | undefined {
    if (!isRecord(body) || !isRecord(body.errors)) {
        return undefined;
    }

    const normalizedErrors = Object.entries(body.errors).reduce<Record<string, string>>((accumulator, [key, value]) => {
        if (typeof value === "string") {
            accumulator[key] = value;
        }

        return accumulator;
    }, {});

    return Object.keys(normalizedErrors).length > 0 ? normalizedErrors : undefined;
}

function normalizeResponseBody(status: number, body: unknown): Record<string, unknown> {
    if (isRecord(body)) {
        return body;
    }

    if (typeof body === "string" && body.length > 0) {
        return {
            code: status,
            message: body
        };
    }

    return {code: status};
}

async function parseResponseBody(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes(JSON_CONTENT_TYPE)) {
        return await response.json();
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

function getNetworkErrorMessage(error: unknown): string {
    if (error instanceof Error && error.name === "TimeoutError") {
        return "Authentication service timed out";
    }

    return "Authentication service is unavailable";
}

async function requestAuthService<TBody>(options: AuthServiceRequestOptions): Promise<AuthServiceResponse<TBody>> {
    try {
        const requestInit: RequestInit = {
            method: options.method,
            headers: getHeaders(options),
            signal: AbortSignal.timeout(env.authServiceTimeoutMs)
        };

        if (options.body !== undefined) {
            requestInit.body = JSON.stringify(options.body);
        }

        const response = await fetch(buildAuthServiceUrl(options.path), requestInit);

        const body = normalizeResponseBody(response.status, await parseResponseBody(response));

        return {
            status: response.status,
            body
        };
    } catch (error) {
        throw new HttpError(getNetworkErrorMessage(error), {status: 503});
    }
}

function isAuthValidationResponse(body: unknown): body is AuthValidationResponse {
    return isRecord(body)
        && typeof body.id === "string"
        && typeof body.email === "string"
        && typeof body.role === "string";
}

export async function proxyAuthServiceRequest<TBody>(options: AuthServiceRequestOptions): Promise<AuthServiceResponse<TBody>> {
    return await requestAuthService<TBody>(options);
}

export async function validateAccessToken(authorization: string, requestId?: string): Promise<AuthValidationResponse> {
    const response = await requestAuthService<AuthValidationResponse>({
        method: "GET",
        path: "/api/v1/auth/validate",
        authorization,
        requestId
    });

    if (response.status === 200 && isAuthValidationResponse(response.body)) {
        return response.body;
    }

    const message = getResponseMessage(response.body) ?? "Unauthorized";

    if (response.status >= 500) {
        throw new HttpError("Authentication service failed to validate the token", {status: 502});
    }

    throw new HttpError(message, {
        status: response.status,
        errors: getResponseErrors(response.body)
    });
}

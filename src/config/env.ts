import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function getPositiveIntegerEnv(name: string, fallback: number): number {
    const raw = process.env[name];

    if (!raw) {
        return fallback;
    }

    const parsed = Number.parseInt(raw, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Environment variable ${name} must be a positive integer`);
    }

    return parsed;
}

export const env = {
    authServiceAuthorizationCode: requireEnv("AUTH_SERVICE_AUTHORIZATION_CODE"),
    authServiceEndpoint: requireEnv("AUTH_SERVICE_ENDPOINT"),
    authServiceTimeoutMs: getPositiveIntegerEnv("AUTH_SERVICE_TIMEOUT_MS", 5000)
};

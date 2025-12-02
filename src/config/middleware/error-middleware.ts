import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
err: any,
req: Request,
res: Response,
next: NextFunction
) {
    console.error("Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    const errors = err.errors || undefined;

    res.status(status).json({
    message,
    code: status,
    ...(errors ? { errors} : {}),
    });
}
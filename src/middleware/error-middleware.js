export function errorMiddleware(err, req, res, next) {
    console.error("Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || undefined;
    res.status(status).json({
        message,
        code: status,
        ...(errors ? { errors } : {}),
    });
}
//# sourceMappingURL=error-middleware.js.map
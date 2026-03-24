type HttpErrorOptions = {
    status: number;
    errors?: Record<string, string> | undefined;
};

export class HttpError extends Error {
    status: number;
    errors: Record<string, string> | undefined;

    constructor(message: string, options: HttpErrorOptions) {
        super(message);
        this.name = "HttpError";
        this.status = options.status;
        this.errors = options.errors;
    }
}

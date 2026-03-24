import type {AuthValidationResponse} from "@/integrations/auth-service/types";

declare global {
    namespace Express {
        interface Request {
            authUser?: AuthValidationResponse;
        }
    }
}

export {};

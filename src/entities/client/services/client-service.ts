import {z} from "zod";
import * as clientRepository from "@/entities/client/repositories/client-repository";
import * as schemas from "@/entities/client/schemas/client-schema";
import * as types from "@/entities/client/types";

export async function getAllClients(): Promise<Array<types.Client>> {
    return await clientRepository.getAllClients();
}

export async function createClient(data: types.ClientCreateRequestSchema): Promise<types.Client> {
    try {
        const parsed = schemas.clientCreateRequestSchema.parse(data);
        return await clientRepository.createClient(parsed);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            err.issues.forEach(issue => {
                if (issue.path && issue.path[0]) {
                    const key = issue.path[0] as string;
                    errors[key] = issue.message;
                }
            });

            const validationError = new Error("Validation failed");
            (validationError as any).status = 400;
            (validationError as any).errors = errors;
            throw validationError;
        }

        throw err;
    }
}
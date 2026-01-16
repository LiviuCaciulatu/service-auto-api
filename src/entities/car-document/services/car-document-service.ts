import {z} from 'zod';
import * as carDocumentRepository from '@/entities/car-document/repositories/car-document-repository';
import * as schemas from '@/entities/car-document/schemas/car-document-schema';
import * as types from "@/entities/car-document/types"

// cheama get all car documents din car-document-repository
export async function getAllCarDocuments(): Promise<Array<types.CarDocument>> {
    return await carDocumentRepository.getAllCarDocuments();
}

//cheama create car document din car-document-repository
export async function createCarDocument(data: types.CarDocumentCreateSchema): Promise<types.CarDocument>{
    try{
        const parsed = schemas.carDocumentCreateSchema.parse(data);
        return await carDocumentRepository.createCarDocument(parsed);
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
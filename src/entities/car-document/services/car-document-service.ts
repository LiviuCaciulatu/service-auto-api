import {z} from 'zod';
import * as carDocumentRepository from '@/entities/car-document/repositories/car-document-repository';
import * as schemas from '@/entities/car-document/schemas/car-document-schema';
import * as types from "@/entities/car-document/types"
import * as clientRepository from "@/entities/client/repositories/client-repository";

// cheama get all car documents din car-document-repository
export async function getAllCarDocuments(): Promise<Array<types.CarDocument>> {
    return await carDocumentRepository.getAllCarDocuments();
}

//cheama create car document din car-document-repository
export async function createCarDocument(data: types.CarDocumentCreateSchema): Promise<types.CarDocument>{
    try{
        const parsed = schemas.carDocumentCreateSchema.parse(data);

        const clientExists = await clientRepository.existsByClientId(parsed.client_id);
        if(!clientExists) {
            const error = new Error("Client not found");
            (error as any).status = 404;
            throw error;
        }

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

export async function updateCarDocument(id: string, data: types.CarDocumentUpdateSchema): Promise<types.CarDocument>{
    try {
        const existingDocument = await carDocumentRepository.getCarDocumentById(id);
        if(!existingDocument) {
            const error = new Error("Car document not found");
            (error as any).status = 404;
            throw error;
        }

        if(existingDocument.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
            throw error;
        }

        const parsed = schemas.carDocumentUpdateSchema.parse(data);

        return await carDocumentRepository.updateCarDocument(id, parsed);
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

export async function getCarDocumentById(id: string): Promise<types.CarDocument> {
    return carDocumentRepository.getCarDocumentById(id);
}

export async function getCarDocumentsByClientId(clientId: string): Promise<Array<types.CarDocument>>{
    const carDocuments = await carDocumentRepository.getCarDocumentsByClientId(clientId);

    return carDocuments;
}
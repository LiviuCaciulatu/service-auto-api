import {z} from 'zod';
import * as gdprGroupamaRepository from '@/entities/templates/gdpr-groupama/repositories/gdpr-groupama-repository';
import * as schemas from '@/entities/templates/gdpr-groupama/schemas/gdpr-groupama-schema';
import * as types from "@/entities/templates/gdpr-groupama/types";

export async function getAllGdprGroupama(): Promise<Array<types.GdprGroupama>>{
    return await gdprGroupamaRepository.getAllGdprGroupama();
}

export async function createGdprGroupama(data: types.GdprGroupamaCreateSchema): Promise<types.GdprGroupama>{
    try {
        const parsed = schemas.gdprGroupamaCreateSchema.parse(data);
        const newContract = await gdprGroupamaRepository.createGdprGroupama(parsed);

        return newContract;
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

export async function updateGdprGroupama(id: string, data: types.GdprGroupamaUpdateSchema): Promise<types.GdprGroupama>{
    try {
        const existingGdprGroupama = await gdprGroupamaRepository.getGdprGroupamaById(id);
        if(!existingGdprGroupama) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingGdprGroupama.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprGroupamaUpdateSchema.parse(data);

        const updatedContract = await gdprGroupamaRepository.updateGdprGroupama(id, parsed);

        return updatedContract;
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

export async function getGdprGroupamaById(id: string): Promise<types.GdprGroupama>{
    const contract = await gdprGroupamaRepository.getGdprGroupamaById(id);
    return contract;
}
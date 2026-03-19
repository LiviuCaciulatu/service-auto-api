import {z} from 'zod';
import * as gdprGeneraliRepository from '@/entities/templates/gdpr-generali/repositories/gdpr-generali-repository';
import * as schemas from '@/entities/templates/gdpr-generali/schemas/gdpr-generali-schema';
import * as types from "@/entities/templates/gdpr-generali/types";

export async function getAllGdprGenerali(): Promise<Array<types.GdprGenerali>>{
    return await gdprGeneraliRepository.getAllGdprGenerali();
}

export async function createGdprGenerali(data: types.GdprGeneraliCreateSchema): Promise<types.GdprGenerali>{
    try {
        const parsed = schemas.gdprGeneraliCreateSchema.parse(data);
        const newContract = await gdprGeneraliRepository.createGdprGenerali(parsed);

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

export async function updateGdprGenerali(id: string, data: types.GdprGeneraliUpdateSchema): Promise<types.GdprGenerali>{
    try {
        const existingGdprGenerali = await gdprGeneraliRepository.getGdprGeneraliById(id);
        if(!existingGdprGenerali) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingGdprGenerali.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprGeneraliUpdateSchema.parse(data);

        const updatedContract = await gdprGeneraliRepository.updateGdprGenerali(id, parsed);

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

export async function getGdprGeneraliById(id: string): Promise<types.GdprGenerali>{
    const contract = await gdprGeneraliRepository.getGdprGeneraliById(id);
    return contract;
}
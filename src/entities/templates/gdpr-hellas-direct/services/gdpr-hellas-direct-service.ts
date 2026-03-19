import {z} from 'zod';
import * as gdprHellasDirectRepository from '@/entities/templates/gdpr-hellas-direct/repositories/gdpr-hellas-direct-repository';
import * as schemas from '@/entities/templates/gdpr-hellas-direct/schemas/gdpr-hellas-direct-schema';
import * as types from "@/entities/templates/gdpr-hellas-direct/types";

export async function getAllGdprHellasDirect(): Promise<Array<types.GdprHellasDirect>>{
    return await gdprHellasDirectRepository.getAllGdprHellasDirect();
}

export async function createGdprHellasDirect(data: types.GdprHellasDirectCreateSchema): Promise<types.GdprHellasDirect>{
    try {
        const parsed = schemas.gdprHellasDirectCreateSchema.parse(data);
        const newContract = await gdprHellasDirectRepository.createGdprHellasDirect(parsed);

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

export async function updateGdprHellasDirect(id: string, data: types.GdprHellasDirectUpdateSchema): Promise<types.GdprHellasDirect>{
    try {
        const existingGdprHellasDirect = await gdprHellasDirectRepository.getGdprHellasDirectById(id);
        if(!existingGdprHellasDirect) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingGdprHellasDirect.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprHellasDirectUpdateSchema.parse(data);

        const updatedContract = await gdprHellasDirectRepository.updateGdprHellasDirect(id, parsed);

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

export async function getGdprHellasDirectById(id: string): Promise<types.GdprHellasDirect>{
    const contract = await gdprHellasDirectRepository.getGdprHellasDirectById(id);
    return contract;
}
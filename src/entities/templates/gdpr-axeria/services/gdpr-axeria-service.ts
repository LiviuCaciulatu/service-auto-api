import {z} from 'zod';
import * as gdprAxeriaRepository from '@/entities/templates/gdpr-axeria/repositories/gdpr-axeria-repository';
import * as schemas from '@/entities/templates/gdpr-axeria/schemas/gdpr-axeria-schema';
import * as types from "@/entities/templates/gdpr-axeria/types";

export async function getAllGdprAxeria(): Promise<Array<types.GdprAxeria>>{
    return await gdprAxeriaRepository.getAllGdprAxeria();
}

export async function createGdprAxeria(data: types.GdprAxeriaCreateSchema): Promise<types.GdprAxeria>{
    try {
        const parsed = schemas.gdprAxeriaCreateSchema.parse(data);
        const newContract = await gdprAxeriaRepository.createGdprAxeria(parsed);

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

export async function updateGdprAxeria(id: string, data: types.GdprAxeriaUpdateSchema): Promise<types.GdprAxeria>{
    try {
        const existingGdprAxeria = await gdprAxeriaRepository.getGdprAxeriaById(id);
        if(!existingGdprAxeria) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingGdprAxeria.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprAxeriaUpdateSchema.parse(data);

        const updatedContract = await gdprAxeriaRepository.updateGdprAxeria(id, parsed);

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

export async function getGdprAxeriaById(id: string): Promise<types.GdprAxeria>{
    const contract = await gdprAxeriaRepository.getGdprAxeriaById(id);
    return contract;
}
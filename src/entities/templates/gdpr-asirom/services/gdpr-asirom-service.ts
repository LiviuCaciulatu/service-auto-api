import {z} from 'zod';
import * as gdprAsiromRepository from '@/entities/templates/gdpr-asirom/repositories/gdpr-asirom-repository';
import * as schemas from '@/entities/templates/gdpr-asirom/schemas/gdpr-asirom-schema';
import * as types from "@/entities/templates/gdpr-asirom/types";

export async function getAllGdprAsirom(): Promise<Array<types.GdprAsirom>> {
    return await gdprAsiromRepository.getAllGdprAsirom();
}

export async function createGdprAsirom(data: types.GdprAsiromCreateSchema): Promise<types.GdprAsirom> {
    try {
        const parsed = schemas.gdprAsiromCreateSchema.parse(data);
        const newContract = await gdprAsiromRepository.createGdprAsirom(parsed);

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

export async function updateGdprAsirom(id: string, data: types.GdprAsiromUpdateSchema): Promise<types.GdprAsirom> {
    try {
        const existingGdprAsirom = await gdprAsiromRepository.getGdprAsiromById(id);
        if (!existingGdprAsirom) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if (existingGdprAsirom.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprAsiromUpdateSchema.parse(data);

        const updatedContract = await gdprAsiromRepository.updateGdprAsirom(id, parsed);

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

export async function getGdprAsiromById(id: string): Promise<types.GdprAsirom> {
    const contract = await gdprAsiromRepository.getGdprAsiromById(id);
    return contract;
}
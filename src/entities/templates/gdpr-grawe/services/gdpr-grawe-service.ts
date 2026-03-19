import {z} from 'zod';
import * as gdprGraweRepository from '@/entities/templates/gdpr-grawe/repositories/gdpr-grawe-repository';
import * as schemas from '@/entities/templates/gdpr-grawe/schemas/gdpr-grawe-schema';
import * as types from "@/entities/templates/gdpr-grawe/types";

export async function getAllGdprGrawe(): Promise<Array<types.GdprGrawe>>{
    return await gdprGraweRepository.getAllGdprGrawe();
}

export async function createGdprGrawe(data: types.GdprGraweCreateSchema): Promise<types.GdprGrawe>{
    try {
        const parsed = schemas.gdprGraweCreateSchema.parse(data);
        const newContract = await gdprGraweRepository.createGdprGrawe(parsed);

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

export async function updateGdprGrawe(id: string, data: types.GdprGraweUpdateSchema): Promise<types.GdprGrawe>{
    try {
        const existingGdprGrawe = await gdprGraweRepository.getGdprGraweById(id);
        if(!existingGdprGrawe) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingGdprGrawe.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.gdprGraweUpdateSchema.parse(data);

        const updatedContract = await gdprGraweRepository.updateGdprGrawe(id, parsed);

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

export async function getGdprGraweById(id: string): Promise<types.GdprGrawe>{
    const contract = await gdprGraweRepository.getGdprGraweById(id);
    return contract;
}
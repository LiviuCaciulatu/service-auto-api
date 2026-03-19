import {z} from 'zod';
import * as avizareGeneraliRepository from '@/entities/templates/avizare-generali/repositories/avizare-generali-repository';
import * as schemas from '@/entities/templates/avizare-generali/schemas/avizare-generali-schema';
import * as types from "@/entities/templates/avizare-generali/types";

export async function getAllAvizareGenerali(): Promise<Array<types.AvizareGenerali>>{
    return await avizareGeneraliRepository.getAllAvizareGenerali();
}

export async function createAvizareGenerali(data: types.AvizareGeneraliCreateSchema): Promise<types.AvizareGenerali>{
    try {
        const parsed = schemas.AvizareGeneraliCreateSchema.parse(data);
        const newContract = await avizareGeneraliRepository.createAvizareGenerali(parsed);

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

export async function updateAvizareGenerali(id: string, data: types.AvizareGeneraliUpdateSchema): Promise<types.AvizareGenerali>{
    try {
        const existingAvizareGenerali = await avizareGeneraliRepository.getAvizareGeneraliById(id);
        if(!existingAvizareGenerali) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareGenerali.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareGeneraliUpdateSchema.parse(data);

        const updatedContract = await avizareGeneraliRepository.updateAvizareGenerali(id, parsed);

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

export async function getAvizareGeneraliById(id: string): Promise<types.AvizareGenerali>{
    const contract = await avizareGeneraliRepository.getAvizareGeneraliById(id);
    return contract;
}
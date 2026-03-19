import {z} from 'zod';
import * as avizareGroupamaRepository from '@/entities/templates/avizare-groupama/repositories/avizare-groupama-repository';
import * as schemas from '@/entities/templates/avizare-groupama/schemas/avizare-groupama-schema';
import * as types from "@/entities/templates/avizare-groupama/types";

export async function getAllAvizareGroupama(): Promise<Array<types.AvizareGroupama>>{
    return await avizareGroupamaRepository.getAllAvizareGroupama();
}

export async function createAvizareGroupama(data: types.AvizareGroupamaCreateSchema): Promise<types.AvizareGroupama>{
    try {
        const parsed = schemas.avizareGroupamaCreateSchema.parse(data);
        const newContract = await avizareGroupamaRepository.createAvizareGroupama(parsed);

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

export async function updateAvizareGroupama(id: string, data: types.AvizareGroupamaUpdateSchema): Promise<types.AvizareGroupama>{
    try {
        const existingAvizareGroupama = await avizareGroupamaRepository.getAvizareGroupamaById(id);
        if(!existingAvizareGroupama) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareGroupama.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.avizareGroupamaUpdateSchema.parse(data);

        const updatedContract = await avizareGroupamaRepository.updateAvizareGroupama(id, parsed);

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

export async function getAvizareGroupamaById(id: string): Promise<types.AvizareGroupama>{
    const contract = await avizareGroupamaRepository.getAvizareGroupamaById(id);
    return contract;
}
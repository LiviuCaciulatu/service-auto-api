import {z} from 'zod';
import * as avizareAsiromRepository from '@/entities/templates/avizare-asirom/repositories/avizare-asirom-repository';
import * as schemas from '@/entities/templates/avizare-asirom/schemas/avizare-asirom-schema';
import * as types from "@/entities/templates/avizare-asirom/types";

export async function getAllAvizareAsirom(): Promise<Array<types.AvizareAsirom>>{
    return await avizareAsiromRepository.getAllAvizareAsirom();
}

export async function createAvizareAsirom(data: types.AvizareAsiromCreateSchema): Promise<types.AvizareAsirom>{
    try {
        const parsed = schemas.AvizareAsiromCreateSchema.parse(data);
        const newContract = await avizareAsiromRepository.createAvizareAsirom(parsed);

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

export async function updateAvizareAsirom(id: string, data: types.AvizareAsiromUpdateSchema): Promise<types.AvizareAsirom>{
    try {
        const existingAvizareAsirom = await avizareAsiromRepository.getAvizareAsiromById(id);
        if(!existingAvizareAsirom) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareAsirom.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareAsiromUpdateSchema.parse(data);

        const updatedContract = await avizareAsiromRepository.updateAvizareAsirom(id, parsed);

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

export async function getAvizareAsiromById(id: string): Promise<types.AvizareAsirom>{
    const contract = await avizareAsiromRepository.getAvizareAsiromById(id);
    return contract;
}
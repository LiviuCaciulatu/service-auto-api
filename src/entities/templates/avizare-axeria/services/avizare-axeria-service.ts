import {z} from 'zod';
import * as avizareAxeriaRepository from '@/entities/templates/avizare-axeria/repositories/avizare-axeria-repository';
import * as schemas from '@/entities/templates/avizare-axeria/schemas/avizare-axeria-schema';
import * as types from "@/entities/templates/avizare-axeria/types";

export async function getAllAvizareAxeria(): Promise<Array<types.AvizareAxeria>>{
    return await avizareAxeriaRepository.getAllAvizareAxeria();
}

export async function createAvizareAxeria(data: types.AvizareAxeriaCreateSchema): Promise<types.AvizareAxeria>{
    try {
        const parsed = schemas.AvizareAxeriaCreateSchema.parse(data);
        const newContract = await avizareAxeriaRepository.createAvizareAxeria(parsed);

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

export async function updateAvizareAxeria(id: string, data: types.AvizareAxeriaUpdateSchema): Promise<types.AvizareAxeria>{
    try {
        const existingAvizareAxeria = await avizareAxeriaRepository.getAvizareAxeriaById(id);
        if(!existingAvizareAxeria) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareAxeria.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareAxeriaUpdateSchema.parse(data);

        const updatedContract = await avizareAxeriaRepository.updateAvizareAxeria(id, parsed);

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

export async function getAvizareAxeriaById(id: string): Promise<types.AvizareAxeria>{
    const contract = await avizareAxeriaRepository.getAvizareAxeriaById(id);
    return contract;
}
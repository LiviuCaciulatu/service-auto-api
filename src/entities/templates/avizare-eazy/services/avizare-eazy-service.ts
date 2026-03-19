import {z} from 'zod';
import * as avizareEazyRepository from '@/entities/templates/avizare-eazy/repositories/avizare-eazy-repository';
import * as schemas from '@/entities/templates/avizare-eazy/schemas/avizare-eazy-schema';
import * as types from "@/entities/templates/avizare-eazy/types";

export async function getAllAvizareEazy(): Promise<Array<types.AvizareEazy>>{
    return await avizareEazyRepository.getAllAvizareEazy();
}

export async function createAvizareEazy(data: types.AvizareEazyCreateSchema): Promise<types.AvizareEazy>{
    try {
        const parsed = schemas.AvizareEazyCreateSchema.parse(data);
        const newContract = await avizareEazyRepository.createAvizareEazy(parsed);

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

export async function updateAvizareEazy(id: string, data: types.AvizareEazyUpdateSchema): Promise<types.AvizareEazy>{
    try {
        const existingAvizareEazy = await avizareEazyRepository.getAvizareEazyById(id);
        if(!existingAvizareEazy) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareEazy.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareEazyUpdateSchema.parse(data);

        const updatedContract = await avizareEazyRepository.updateAvizareEazy(id, parsed);

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

export async function getAvizareEazyById(id: string): Promise<types.AvizareEazy>{
    const contract = await avizareEazyRepository.getAvizareEazyById(id);
    return contract;
}
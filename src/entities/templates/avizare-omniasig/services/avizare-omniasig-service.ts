import {z} from 'zod';
import * as avizareOmniasigRepository from '@/entities/templates/avizare-omniasig/repositories/avizare-omniasig-repository';
import * as schemas from '@/entities/templates/avizare-omniasig/schemas/avizare-omniasig-schema';
import * as types from "@/entities/templates/avizare-omniasig/types";

export async function getAllAvizareOmniasig(): Promise<Array<types.AvizareOmniasig>>{
    return await avizareOmniasigRepository.getAllAvizareOmniasig();
}

export async function createAvizareOmniasig(data: types.AvizareOmniasigCreateSchema): Promise<types.AvizareOmniasig>{
    try {
        const parsed = schemas.AvizareOmniasigCreateSchema.parse(data);
        const newContract = await avizareOmniasigRepository.createAvizareOmniasig(parsed);

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

export async function updateAvizareOmniasig(id: string, data: types.AvizareOmniasigUpdateSchema): Promise<types.AvizareOmniasig>{
    try {
        const existingAvizareOmniasig = await avizareOmniasigRepository.getAvizareOmniasigById(id);
        if(!existingAvizareOmniasig) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareOmniasig.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareOmniasigUpdateSchema.parse(data);

        const updatedContract = await avizareOmniasigRepository.updateAvizareOmniasig(id, parsed);

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

export async function getAvizareOmniasigById(id: string): Promise<types.AvizareOmniasig>{
    const contract = await avizareOmniasigRepository.getAvizareOmniasigById(id);
    return contract;
}
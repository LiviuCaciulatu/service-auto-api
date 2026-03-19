import {z} from 'zod';
import * as avizareHellasDirectRepository
    from '@/entities/templates/avizare-hellas-direct/repositories/avizare-hellas-direct-repository';
import * as schemas from '@/entities/templates/avizare-hellas-direct/schemas/avizare-hellas-direct-schema';
import * as types from "@/entities/templates/avizare-hellas-direct/types";

export async function getAllAvizareHellasDirect(): Promise<Array<types.AvizareHellasDirect>> {
    return await avizareHellasDirectRepository.getAllAvizareHellasDirect();
}

export async function createAvizareHellasDirect(data: types.AvizareHellasDirectCreateSchema): Promise<types.AvizareHellasDirect> {
    try {
        const parsed = schemas.AvizareHellasDirectCreateSchema.parse(data);
        const newContract = await avizareHellasDirectRepository.createAvizareHellasDirect(parsed);

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

export async function updateAvizareHellasDirect(id: string, data: types.AvizareHellasDirectUpdateSchema): Promise<types.AvizareHellasDirect> {
    try {
        const existingAvizareHellasDirect = await avizareHellasDirectRepository.getAvizareHellasDirectById(id);
        if (!existingAvizareHellasDirect) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if (existingAvizareHellasDirect.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareHellasDirectUpdateSchema.parse(data);

        const updatedContract = await avizareHellasDirectRepository.updateAvizareHellasDirect(id, parsed);

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

export async function getAvizareHellasDirectById(id: string): Promise<types.AvizareHellasDirect> {
    const contract = await avizareHellasDirectRepository.getAvizareHellasDirectById(id);
    return contract;
}
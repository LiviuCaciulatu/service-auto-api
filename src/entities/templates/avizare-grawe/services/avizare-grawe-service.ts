import {z} from 'zod';
import * as avizareGraweRepository from '@/entities/templates/avizare-grawe/repositories/avizare-grawe-repository';
import * as schemas from '@/entities/templates/avizare-grawe/schemas/avizare-grawe-schema';
import * as types from "@/entities/templates/avizare-grawe/types";

export async function getAllAvizareGrawe(): Promise<Array<types.AvizareGrawe>>{
    return await avizareGraweRepository.getAllAvizareGrawe();
}

export async function createAvizareGrawe(data: types.AvizareGraweCreateSchema): Promise<types.AvizareGrawe>{
    try {
        const parsed = schemas.AvizareGraweCreateSchema.parse(data);
        const newContract = await avizareGraweRepository.createAvizareGrawe(parsed);

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

export async function updateAvizareGrawe(id: string, data: types.AvizareGraweUpdateSchema): Promise<types.AvizareGrawe>{
    try {
        const existingAvizareGrawe = await avizareGraweRepository.getAvizareGraweById(id);
        if(!existingAvizareGrawe) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareGrawe.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareGraweUpdateSchema.parse(data);

        const updatedContract = await avizareGraweRepository.updateAvizareGrawe(id, parsed);

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

export async function getAvizareGraweById(id: string): Promise<types.AvizareGrawe>{
    const contract = await avizareGraweRepository.getAvizareGraweById(id);
    return contract;
}
import {z} from 'zod';
import * as avizareDallbogRepository from '@/entities/templates/avizare-dallbog/repositories/avizare-dallbog-repository';
import * as schemas from '@/entities/templates/avizare-dallbog/schemas/avizare-dallbog-schema';
import * as types from "@/entities/templates/avizare-dallbog/types";

export async function getAllAvizareDallbog(): Promise<Array<types.AvizareDallbog>>{
    return await avizareDallbogRepository.getAllAvizareDallbog();
}

export async function createAvizareDallbog(data: types.AvizareDallbogCreateSchema): Promise<types.AvizareDallbog>{
    try {
        const parsed = schemas.AvizareDallbogCreateSchema.parse(data);
        const newContract = await avizareDallbogRepository.createAvizareDallbog(parsed);

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

export async function updateAvizareDallbog(id: string, data: types.AvizareDallbogUpdateSchema): Promise<types.AvizareDallbog>{
    try {
        const existingAvizareDallbog = await avizareDallbogRepository.getAvizareDallbogById(id);
        if(!existingAvizareDallbog) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareDallbog.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareDallbogUpdateSchema.parse(data);

        const updatedContract = await avizareDallbogRepository.updateAvizareDallbog(id, parsed);

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

export async function getAvizareDallbogById(id: string): Promise<types.AvizareDallbog>{
    const contract = await avizareDallbogRepository.getAvizareDallbogById(id);
    return contract;
}
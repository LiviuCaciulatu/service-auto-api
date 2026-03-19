import {z} from 'zod';
import * as imputernicireRepository from '@/entities/templates/imputernicire/repositories/imputernicire-repository';
import * as schemas from '@/entities/templates/imputernicire/schemas/imputernicire-schema';
import * as types from "@/entities/templates/imputernicire/types";

export async function getAllImputernicire(): Promise<Array<types.Imputernicire>>{
    return await imputernicireRepository.getAllImputernicire();
}

export async function createImputernicire(data: types.ImputernicireCreateSchema): Promise<types.Imputernicire>{
    try {
        const parsed = schemas.imputernicireCreateSchema.parse(data);
        const newContract = await imputernicireRepository.createImputernicire(parsed);

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

export async function updateImputernicire(id: string, data: types.ImputernicireUpdateSchema): Promise<types.Imputernicire>{
    try {
        const existingImputernicire = await imputernicireRepository.getImputernicireById(id);
        if(!existingImputernicire) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingImputernicire.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.imputernicireUpdateSchema.parse(data);

        const updatedContract = await imputernicireRepository.updateImputernicire(id, parsed);

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

export async function getImputernicireById(id: string): Promise<types.Imputernicire>{
    const contract = await imputernicireRepository.getImputernicireById(id);
    return contract;
}
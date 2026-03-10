import {z} from 'zod';
import * as avizareAllianzTiriacRepository from '@/entities/templates/avizare-allianz-tiriac/repositories/avizare-allianz-tiriac-repository';
import * as schemas from '@/entities/templates/avizare-allianz-tiriac/schemas/avizare-allianz-tiriac-schema';
import * as types from "@/entities/templates/avizare-allianz-tiriac/types";

export async function getAllAvizareAllianzTiriac(): Promise<Array<types.AvizareAllianzTiriac>>{
    return await avizareAllianzTiriacRepository.getAllAvizareAllianzTiriac();
}

export async function createAvizareAllianzTiriac(data: types.AvizareAllianzTiriacCreateSchema): Promise<types.AvizareAllianzTiriac>{
    try {
        const parsed = schemas.AvizareAllianzTiriacCreateSchema.parse(data);
        const newContract = await avizareAllianzTiriacRepository.createAvizareAllianzTiriac(parsed);

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

export async function updateAvizareAllianzTiriac(id: string, data: types.AvizareAllianzTiriacUpdateSchema): Promise<types.AvizareAllianzTiriac>{
    try {
        const existingAvizareAllianzTiriac = await avizareAllianzTiriacRepository.getAvizareAllianzTiriacById(id);
        if(!existingAvizareAllianzTiriac) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingAvizareAllianzTiriac.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.AvizareAllianzTiriacUpdateSchema.parse(data);

        const updatedContract = await avizareAllianzTiriacRepository.updateAvizareAllianzTiriac(id, parsed);

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

export async function getAvizareAllianzTiriacById(id: string): Promise<types.AvizareAllianzTiriac>{
    const contract = await avizareAllianzTiriacRepository.getAvizareAllianzTiriacById(id);
    return contract;
}
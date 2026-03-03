import {z} from 'zod';
import * as contractReparatiiAutoRepository from '@/entities/contract-reparatii-auto/repositories/contract-reparatii-auto-repository';
import * as schemas from '@/entities/contract-reparatii-auto/schemas/contract-reparatii-auto-schema';
import * as types from '@/entities/contract-reparatii-auto/types';

export async function getAllContractReparatiiAuto(): Promise<Array<types.ContractReparatiiAuto>>{
    return await contractReparatiiAutoRepository.getAllContractReparatiiAuto();
}

export async function createContractReparatiiAuto(data: types.ContractReparatiiAutoCreateSchema): Promise<types.ContractReparatiiAuto>{
    try {
        const parsed = schemas.ContractReparatiiAutoCreateSchema.parse(data);
        const newContract = await contractReparatiiAutoRepository.createContractReparatiiAuto(parsed);

        return newContract;
    } catch (err) {        if (err instanceof z.ZodError) {
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

export async function updateContractReparatiiAuto(id: string, data: types.ContractReparatiiAutoUpdateSchema): Promise<types.ContractReparatiiAuto>{
    try {
        const existingContractReparatiiAuto = await contractReparatiiAutoRepository.getContractReparatiiAutoById(id);
        if(!existingContractReparatiiAuto) {
            const error = new Error("Contract Reparatii Auto not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingContractReparatiiAuto.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.ContractReparatiiAutoUpdateSchema.parse(data);

        const updateContract = await contractReparatiiAutoRepository.updateContractReparatiiAuto(id, parsed);

        return updateContract;
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

export async function getContractReparatiiAutoById(id: string): Promise<types.ContractReparatiiAuto>{
    const contract = await contractReparatiiAutoRepository.getContractReparatiiAutoById(id);
    return contract;
}
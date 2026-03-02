import {z} from 'zod';
import * as contractInlocuireTemporaraRepository from '@/entities/contract-inlocuire-temporara/repositories/contract-inlocuire-temporara-repository';
import * as schemas from '@/entities/contract-inlocuire-temporara/schemas/contract-inlocuire-temporara-schema';
import * as types from '@/entities/contract-inlocuire-temporara/types';

export async function getAllContractInlocuireTemporara(): Promise<Array<types.ContractInlocuireTemporara>>{
    return await contractInlocuireTemporaraRepository.getAllContractInlocuireTemporara();
}

export async function createContractInlocuireTemporara(data: types.ContractInlocuireTemporaraCreateSchema): Promise<types.ContractInlocuireTemporara>{
    try {
        const parsed = schemas.ContractInlocuireTemporaraCreateSchema.parse(data);
        const newContract = await contractInlocuireTemporaraRepository.createContractInlocuireTemporara(parsed);

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

export async function updateContractInlocuireTemporara(id: string, data: types.ContractInlocuireTemporaraUpdateSchema): Promise<types.ContractInlocuireTemporara>{
    try {
        const existingContractInlocuireTemporara = await contractInlocuireTemporaraRepository.getContractInlocuireTemporaraById(id);
        if(!existingContractInlocuireTemporara) {
            const error = new Error("Contract Inlocuire Temporara not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingContractInlocuireTemporara.client_id !== data.client_id){
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.ContractInlocuireTemporaraUpdateSchema.parse(data);

        const updateContract = await contractInlocuireTemporaraRepository.updateContractInlocuireTemporara(id, parsed);

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

export async function getContractInlocuireTemporaraById(id: string): Promise<types.ContractInlocuireTemporara>{
    const contract = await contractInlocuireTemporaraRepository.getContractInlocuireTemporaraById(id);
    return contract;
}
import {z} from 'zod';
import * as contractMandatRepository from '@/entities/templates/contract-mandat/repositories/contract-mandat-repository';
import * as schemas from '@/entities/templates/contract-mandat/schemas/contract-mandat-schema';
import * as types from "@/entities/templates/contract-mandat/types";

export async function getAllContractMandat(): Promise<Array<types.ContractMandat>>{
    return await contractMandatRepository.getAllContractMandat();
}

export async function createContractMandat(data: types.ContractMandatCreateSchema): Promise<types.ContractMandat>{
    try {
        const parsed = schemas.ContractMandatCreateSchema.parse(data);
        const newContract = await contractMandatRepository.createContractMandat(parsed);

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

export async function updateContractMandat(id: string, data: types.ContractMandatUpdateSchema): Promise<types.ContractMandat>{
    try {
        const existingContractMandat = await contractMandatRepository.getContractMandatById(id);
        if(!existingContractMandat) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingContractMandat.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.ContractMandatUpdateSchema.parse(data);

        const updatedContract = await contractMandatRepository.updateContractMandat(id, parsed);

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

export async function getContractMandatById(id: string): Promise<types.ContractMandat>{
    const contract = await contractMandatRepository.getContractMandatById(id);
    return contract;
}
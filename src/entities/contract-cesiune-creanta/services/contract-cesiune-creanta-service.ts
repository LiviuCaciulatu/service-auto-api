import {z} from 'zod';
import * as contractCesiuneCreantaRepository from '@/entities/contract-cesiune-creanta/repositories/contract-cesiune-creanta-repository';
import * as schemas from '@/entities/contract-cesiune-creanta/schemas/contract-cesiune-creanta-schema';
import * as types from '@/entities/contract-cesiune-creanta/types';

export async function getAllContractCesiuneCreanta(): Promise<Array<types.ContractCesiuneCreanta>>{
    return await contractCesiuneCreantaRepository.getAllContractCesiuneCreanta();
}

export async function createContractCesiuneCreanta(data: types.CesiuneCreantaCreateSchema): Promise<types.ContractCesiuneCreanta>{
    try {
        const parsed = schemas.ContractCesiuneCreantaCreateSchema.parse(data);
        const newContract = await contractCesiuneCreantaRepository.createContractCesiuneCreanta(parsed);

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

export async function updateContractCesiuneCreanta(id: string, data: types.CesiuneCreantaUpdateSchema): Promise<types.ContractCesiuneCreanta>{
    try {
        const existingContractCesiuneCreanta = await contractCesiuneCreantaRepository.getContractCesiuneCreantaById(id);
        if(!existingContractCesiuneCreanta) {
            const error = new Error("Contract Cesiune Creanta not found");
            (error as any).status = 404;
            throw error;
        }
        if(existingContractCesiuneCreanta.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
        }

        const parsed = schemas.ContractCesiuneCreantaUpdateSchema.parse(data);

        const updatedContract = await contractCesiuneCreantaRepository.updateContractCesiuneCreanta(id, parsed);

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

export async function getContractCesiuneCreantaById(id: string): Promise<types.ContractCesiuneCreanta>{
    const contract = await contractCesiuneCreantaRepository.getContractCesiuneCreantaById(id);
    return contract;
}
import {z} from 'zod';

import * as types from "@/entities/compensated-client/types";
import * as schemas from '@/entities/compensated-client/schemas/compensated-client-schema';
import * as compensatedClientRepository from '@/entities/compensated-client/repositories/compensated-client-repository';
import * as compensationClaimRepository from "@/entities/compensation-claim/repositories/compensation-claim-repository";

export async function createCompensatedClient(data: types.CompensatedClientCreateSchema): Promise<types.CompensatedClient>{
    try{
        const parsed = schemas.compensatedClientCreateSchema.parse(data);
        if (!parsed.claim_id) {
            const error = new Error("Compensation claim ID is required");
            (error as any).status = 400;
            throw error;
        }

        const claimExists = await compensationClaimRepository.existsByCompensationClaimId(parsed.claim_id);
        if(!claimExists) {
            const error = new Error("Compensation claim not found");
            (error as any).status = 404;
            throw error;
        }

        return await compensatedClientRepository.createCompensatedClient(parsed);
    }  catch (err) {
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

// export async function updateCompensatedClient(id: string, data: types.CompensatedClientUpdateSchema): Promise<types.CompensatedClient>{
//     try {
//         const existingCompensatedClient = await compensatedClientRepository.getCompensatedClientById(id);
//         if(!existingCompensatedClient) {
//             const error = new Error("Compensated client not found");
//             (error as any).status = 404;
//             throw error;
//         }
//         if(existingCompensatedClient.claim_id !== data.claim_id) {
//             const error = new Error("Compensation claim ID does not match");
//             (error as any).status = 400;
//             throw error;
//         }
//
//         const parsed = schemas.compensatedClientUpdateSchema.parse(data);
//
//         return await compensatedClientRepository.updateCompensatedClient(id, parsed);
//     } catch (err) {
//         if (err instanceof z.ZodError) {
//             const errors: Record<string, string> = {};
//             err.issues.forEach(issue => {
//                 if (issue.path && issue.path[0]) {
//                     const key = issue.path[0] as string;
//                     errors[key] = issue.message;
//                 }
//             });
//
//             const validationError = new Error("Validation failed");
//             (validationError as any).status = 400;
//             (validationError as any).errors = errors;
//             throw validationError;
//         }
//
//         throw err;
//     }
// }

export async function getCompensatedClientById(id: string): Promise<types.CompensatedClient>{
    return compensatedClientRepository.getCompensatedClientById(id);
}

export async function getCompensatedClientsByClaimId(claimId: string) {
    return compensatedClientRepository.getCompensatedClientsByClaimId(claimId);
}

export async function deleteCompensatedClientsByClaimId(claimId: string): Promise<void>{
    return await compensatedClientRepository.deleteCompensatedClientByClaimId(claimId)
}

export async function createCompensatedClientsForClaim(claimId: string, clients?: types.CompensatedClientCreateSchema[]): Promise<types.CompensatedClient[]> {
    if (!clients || !Array.isArray(clients)) return [];

    for (const clientData of clients) {
        await createCompensatedClient({
            ...clientData,
            claim_id: claimId
        });
    }

    return getCompensatedClientsByClaimId(claimId);
}

export async function replaceCompensatedClientsForClaim(claimId: string, clients?: types.CompensatedClientCreateSchema[]): Promise<types.CompensatedClient[]> {

    if (clients === undefined) {
        return getCompensatedClientsByClaimId(claimId);
    }

    await deleteCompensatedClientsByClaimId(claimId);

    if (clients.length === 0) {
        return [];
    }

    for (const clientData of clients) {
        await createCompensatedClient({
            ...clientData,
            claim_id: claimId
        });
    }

    return getCompensatedClientsByClaimId(claimId);
}

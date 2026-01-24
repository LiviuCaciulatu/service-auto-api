import {z} from 'zod';
import * as compensationClaimRepository from '@/entities/compensation-claim/repositories/compensation-claim-repository';
import * as schemas from '@/entities/compensation-claim/schemas/compensation-claim-schema';
import * as types from "@/entities/compensation-claim/types";
import * as compensatedClientService from "@/entities/compensated-client/services/compensated-client-service";

export async function getAllCompensationClaims(): Promise<Array<types.CompensationClaim>> {
    return await compensationClaimRepository.getAllCompensationClaims();
}

export async function createCompensationClaim(data: types.CompensationClaimCreateSchema): Promise<types.CompensationClaim>{
    try {
        const parsed = schemas.compensationClaimCreateSchema.parse(data);
        const newClaim = await compensationClaimRepository.createCompensationClaim(parsed);

        const compensatedClientsForClaim =
            await compensatedClientService.createCompensatedClientsForClaim(newClaim.id,parsed.compensated_clients);

        return {
            ...newClaim,
            compensated_clients: compensatedClientsForClaim
        };
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

export async function updateCompensationClaim(id: string, data: types.CompensationClaimUpdateSchema): Promise<types.CompensationClaim>{
    try {
        const exitingCompensationClaim = await compensationClaimRepository.getCompensationClaimById(id);

        if(!exitingCompensationClaim) {
            const error = new Error("Compensation claim not found");
            (error as any).status = 404;
            throw error;
        }

        if (exitingCompensationClaim.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
            throw error;
        }

        const parsed = schemas.compensationClaimUpdateSchema.parse(data);

        const updateClaim = await compensationClaimRepository.updateCompensationClaim(id, parsed);

        const compensatedClientsForClaim = await compensatedClientService.replaceCompensatedClientsForClaim(id, parsed.compensated_clients);

        return {
            ...updateClaim,
            compensated_clients: compensatedClientsForClaim
        }
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

export async function getCompensationClaimById(id: string): Promise<types.CompensationClaim>{
    const claim = await compensationClaimRepository.getCompensationClaimById(id);

    const compensateClients = await compensatedClientService.getCompensatedClientsByClaimId(id);

    return {
        ...claim,
        compensated_clients: compensateClients
    }
}

export async function getCompensationClaimsByClientId(clientId: string): Promise<Array<types.CompensationClaim>>{
    const claims = await compensationClaimRepository.getCompensationClaimsByClientId(clientId);

    for (const claim of claims){
        const compensatedClients = await compensatedClientService.getCompensatedClientsByClaimId(claim.id);
        claim.compensated_clients = compensatedClients;
    }

    return claims;
}
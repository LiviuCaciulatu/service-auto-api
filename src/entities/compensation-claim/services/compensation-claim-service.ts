import {z} from 'zod';
import * as compensationClaimRepository from '@/entities/compensation-claim/repositories/compensation-claim-repository';
import * as schemas from '@/entities/compensation-claim/schemas/compensation-claim-schema';
import * as types from "@/entities/compensation-claim/types";
import * as compensatedClientService from "@/entities/compensated-client/services/compensated-client-service";

export async function getAllCompensationClaims(): Promise<Array<types.CompensationClaim>> {
    return await compensationClaimRepository.getAllCompensationClaims();
}

export async function createCompensationClaim(data: types.CompensationClaimCreateSchema): Promise<types.CompensationClaim>{
    try{
        // TODO de parsat schema
        const newClaim = await compensationClaimRepository.createCompensationClaim(data);

        // TODO tot codul de la liniile 16 pana la 22 vreau sa fie executate de o metoda din compensated-client-service
        if(data.compensated_clients && Array.isArray(data.compensated_clients)) {
            for (const clientData of data.compensated_clients) {
                await compensatedClientService.createCompensatedClient(
                    {...clientData, claim_id: newClaim.id
                    });
            }
        }

        const compensatedClientsForClaim = await compensatedClientService.getCompensatedClientsByClaimId(newClaim.id);

        return {
            ...newClaim,
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

        // TODO tot codul de la liniile 69 pana la 78 vreau sa fie executate de o metoda din compensated-client-service
        if (parsed.compensated_clients && Array.isArray(parsed.compensated_clients)) {
            await compensatedClientService.deleteCompensatedClientsByClaimId(id);

            for (const clientData of parsed.compensated_clients) {
                await compensatedClientService.createCompensatedClient(
                    {...clientData,
                        claim_id: id
                    });
            }
        }

        const compensatedClientsForClaim = await compensatedClientService.getCompensatedClientsByClaimId(updateClaim.id);

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
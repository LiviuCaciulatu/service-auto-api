import {z} from "zod";
import * as clientRepository from "@/entities/client/repositories/client-repository";
import * as schemas from "@/entities/client/schemas/client-schema";
import * as carDocumentService from "@/entities/car-document/services/car-document-service";
import * as compensationClaimService from "@/entities/compensation-claim/services/compensation-claim-service";
import * as driverLicenseService from "@/entities/driver-license/services/driver-license-service"
import * as types from "@/entities/client/types";
import * as claimTypes from "@/entities/compensation-claim/types";
import * as carDocumentTypes from "@/entities/car-document/types";
import * as driverLicenseTypes from "@/entities/driver-license/types";

// cheama get all clients din client-repository
export async function getAllClients(): Promise<Array<types.Client>> {
    return await clientRepository.getAllClients();
}

// cheama create client din client-repository
export async function createClient(data: types.ClientCreateRequestSchema): Promise<types.Client> {
    try {
        const parsed = schemas.clientCreateRequestSchema.parse(data);
        return await clientRepository.createClient(parsed);
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

export async function updateClient( id: string, data: types.ClientUpdateRequestSchema): Promise<types.Client> {
    try {
        const existingClient = await clientRepository.existsByClientId(id);
        if(!existingClient) {
            const error = new Error("Client not found");
            (error as any).status = 404;
            throw error;
        }
        const parsed = schemas.clientUpdateRequestSchema.parse(data);

        return await clientRepository.updateClient(id, parsed);
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

export async function getClientById(id: string): Promise<types.Client> {
    return clientRepository.getClientById(id);
}

export async function getClientCompensationsClaims(clientId: string): Promise<Array<claimTypes.CompensationClaim>>{
    return clientRepository.getCompensationClaimsByClientId(clientId)
}

export async function getCarDocumentsByClientId(clientId: string): Promise<Array<carDocumentTypes.CarDocument>>{
    return clientRepository.getCarDocumentsByClientId(clientId)
}

export async function getClientDriverLicensesByClientId(clientId: string): Promise<Array<driverLicenseTypes.DriverLicense>>{
    return clientRepository.getDriverLicensesByClientId(clientId)
}
import {z} from 'zod';
import * as driverLicenseRepository from "@/entities/driver-license/repositories/driver-license-repository";
import * as schemas from "@/entities/driver-license/schemas/driver-license-schema";
import * as types from "@/entities/driver-license/types";
import * as clientRepository from "@/entities/client/repositories/client-repository";

export async function getAllDriverLicenses(): Promise<Array<types.DriverLicense>>{
    return await driverLicenseRepository.getAllDriverLicenses();
}

export async function createDriverLicense(data: types.DriverLicenseCreateSchema): Promise<types.DriverLicense>{
    try {
        const parsed = schemas.driverLicenseCreateSchema.parse(data);

        const clientExists = await clientRepository.existsByClientId(parsed.client_id);
        if(!clientExists) {
            const error = new Error("Client not found");
            (error as any).status = 404;
            throw error;
        }

        return await driverLicenseRepository.createDriverLicense(parsed);
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

export async function updateDriverLicense (id: string, data: types.DriverLicenseUpdateSchema): Promise<types.DriverLicense> {
    try {
        const existingDriverLicense = await driverLicenseRepository.getDriverLicenseById(id);
        if (!existingDriverLicense) {
            const error = new Error("Driver License not found");
            (error as any).status = 404;
            throw error;
        }

        if (existingDriverLicense.client_id !== data.client_id) {
            const error = new Error("Client ID does not match");
            (error as any).status = 400;
            throw error;
        }

        const parsed = schemas.driverLicenseUpdateSchema.parse(data);

        return await driverLicenseRepository.updateDriverLicense(id, parsed);
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

export async function getDriverLicenseById(id: string): Promise<types.DriverLicense>{
    return driverLicenseRepository.getDriverLicenseById(id);
}

export async function getDriverLicensesByClientId(id: string): Promise<Array<types.DriverLicense>>{
    return driverLicenseRepository.getDriverLicensesByClientId(id);
}
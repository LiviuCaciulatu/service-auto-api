import {z} from "zod";
import * as schemas from "@/entities/driver-license/schemas/driver-license-schema";

export type DriverLicenseCreateSchema = z.infer<typeof schemas.driverLicenseCreateSchema>
export type DriverLicenseUpdateSchema = z.infer<typeof schemas.driverLicenseUpdateSchema>

export type DriverLicense = {
    id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    birth_place: string;
    issued_date: string;
    expiration_date: string;
    issued_by: string;
    license_number: string;
    vehicle_codes: string[];
}

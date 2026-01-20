import {z} from "zod";
import {asyncHandler} from "@/shared/async-handler";

export const driverLicenseCreateSchema = z.object({
    client_id: z.uuidv4(),
    first_name: z.string().min(2, "at least 2 characters").max(50),
    last_name: z.string().min(2, "at least 2 characters").max(50),
    date_of_birth: z.string().min(10, "at least 10 characters").max(15),
    birth_place: z.string().min(1),
    issued_date: z.string().min(10, "at least 10 characters").max(15),
    expiration_date: z.string().min(10, "at least 10 characters").max(15),
    issued_by: z.string().min(1),
    license_number: z.string().min(1),
    vehicle_codes: z.array(z.string()).min(1)
})

export const driverLicenseUpdateSchema = driverLicenseCreateSchema;
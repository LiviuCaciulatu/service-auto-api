import {z} from "zod";
import * as schemas from "@/entities/compensated-client/schemas/compensated-client-schema";

export const compensationClaimCreateSchema = z.object({
    client_id: z.uuidv4(),
    attention_to: z.string().min(1),
    claim_file_number: z.string().min(1),
    claimant_name: z.string().min(1),
    cnp: z.string().min(1),
    role: z.string().min(1),
    vehicle_make: z.string().min(1),
    vehicle_model: z.string().min(1),
    registration_number: z.string().min(1),
    claim_number: z.string().min(1),
    compensated_clients: z.array(schemas.compensatedClientCreateSchema).optional(),
    observations: z.string().min(1),
    date: z.string().min(1),
    signature: z.string().min(1)
});

export const compensationClaimUpdateSchema = compensationClaimCreateSchema.partial();
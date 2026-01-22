import {z} from "zod";

export const compensatedClientCreateSchema = z.object({
    claim_id: z.uuidv4().optional(),
    amount: z.string().min(1),
    bank: z.string().min(1),
    iban: z.string().min(1),
    account_holder: z.string().min(1)
});

export const compensatedClientUpdateSchema = compensatedClientCreateSchema;
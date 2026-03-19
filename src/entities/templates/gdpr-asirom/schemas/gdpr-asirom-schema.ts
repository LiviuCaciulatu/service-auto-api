import {z} from "zod";

export const gdprAsiromCreateSchema = z.object({
    client_id: z.uuidv4(),
    client_name: z.string(),
    signature: z.string(),
    created_at: z.string(),
});

export const gdprAsiromUpdateSchema = gdprAsiromCreateSchema;
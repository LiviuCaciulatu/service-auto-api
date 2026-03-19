import {z} from 'zod';

export const gdprGeneraliCreateSchema = z.object({
    client_id: z.string(),
    client_name: z.string(),
    signature: z.string(),
    created_at: z.string(),
});

export const gdprGeneraliUpdateSchema = gdprGeneraliCreateSchema;
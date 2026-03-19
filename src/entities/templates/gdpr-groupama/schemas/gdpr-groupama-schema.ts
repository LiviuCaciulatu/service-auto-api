import {z} from "zod";

export const gdprGroupamaCreateSchema = z.object({
    client_id: z.uuidv4(),
    client_name: z.string(),
    capacity: z.string(),
    signature: z.string(),
    created_at: z.string(),
});

export const gdprGroupamaUpdateSchema = gdprGroupamaCreateSchema;
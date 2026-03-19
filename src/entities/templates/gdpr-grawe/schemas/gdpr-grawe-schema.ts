import {z} from "zod";

export const gdprGraweCreateSchema = z.object({
    client_id: z.uuidv4(),
    client_name: z.string(),
    client_id_series: z.string(),
    client_id_number: z.string(),
    signature: z.string(),
    created_at: z.string(),
});

export const gdprGraweUpdateSchema = gdprGraweCreateSchema;
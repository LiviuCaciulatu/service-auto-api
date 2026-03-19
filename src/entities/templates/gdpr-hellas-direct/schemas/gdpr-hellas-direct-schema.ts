import {z} from 'zod'

export const gdprHellasDirectCreateSchema = z.object({
        client_id: z.uuidv4(),
        client_name: z.string(),
        signature: z.string(),
        gdpr_date: z.string(),
        created_at: z.string()
    }
)

export const  gdprHellasDirectUpdateSchema = gdprHellasDirectCreateSchema;
import {z} from 'zod'
import * as schemas from '@/entities/templates/gdpr-hellas-direct/schemas/gdpr-hellas-direct-schema';

export type GdprHellasDirectCreateSchema = z.infer<typeof schemas.gdprHellasDirectCreateSchema>
export type GdprHellasDirectUpdateSchema = z.infer<typeof schemas.gdprHellasDirectUpdateSchema>

export type GdprHellasDirect = {
    id: string;
    client_id: string;
    client_name: string;
    signature: string;
    gdpr_date: string;
    created_at: string;
}
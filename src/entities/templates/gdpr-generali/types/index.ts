import {z} from 'zod'
import * as schemas from '@/entities/templates/gdpr-generali/schemas/gdpr-generali-schema';

export type GdprGeneraliCreateSchema = z.infer<typeof schemas.gdprGeneraliCreateSchema>
export type GdprGeneraliUpdateSchema = z.infer<typeof schemas.gdprGeneraliUpdateSchema>

export type GdprGenerali = {
    id: string;
    client_id: string;
    client_name: string;
    signature: string;
    created_at: string;
}
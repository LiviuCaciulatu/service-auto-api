import {z} from "zod";
import * as schemas from "@/entities/templates/gdpr-groupama/schemas/gdpr-groupama-schema";

export type GdprGroupamaCreateSchema = z.infer<typeof schemas.gdprGroupamaCreateSchema>
export type GdprGroupamaUpdateSchema = z.infer<typeof schemas.gdprGroupamaUpdateSchema>

export type GdprGroupama = {
    id: string;
    client_id: string;
    client_name: string;
    capacity: string;
    signature: string;
    created_at: string;
}
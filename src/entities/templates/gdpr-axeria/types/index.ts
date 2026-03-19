import {z} from "zod";
import * as schemas from "@/entities/templates/gdpr-axeria/schemas/gdpr-axeria-schema";

export type GdprAxeriaCreateSchema = z.infer<typeof schemas.gdprAxeriaCreateSchema>
export type GdprAxeriaUpdateSchema = z.infer<typeof schemas.gdprAxeriaUpdateSchema>

export type GdprAxeria = {
    id: string;
    client_id: string;
    client_name: string;
    signature: string;
    created_at: string;
}
import {z} from "zod";
import * as schemas from "@/entities/templates/gdpr-asirom/schemas/gdpr-asirom-schema";

export type GdprAsiromCreateSchema = z.infer<typeof schemas.gdprAsiromCreateSchema>
export type GdprAsiromUpdateSchema = z.infer<typeof schemas.gdprAsiromUpdateSchema>

export type GdprAsirom = {
    id: string;
    client_id: string;
    client_name: string;
    signature: string;
    created_at: string;
}
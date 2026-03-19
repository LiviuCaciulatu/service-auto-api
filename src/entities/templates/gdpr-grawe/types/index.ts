import {z} from "zod";
import * as schemas from "@/entities/templates/gdpr-grawe/schemas/gdpr-grawe-schema";

export type GdprGraweCreateSchema = z.infer<typeof schemas.gdprGraweCreateSchema>
export type GdprGraweUpdateSchema = z.infer<typeof schemas.gdprGraweUpdateSchema>

export type GdprGrawe = {
    id: string;
    client_id: string;
    client_name: string;
    signature: string;
    created_at: string;
}
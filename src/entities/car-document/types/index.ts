import {z} from "zod";
import * as schemas from "@/entities/car-document/schemas/car-document-schema";

export type CarDocumentCreateSchema = z.infer<typeof schemas.carDocumentCreateSchema>
export type CarDocumentUpdateSchema = z.infer<typeof schemas.carDocumentUpdateSchema>

export type CarDocument = {
    id: string;
    client_id: string;
    property_A: string;
    property_J: string;
    property_D_1: string;
    property_D_2: string;
    property_D_3: string;
    property_E: string;
    property_K: string;
    property_C_2_1: string;
    property_C_2_2: string;
    property_C_2_3: string;
    property_C_3_1: string;
    property_C_3_2: string;
    property_C_3_3: string;
    property_B: string;
    property_H: string;
    property_I: string;
    property_I_1: string;
    property_F_1: string;
    property_G: string;
    property_P_1: string;
    property_P_2: string;
    property_P_3: string;
    property_Q: string;
    property_R: string;
    property_S_1: string;
    property_S_2: string;
    property_V_7: string;
    property_V_10: string;
    property_Y: string;
    property_Z: string;
    observatii: string;
    numar_certificat: string;
    property_C_2_equals_C_1: boolean;
    property_C_3_equals_C_1: boolean;
    created_at: string;
}
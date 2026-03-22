import {z} from "zod";
import * as schemas from "@/entities/car-document/schemas/car-document-schema";

export type CarDocumentCreateSchema = z.infer<typeof schemas.carDocumentCreateSchema>
export type CarDocumentUpdateSchema = z.infer<typeof schemas.carDocumentUpdateSchema>

export type CarDocument = {
    id: string;
    client_id: string;
    property_a: string;
    property_j: string;
    property_d_1: string;
    property_d_2: string;
    property_d_3: string;
    property_e: string;
    property_k: string;
    property_c_2_1: string;
    property_c_2_2: string;
    property_c_2_3: string;
    property_c_3_1: string;
    property_c_3_2: string;
    property_c_3_3: string;
    property_b: string;
    property_h: string;
    property_i: string;
    property_i_1: string;
    property_f_1: string;
    property_g: string;
    property_p_1: string;
    property_p_2: string;
    property_p_3: string;
    property_q: string;
    property_r: string;
    property_s_1: string;
    property_s_2: string;
    property_v_7: string;
    property_v_10: string;
    property_y: string;
    property_z: string;
    observatii: string;
    numar_certificat: string;
    property_c_2_equals_c_1: boolean;
    property_c_3_equals_c_1: boolean;
    expiration_date: string;
    created_at: string;
}
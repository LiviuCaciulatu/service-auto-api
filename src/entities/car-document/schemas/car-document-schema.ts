import {z} from 'zod';

// defineste schema pentru car document
export const carDocumentCreateSchema = z.object({
    client_id: z.uuidv4(),
    property_a: z.string().min(1).max(19),
    property_j: z.string().min(1).max(19),
    property_d_1: z.string().min(1).max(49),
    property_d_2: z.string().min(1).max(19),
    property_d_3: z.string().min(1).max(29),
    property_e: z.string().min(1),
    property_k: z.string().min(1),
    property_c_2_1: z.string().min(1),
    property_c_2_2: z.string().min(1),
    property_c_2_3: z.string().min(1),
    property_c_3_1: z.string().min(1),
    property_c_3_2: z.string().min(1),
    property_c_3_3: z.string().min(1),
    property_b: z.string().min(1),
    property_h: z.string().min(1),
    property_i: z.string().min(1),
    property_i_1: z.string().min(1),
    property_f_1: z.string().min(1),
    property_g: z.string().min(1),
    property_p_1: z.string().min(1),
    property_p_2: z.string().min(1),
    property_p_3: z.string().min(1),
    property_q: z.string().min(1),
    property_r: z.string().min(1),
    property_s_1: z.string().min(1),
    property_s_2: z.string().min(1),
    property_v_7: z.string().min(1),
    property_v_10: z.string().min(1),
    property_y: z.string().min(1),
    property_z: z.string().min(1),
    observatii: z.string().min(1),
    numar_certificat: z.string().min(1),
    property_c_2_equals_c_1: z.boolean(),
    property_c_3_equals_c_1: z.boolean()
})

// defineste schema pentru updatata pentru car document
export const carDocumentUpdateSchema = carDocumentCreateSchema;

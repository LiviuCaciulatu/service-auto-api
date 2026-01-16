import {z} from 'zod';
import {asyncHandler} from "@/shared/async-handler";

// defineste schema pentru car document
export const carDocumentCreateSchema = z.object({
    property_A: z.string().min(1),
    property_J: z.string().min(1),
    property_D_1: z.string().min(1),
    property_D_2: z.string().min(1),
    property_D_3: z.string().min(1),
    property_E: z.string().min(1),
    property_K: z.string().min(1),
    property_C_2_1: z.string().min(1),
    property_C_2_2: z.string().min(1),
    property_C_2_3: z.string().min(1),
    property_C_3_1: z.string().min(1),
    property_C_3_2: z.string().min(1),
    property_C_3_3: z.string().min(1),
    property_B: z.string().min(1),
    property_H: z.string().min(1),
    property_I: z.string().min(1),
    property_I_1: z.string().min(1),
    property_F_1: z.string().min(1),
    property_G: z.string().min(1),
    property_P_1: z.string().min(1),
    property_P_2: z.string().min(1),
    property_P_3: z.string().min(1),
    property_Q: z.string().min(1),
    property_R: z.string().min(1),
    property_S_1: z.string().min(1),
    property_S_2: z.string().min(1),
    property_V_7: z.string().min(1),
    property_V_10: z.string().min(1),
    property_Y: z.string().min(1),
    property_Z: z.string().min(1),
    observatii: z.string().min(1),
    numar_certificat: z.string().min(1),
    property_C_2_equals_C_1: z.boolean(),
    property_C_3_equals_C_1: z.boolean(),
    created_at: z.string().min(1),
})

// defineste schema pentru updatata pentru car document
export const carDocumentUpdateSchema = carDocumentCreateSchema;
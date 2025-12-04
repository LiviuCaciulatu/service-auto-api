import {z} from "zod";
import {asyncHandler} from "@/shared/async-handler";

export const clientCreateRequestSchema = z.object({
    first_name: z.string().min(2, "at least 2 characters").max(50),
    last_name: z.string().min(2, "at least 2 characters").max(50),

    country: z.string().min(1),
    serie: z.string().min(1),
    number: z.string().min(1),
    nationality: z.string().min(1),
    cnp: z.string().min(1),
    birth_place: z.string().min(1),
    address: z.string().min(1),
    issued_by: z.string().min(1),
    validity: z.string().min(1)
});

export const clientUpdateRequestSchema = clientCreateRequestSchema;
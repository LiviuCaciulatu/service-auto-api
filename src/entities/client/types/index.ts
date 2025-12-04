import {z} from "zod";
import * as schemas from "@/entities/client/schemas/client-schema";

export type ClientCreateRequestSchema = z.infer<typeof schemas.clientCreateRequestSchema>
export type ClientUpdateRequestSchema = z.infer<typeof schemas.clientUpdateRequestSchema>

export type Client = {
    id: string;
    first_name: string;
    last_name: string;
    country: string;
    serie: string;
    number: string;
    nationality: string;
    cnp: string;
    birthplace: string;
    address: string;
    issued_by: string;
    validity: string;
    created_at: string;
}
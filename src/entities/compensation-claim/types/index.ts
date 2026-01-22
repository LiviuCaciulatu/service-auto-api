import {z} from "zod";
import * as schemas from "@/entities/compensation-claim/schemas/compensation-claim-schema";

export type CompensationClaimCreateSchema = z.infer<typeof schemas.compensationClaimCreateSchema>
export type CompensationClaimUpdateSchema = z.infer<typeof schemas.compensationClaimUpdateSchema>

export type CompensationClaim = {
    id: string;
    client_id: string;
    attention_to: string;
    claimant_name: string;
    cnp: string;
    role: string;
    vehicle_make: string;
    vehicle_model: string;
    registration_number: string;
    claim_number: string;
    observations: string;
    date: string;
    signature: string;
    compensated_clients?: Array<import("@/entities/compensated-client/types").CompensatedClient>
}
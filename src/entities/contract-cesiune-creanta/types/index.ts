import {z} from "zod";
import * as schemas from "@/entities/contract-cesiune-creanta/schemas/contract-cesiune-creanta-schema";

export type CesiuneCreantaCreateSchema = z.infer<typeof schemas.ContractCesiuneCreantaCreateSchema>
export type CesiuneCreantaUpdateSchema = z.infer<typeof schemas.ContractCesiuneCreantaUpdateSchema>

export type ContractCesiuneCreanta = {
    id: string;
    client_id: string;
    claim_number: string;
    claim_date: string;
    claimant_name: string;
    address: string;
    cnp: string;
    contract_value: string;
    insurance_company: string;
    insurance_company_address: string;
    insurance_company_cui: string;
    insurance_company_j: string;
    complaint_number: string;
    vehicle_registration_number: string;
    invoice_number: string;
    invoice_value: string;
    cedent: string;
    cesionar: string;
    administrator: string;
}
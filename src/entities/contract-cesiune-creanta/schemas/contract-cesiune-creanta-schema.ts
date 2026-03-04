import {z} from "zod";

export const ContractCesiuneCreantaCreateSchema = z.object({
    client_id: z.uuidv4(),
    claim_number: z.string().min(1),
    claim_date: z.string().min(1),
    claimant_name: z.string().min(1),
    address: z.string().min(1),
    cnp: z.string().min(1),
    contract_value: z.string().min(1),
    insurance_company: z.string().min(1),
    insurance_company_address: z.string().min(1),
    insurance_company_cui: z.string().min(1),
    insurance_company_j: z.string().min(1),
    complaint_number: z.string().min(1),
    vehicle_registration_number: z.string().min(1),
    invoice_number: z.string().min(1),
    invoice_value: z.string().min(1),
    cedent: z.string().min(1),
    cesionar: z.string().min(1),
    administrator: z.string().min(1),
    }
)

export const ContractCesiuneCreantaUpdateSchema = ContractCesiuneCreantaCreateSchema;

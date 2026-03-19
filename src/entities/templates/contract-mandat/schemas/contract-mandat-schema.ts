import {z} from "zod"

export const ContractMandatCreateSchema = z.object({
    client_id: z.uuid(),
    principal_name: z.string(),
    principal_address: z.string(),
    principal_cnp: z.string(),
    principal_id_series: z.string(),
    principal_id_number: z.string(),
    agent_name: z.string(),
    agent_address: z.string(),
    agent_cnp: z.string(),
    agent_id_series: z.string(),
    agent_id_number: z.string(),
    agent_id_issued_by: z.string(),
    vehicle_make: z.string(),
    vehicle_model: z.string(),
    vehicle_registration_number: z.string(),
    vehicle_vin: z.string(),
    incident_date: z.string(),
    contract_date: z.string(),
    pricipal_signature: z.string(),
    agent_signature: z.string(),
    created_at: z.string()
})

export const ContractMandatUpdateSchema = ContractMandatCreateSchema
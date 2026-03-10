import {z} from "zod";

export const imputernicireCreateSchema = z.object({
    client_id: z.uuidv4(),
    authorization_number: z.string(),
    authorization_date: z.string(),
    company_name: z.string(),
    company_registered_address: z.string(),
    company_trage_register_number: z.string(),
    company_cui: z.string(),
    company_representative_name: z.string(),
    company_representative_role: z.string(),
    agent_name: z.string(),
    agent_address: z.string(),
    agent_cnp: z.string(),
    agent_id_series: z.string(),
    agent_id_number: z.string(),
    agent_id_issued_by: z.string(),
    incident_date: z.string(),
    vehicle_make: z.string(),
    vehicle_model: z.string(),
    vehicle_vin: z.string(),
    vehicle_registration_number: z.string(),
    principal_signature: z.string(),
});

export const imputernicireUpdateSchema = imputernicireCreateSchema;
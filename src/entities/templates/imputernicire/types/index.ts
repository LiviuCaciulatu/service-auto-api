import {z} from 'zod'
import * as schemas from '@/entities/templates/imputernicire/schemas/imputernicire-schema';

export type ImputernicireCreateSchema = z.infer<typeof schemas.imputernicireCreateSchema>
export type ImputernicireUpdateSchema = z.infer<typeof schemas.imputernicireUpdateSchema>

export type Imputernicire = {
    id: string;
    client_id: string;
    authorization_number: string;
    authorization_date: string;
    company_name: string;
    company_registered_address: string;
    company_trage_register_number: string;
    company_cui: string;
    company_representative_name: string;
    company_representative_role: string;
    agent_name: string;
    agent_address: string;
    agent_cnp: string;
    agent_id_series: string;
    agent_id_number: string;
    agent_id_issued_by: string;
    incident_date: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_vin: string;
    vehicle_registration_number: string;
    principal_signature: string;
}
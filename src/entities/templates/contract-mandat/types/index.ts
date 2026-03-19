import {z} from 'zod'
import * as schemas from '@/entities/templates/contract-mandat/schemas/contract-mandat-schema';

export type ContractMandatCreateSchema = z.infer<typeof schemas.ContractMandatCreateSchema>
export type ContractMandatUpdateSchema = z.infer<typeof schemas.ContractMandatUpdateSchema>

export type ContractMandat = {
    id: string;
    client_id: string;
    principal_name: string;
    principal_address: string;
    principal_cnp: string;
    principal_id_series: string;
    principal_id_number: string;
    agent_name: string;
    agent_address: string;
    agent_cnp: string;
    agent_id_series: string;
    agent_id_number: string;
    agent_id_issued_by: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_registration_number: string;
    vehicle_vin: string;
    incident_date: string;
    contract_date: string;
    pricipal_signature: string;
    agent_signature: string;
    created_at: string
}
import {z} from 'zod'
import * as schemas from '@/entities/contract-inlocuire-temporara/schemas/contract-inlocuire-temporara-schema';

export type ContractInlocuireTemporaraCreateSchema = z.infer<typeof schemas.ContractInlocuireTemporaraCreateSchema>
export type ContractInlocuireTemporaraUpdateSchema = z.infer<typeof schemas.ContractInlocuireTemporaraUpdateSchema>

export type ContractInlocuireTemporara = {
    id: string;
    client_id: string;
    contract_number: string;
    contract_date: string;
    client_name: string;
    representing: string;
    cui: string;
    phone_number: string;
    address: string;
    damaged_vehicle_make: string;
    damaged_vehicle_registration_number: string;
    damaged_vehicle_year: string;
    damaged_vehicle_vin: string;
    damaged_vehicle_type: string;
    complaint_number: string;
    replacement_vehicle_make: string;
    replacement_vehicle_registration_number: string;
    replacement_vehicle_year: string;
    replacement_vehicle_delivery_date: string;
    replacement_vehicle_return_date: string;
    price: string;
}
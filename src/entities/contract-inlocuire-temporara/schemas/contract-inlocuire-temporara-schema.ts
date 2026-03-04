import {z} from 'zod';

const OptionalTextSchema = z.union([z.string().min(1), z.literal('')]).optional();
const OptionalReturnConditionSchema = z.union([z.enum(['BUNE', 'CU DEFECTE']), z.literal('')]).optional();

export const ContractInlocuireTemporaraCreateSchema = z.object({
    client_id: z.uuidv4(),
    contract_number: z.string().min(1),
    contract_date: z.string().min(1),
    client_name: z.string().min(1),
    representing: z.string().min(1),
    cui: z.string().min(1),
    phone_number: z.string().min(1),
    email: z.string().min(1),
    address: z.string().min(1),
    damaged_vehicle_make: z.string().min(1),
    damaged_vehicle_registration_number: z.string().min(1),
    damaged_vehicle_year: z.string().min(1),
    damaged_vehicle_vin: z.string().min(1),
    damaged_vehicle_type: z.string().min(1),
    complaint_number: z.string().min(1),
    replacement_vehicle_make: z.string().min(1),
    replacement_vehicle_registration_number: z.string().min(1),
    replacement_vehicle_year: z.string().min(1),
    replacement_vehicle_delivery_date: z.string().min(1),
    replacement_vehicle_return_date: z.string().min(1),
    vehicle_returned_date: OptionalTextSchema,
    return_condition: OptionalReturnConditionSchema,
    price: z.string().min(1),
})

export const ContractInlocuireTemporaraUpdateSchema = ContractInlocuireTemporaraCreateSchema;

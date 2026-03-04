import {z} from 'zod'
import * as schemas from '@/entities/contract-reparatii-auto/schemas/contract-reparatii-auto-schema';

export type ContractReparatiiAutoCreateSchema = z.infer<typeof schemas.ContractReparatiiAutoCreateSchema>
export type ContractReparatiiAutoUpdateSchema = z.infer<typeof schemas.ContractReparatiiAutoUpdateSchema>

export type ContractReparatiiAuto = {
    id?: string;
    client_id: string;
    contract_number: string;
    contract_date: string;
    client_name: string;
    client_address: string;
    client_phone: string;
    vehicle_make_model: string;
    vehicle_registration_number: string;
    vehicle_vin: string;
    client_requested_works: string;
    reinspections: string;
    execution_period: string;
    driver_belts: string;
    brake_lines: string;
    cooling_pipes: string;
    fuel_leaks: string;
    brake_pads: string;
    headlights: string;
    engine: string;
    gearbox: string;
    brake_fluid: string;
    washer_fluid: string;
    brake_test: string;
    exhaust_emissions: string;
    wheel_alignment: string;
    ac: string;
    central_locking: string;
    battery_charging: string;
    test_drive: string;
    rust: string;
    looseness: string;
    paint_color: string;
    paint_gloss: string;
}

import {z} from 'zod'
import * as schemas from '@/entities/templates/avizare-groupama/schemas/avizare-groupama-schema';

export type AvizareGroupamaCreateSchema = z.infer<typeof schemas.avizareGroupamaCreateSchema>
export type AvizareGroupamaUpdateSchema = z.infer<typeof schemas.avizareGroupamaUpdateSchema>

export type AvizareGroupama = {
    id: string;
    client_id: string;
    claimant_name: string;
    claimant_cnp: string;
    claimant_id_series: string;
    claimant_id_number: string;
    claimant_phone: string;
    claimant_email: string;
    incident_type: string;
    incident_date: string;
    incident_time: string;
    vehicle_state: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_registration_number: string;
    vehicle_owner: string;
    casco_number: string;
    rca_number: string;
    rca_date: string;
    trailer_make: string;
    trailer_type: string;
    trailer_registration_number: string;
    trailer_owner: string;
    trailer_casco: string;
    trailer_rca: string;
    incident_city: string;
    incident_county: string;
    incident_street: string;
    incident_building: string;
    incident_km: string;
    incident_direction_from: string;
    incident_direction_to: string;
    incident_description: string;
    incident_damages: string;
    incident_other_damages: boolean;
    incident_other_damages_description: string;
    police_investigation: boolean;
    contravention_report_issued: boolean;
    diagram: string;
    at_fault_vehicle_rca_series: string;
    at_fault_vehicle_rca_number: string;
    at_fault_vehicle_rca_insurer: string;
    at_fault_vehicle_optional_insurance: boolean;
    agree_pre_reparir_payment: boolean;
    date: string;
    signature: string;
}
import {z} from 'zod'
import * as schemas from '@/entities/templates/avizare-dallbog/schemas/avizare-dallbog-schema';

export type AvizareDallbogCreateSchema = z.infer<typeof schemas.AvizareDallbogCreateSchema>
export type AvizareDallbogUpdateSchema = z.infer<typeof schemas.AvizareDallbogUpdateSchema>

export type AvizareDallbog = {
    id: string;
    client_id: string;
    existing_damaged_vehicle: string;
    claim_date: string;
    claim_time: string;
    claim_series: string;
    claim_number: string;
    claim_inspector_signature: string;
    claimant_signature: string;
    claimant_name: string;
    claimant_father_name: string;
    claimant_mother_name: string;
    claimant_birth_date: string;
    claimant_birth_place: string;
    claimant_citizenship: string;
    claimant_address: string;
    claimant_cnp: string;
    claimant_id_series: string;
    claimant_id_number: string;
    claimant_license_category: string;
    claimant_license_number: string;
    claimant_license_issued_by: string;
    claimant_license_issued_date: string;
    claimant_license_experience: string;
    claimant_profession: string;
    claimant_employer: string;
    claimant_employer_phone: string;
    incident_date: string;
    incident_time: string;
    vehicle_state: string;
    vehicle_registration_number: string;
    vehicle_make_model: string;
    vehicle_color: string;
    vehicle_owner: string;
    incident_location: string;
    incident_street: string;
    incident_direction_from: string;
    incident_direction_to: string;
    incident_place: string;
    incident_intersection: string;
    incident_outside_of: string;
    incident_highway: string;
    vehicle_damages: string;
    existing_casco: boolean;
    casco_company: string;
    casco_validity_end_date: string;
    light_conditions: string;
    road_conditions: string;
    vehicle_category: string;
    past_damages: string;
    diagram: string;
    signature: string;
}
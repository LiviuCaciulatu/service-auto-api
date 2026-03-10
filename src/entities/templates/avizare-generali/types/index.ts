import {z} from 'zod'
import * as schemas from '@/entities/templates/avizare-generali/schemas/avizare-generali-schema';

export type AvizareGeneraliCreateSchema = z.infer<typeof schemas.AvizareGeneraliSchemaCreateSchema>
export type AvizareGeneraliUpdateSchema = z.infer<typeof schemas.AvizareGeneraliSchemaUpdateSchema>

export type AvizareGenerali = {
    id: string;
    client_id: string;
    claimant_name: string;
    claimant_cnp: string;
    claimant_address: string;
    claimant_correspondence_address: string;
    claimant_phone: string;
    claimant_email: string;
    incident_date: string;
    incident_time: string;
    vehicle_registration_number: string;
    vehicle_make: string;
    vehicle_owner: string;
    incident_location: string;
    incident_street: string;
    incident_direction_from: string;
    incident_direction_to: string;
    incident_description: string;
    incident_damages: string;
    other_vehicle_details: string;
    date: string;
    signature: string;
    other_vehicles_registration_numbers: string;
    diagram_before: string;
    diagram_at_time_of_incident: string;
    diagram_after: string;
    claim_date: string;
}
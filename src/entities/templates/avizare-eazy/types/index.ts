import {z} from 'zod'
import * as schemas from '@/entities/templates/avizare-eazy/schemas/avizare-eazy-schema';

export type AvizareEazyCreateSchema = z.infer<typeof schemas.AvizareEazyCreateSchema>
export type AvizareEazyUpdateSchema = z.infer<typeof schemas.AvizareEazyUpdateSchema>

export type AvizareEazy = {
    id: string;
    client_id: string;
    claimant_name: string;
    claimant_father_name: string;
    claimant_mother_name: string;
    claimant_birth_date: string;
    claimant_birth_place: string;
    claimant_address: string;
    claimant_cnp: string;
    claimant_id_series: string;
    claimant_id_number: string;
    claimant_id_issued_by: string;
    claimant_phone: string;
    claimant_email: string;
    other_victims: boolean;
    other_damages: boolean;
    other_damages_description: string;
    incident_date: string;
    incident_location: string;
    incident_time: string;
    vehicle_state: string;
    incident_street: string;
    incident_notes: string;
    diagram_before: string;
    diagram_at_time_of_incident: string;
    diagram_after: string;
    vehicle_diagram: string;
    vehicle_diagram_description: string;
    other_vehicle_diagram: string;
    other_vehicle_diagram_description: string;
    police_section: string;
    police_report_series: string;
    police_report_number: string;
    repair_authorisation_series: string;
    repair_authorisation_number: string;
    police_presence: string;
    ambulance_presence: string;
    towing_used: boolean;
    towing_contact_person: string;
    towing_company: string;
    towing_cost: string;
    photo_video: boolean;
    relationship_with_involved_party: boolean;
    related_person_name: string;
    relationship_type: string;
    at_fault_person_name: string;
    at_fault_person_address: string;
    at_fault_person_phone: string;
    at_fault_person_email: string;
    at_fault_vehicle_registration_number: string;
    other_details: string;
    claim_date: string;
    signature: string;
}
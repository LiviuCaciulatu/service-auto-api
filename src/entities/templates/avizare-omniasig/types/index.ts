import {z} from "zod";
import * as schemas from "@/entities/templates/avizare-omniasig/schemas/avizare-omniasig-schema";

export type AvizareOmniasigCreateSchema = z.infer<typeof schemas.AvizareOmniasigCreateSchema>
export type AvizareOmniasigUpdateSchema = z.infer<typeof schemas.AvizareOmniasigUpdateSchema>

export type AvizareOmniasig = {
    id: string;
    client_id: string;
    claimant_name: string;
    claimant_birth_date: string;
    claimant_address: string;
    claimant_cnp: string;
    claimant_driver_license_category: string;
    claimant_driver_license_number: string;
    claimant_driver_license_expiration_date: string;
    claimant_driver_license_experience: string;
    claimant_phone: string;
    claimant_email: string;
    representative_name: string;
    representative_birth_date: string;
    representative_address: string;
    representative_cnp: string;
    representative_driver_license_category: string;
    representative_driver_license_number: string;
    representative_driver_license_expiration_date: string;
    representative_driver_license_experience: string;
    representative_phone: string;
    representative_email: string;
    representative_of: string;
    incident_location: string;
    incident_type: string;
    incident_date: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_registration_number: string;
    person_driving: string;
    person_driving_capacity: string;
    owner_damaged_vehicle: string;
    claim_number: string;
    claim_validity: string;
    responsible_party: string;
    bodily_injury: boolean;
    injured_person_name_first: string;
    injured_person_name_second: string;
    damage: string;
    damaged_area: string;
    circumstances: string;
    informed_services: string;
    service: string;
    service_address: string;
    service_phone_email: string;
    light_conditions: string;
    road_conditions: string;
    other_damaged_vehicles: boolean;
    damaged_vehicles_number: string;
    other_damages: string;
    other_vehicle_driver: string;
    diagram: string;
    owner_permission: boolean;
    compensation_received: boolean;
    substance_use: boolean;
    preexisting_damage: boolean;
    preexisting_damage_description: boolean;
    insurance_declaration: boolean;
    signature: string;
}
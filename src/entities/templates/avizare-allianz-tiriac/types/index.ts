import {z} from "zod";
import * as schemas from "@/entities/templates/avizare-allianz-tiriac/schemas/avizare-allianz-tiriac-schema";

export type AvizareAllianzTiriacCreateSchema = z.infer<typeof schemas.AvizareAllianzTiriacCreateSchema>
export type AvizareAllianzTiriacUpdateSchema = z.infer<typeof schemas.AvizareAllianzTiriacUpdateSchema>

export type AvizareAllianzTiriac = {
    id: string;
    client_id: string;
    complaint_number: string;
    claimant_name: string;
    claimant_email: string;
    claimant_mobile_phone: string;
    claimant_landline_phone: string;
    representing_name: string;
    incident_date: string;
    incident_hour: string;
    location: string;
    vehicle_make: string;
    registration_number: string;
    vin: string;
    owned_by: string;
    casco_number: string;
    insurance_company: string;
    parked_at: boolean;
    driven_by: string;
    material_damage: boolean;
    injured: boolean;
    name_of_injured: string;
    party_responsible: string;
    party_responsible_vehicle_make: string;
    party_responsible_registration_number: string;
    party_responsible_rca: string;
    party_responsible_insurance_company: string;
    diagram: string;
    description: string;
    casco: string;
    rcs: string;
    date: string;
    signature: string;
    createdAt: string;
}
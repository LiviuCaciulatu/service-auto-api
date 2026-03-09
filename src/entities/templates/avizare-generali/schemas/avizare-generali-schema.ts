import {z} from 'zod'

export const AvizareGeneraliSchemaCreateSchema = z.object({
    client_id: z.uuidv4(),
    claimant_name: z.string(),
    claimant_cnp: z.string(),
    claimant_address: z.string(),
    claimant_correspondence_address: z.string(),
    claimant_phone: z.string(),
    claimant_email: z.string(),
    incident_date: z.string(),
    incident_time: z.string(),
    vehicle_registration_number: z.string(),
    vehicle_make: z.string(),
    vehicle_owner: z.string(),
    incident_location: z.string(),
    incident_street: z.string(),
    incident_direction_from: z.string(),
    incident_direction_to: z.string(),
    incident_description: z.string(),
    incident_damages: z.string(),
    other_vehicle_details: z.string(),
    date: z.string(),
    signature: z.string(),
    other_vehicles_registration_numbers: z.string(),
    diagram_before: z.string(),
    diagram_at_time_of_incident: z.string(),
    diagram_after: z.string(),
    claim_date: z.string(),
})

export const  AvizareGeneraliSchemaUpdateSchema = AvizareGeneraliSchemaCreateSchema;
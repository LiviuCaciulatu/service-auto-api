import {query} from "@/db";
import * as types from "@/entities/templates/avizare-generali/types";

export async function getAllAvizareGenerali(): Promise<Array<types.AvizareGenerali>> {
    const result = await query(`
    SELECT * FROM avizare_generali
    ORDER BY created_at DESC`);
    return result.rows;
}

export async function createAvizareGenerali(data: types.AvizareGeneraliCreateSchema): Promise<types.AvizareGenerali> {
    const result = await query(`
    INSERT INTO avizare_generali (
        client_id,
        claimant_name,
        claimant_cnp,
        claimant_address,
        claimant_correspondence_address,
        claimant_phone,
        claimant_email,
        incident_date,
        incident_time,
        vehicle_registration_number,
        vehicle_make,
        vehicle_owner,
        incident_location,
        incident_street,
        incident_direction_from,
        incident_direction_to,
        incident_description,
        incident_damages,
        other_vehicle_details,
        other_vehicles_registration_numbers,
        diagram_before,
        diagram_at_time_of_incident,
        diagram_after,
        claim_date,
        date,
        signature,
        created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
            $21,$22,$23,$24,$25,$26,$27)
    RETURNING *`,
        [
            data.client_id,
            data.claimant_name,
            data.claimant_cnp,
            data.claimant_address,
            data.claimant_correspondence_address,
            data.claimant_phone,
            data.claimant_email,
            data.incident_date,
            data.incident_time,
            data.vehicle_registration_number,
            data.vehicle_make,
            data.vehicle_owner,
            data.incident_location,
            data.incident_street,
            data.incident_direction_from,
            data.incident_direction_to,
            data.incident_description,
            data.incident_damages,
            data.other_vehicle_details,
            data.other_vehicles_registration_numbers,
            data.diagram_before,
            data.diagram_at_time_of_incident,
            data.diagram_after,
            data.claim_date,
            data.date,
            data.signature,
            data.created_at
        ]
    );

    return result.rows[0];
}

export async function getAvizareGeneraliById(id: string): Promise<types.AvizareGenerali> {
    const result = await query(
        `SELECT * FROM avizare_generali WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}

export async function updateAvizareGenerali(id: string, data: types.AvizareGeneraliUpdateSchema): Promise<types.AvizareGenerali> {
    const result = await query(
        `UPDATE avizare_generali
      SET client_id = $2,
          claimant_name = $3,
          claimant_cnp = $4,
          claimant_address = $5,
          claimant_correspondence_address = $6,
          claimant_phone = $7,
          claimant_email = $8,
          incident_date = $9,
          incident_time = $10,
          vehicle_registration_number = $11,
          vehicle_make = $12,
          vehicle_owner = $13,
          incident_location = $14,
          incident_street = $15,
          incident_direction_from = $16,
          incident_direction_to = $17,
          incident_description = $18,
          incident_damages = $19,
          other_vehicle_details = $20,
          other_vehicles_registration_numbers = $21,
          diagram_before = $22,
          diagram_at_time_of_incident = $23,
          diagram_after = $24,
          claim_date = $25,
          date = $26,
          signature = $27,
          created_at = $28
      WHERE id = $1
      RETURNING *`,
        [
            id,
            data.client_id,
            data.claimant_name,
            data.claimant_cnp,
            data.claimant_address,
            data.claimant_correspondence_address,
            data.claimant_phone,
            data.claimant_email,
            data.incident_date,
            data.incident_time,
            data.vehicle_registration_number,
            data.vehicle_make,
            data.vehicle_owner,
            data.incident_location,
            data.incident_street,
            data.incident_direction_from,
            data.incident_direction_to,
            data.incident_description,
            data.incident_damages,
            data.other_vehicle_details,
            data.other_vehicles_registration_numbers,
            data.diagram_before,
            data.diagram_at_time_of_incident,
            data.diagram_after,
            data.claim_date,
            data.date,
            data.signature,
            data.created_at
        ]
    );

    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}
import {query} from "@/db";
import * as types from "@/entities/templates/avizare-groupama/types";

export async function getAllAvizareGroupama(): Promise<Array<types.AvizareGroupama>> {
    const result = await query(`
    SELECT * FROM avizare_groupama
    ORDER BY created_at DESC`
    );
    return result.rows;
}

export async function createAvizareGroupama(data: types.AvizareGroupamaCreateSchema): Promise<types.AvizareGroupama> {
    const result = await query(`
    INSERT INTO avizare_groupama(
        client_id,
        claimant_name,
        claimant_cnp,
        claimant_id_series,
        claimant_id_number,
        claimant_phone,
        claimant_email,
        incident_type,
        incident_date,
        incident_time,
        vehicle_state,
        vehicle_make,
        vehicle_model,
        vehicle_registration_number,
        vehicle_owner,
        casco_number,
        rca_number,
        rca_date,
        trailer_make,
        trailer_type,
        trailer_registration_number,
        trailer_owner,
        trailer_casco,
        trailer_rca,
        incident_city,
        incident_county,
        incident_street,
        incident_building,
        incident_km,
        incident_direction_from,
        incident_direction_to,
        incident_description,
        incident_damages,
        incident_other_damages,
        incident_other_damages_description,
        police_investigation,
        contravention_report_issued,
        diagram,
        at_fault_vehicle_rca_series,
        at_fault_vehicle_rca_number,
        at_fault_vehicle_rca_insurer,
        at_fault_vehicle_optional_insurance,
        agree_pre_reparir_payment,
        claim_date,
        signature
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
                $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
                $41,$42,$43,$44,$45)
    RETURNING *
    `,
        [
            data.client_id,
            data.claimant_name,
            data.claimant_cnp,
            data.claimant_id_series,
            data.claimant_id_number,
            data.claimant_phone,
            data.claimant_email,
            data.incident_type,
            data.incident_date,
            data.incident_time,
            data.vehicle_state,
            data.vehicle_make,
            data.vehicle_model,
            data.vehicle_registration_number,
            data.vehicle_owner,
            data.casco_number,
            data.rca_number,
            data.rca_date,
            data.trailer_make,
            data.trailer_type,
            data.trailer_registration_number,
            data.trailer_owner,
            data.trailer_casco,
            data.trailer_rca,
            data.incident_city,
            data.incident_county,
            data.incident_street,
            data.incident_building,
            data.incident_km,
            data.incident_direction_from,
            data.incident_direction_to,
            data.incident_description,
            data.incident_damages,
            data.incident_other_damages,
            data.incident_other_damages_description,
            data.police_investigation,
            data.contravention_report_issued,
            data.diagram,
            data.at_fault_vehicle_rca_series,
            data.at_fault_vehicle_rca_number,
            data.at_fault_vehicle_rca_insurer,
            data.at_fault_vehicle_optional_insurance,
            data.agree_pre_reparir_payment,
            data.claim_date,
            data.signature
        ]
    );

    return result.rows[0];
}

export async function getAvizareGroupamaById(id: string): Promise<types.AvizareGroupama> {
    const result = await query(
        `SELECT * FROM avizare_groupama WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}

export async function updateAvizareGroupama(id: string, data: types.AvizareGroupamaUpdateSchema): Promise<types.AvizareGroupama> {
    const result = await query(
        `UPDATE avizare_groupama
      SET client_id = $2,
          claimant_name = $3,
          claimant_cnp = $4,
          claimant_id_series = $5,
          claimant_id_number = $6,
          claimant_phone = $7,
          claimant_email = $8,
          incident_type = $9,
          incident_date = $10,
          incident_time = $11,
          vehicle_state = $12,
          vehicle_make = $13,
          vehicle_model = $14,
          vehicle_registration_number = $15,
          vehicle_owner = $16,
          casco_number = $17,
          rca_number = $18,
          rca_date = $19,
          trailer_make = $20,
          trailer_type = $21,
          trailer_registration_number = $22,
          trailer_owner = $23,
          trailer_casco = $24,
          trailer_rca = $25,
          incident_city = $26,
          incident_county = $27,
          incident_street = $28,
          incident_building = $29,
          incident_km = $30,
          incident_direction_from = $31,
          incident_direction_to = $32,
          incident_description = $33,
          incident_damages = $34,
          incident_other_damages = $35,
          incident_other_damages_description = $36,
          police_investigation = $37,
          contravention_report_issued = $38,
          diagram = $39,
          at_fault_vehicle_rca_series = $40,
          at_fault_vehicle_rca_number = $41,
          at_fault_vehicle_rca_insurer = $42,
          at_fault_vehicle_optional_insurance = $43,
          agree_pre_reparir_payment = $44,
          claim_date = $45,
          signature = $46
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.claimant_name,
            data.claimant_cnp,
            data.claimant_id_series,
            data.claimant_id_number,
            data.claimant_phone,
            data.claimant_email,
            data.incident_type,
            data.incident_date,
            data.incident_time,
            data.vehicle_state,
            data.vehicle_make,
            data.vehicle_model,
            data.vehicle_registration_number,
            data.vehicle_owner,
            data.casco_number,
            data.rca_number,
            data.rca_date,
            data.trailer_make,
            data.trailer_type,
            data.trailer_registration_number,
            data.trailer_owner,
            data.trailer_casco,
            data.trailer_rca,
            data.incident_city,
            data.incident_county,
            data.incident_street,
            data.incident_building,
            data.incident_km,
            data.incident_direction_from,
            data.incident_direction_to,
            data.incident_description,
            data.incident_damages,
            data.incident_other_damages,
            data.incident_other_damages_description,
            data.police_investigation,
            data.contravention_report_issued,
            data.diagram,
            data.at_fault_vehicle_rca_series,
            data.at_fault_vehicle_rca_number,
            data.at_fault_vehicle_rca_insurer,
            data.at_fault_vehicle_optional_insurance,
            data.agree_pre_reparir_payment,
            data.claim_date,
            data.signature
        ]
    );

    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}
import {query} from "@/db";
import * as types from "@/entities/templates/avizare-allianz-tiriac/types";

export async function getAllAvizareAllianzTiriac(): Promise<Array<types.AvizareAllianzTiriac>> {
    const result = await query(`
    SELECT * FROM avizare_allianz_tiriac
    ORDER BY created_at DESC`);
    return result.rows;
}

export async function createAvizareAllianzTiriac(data: types.AvizareAllianzTiriacCreateSchema): Promise<types.AvizareAllianzTiriac> {
    const result = await query(`
    INSERT INTO avizare_allianz_tiriac (
        client_id,
        complaint_number,
        claimant_name,
        claimant_email,
        claimant_mobile_phone,
        claimant_landline_phone,
        representing_name,
        incident_date,
        incident_hour,
        location,
        vehicle_make,
        registration_number,
        vin,
        owned_by,
        casco_number,
        insurance_company,
        parked_at,
        driven_by,
        material_damage,
        injured,
        name_of_injured,
        party_responsible,
        party_responsible_vehicle_make,
        party_responsible_registration_number,
        party_responsible_rca,
        party_responsible_insurance_company,
        diagram,
        description,
        casco,
        rcs,
        date,
        signature
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
            $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
            $31,$32)
    RETURNING *`,
        [
            data.client_id,
            data.complaint_number,
            data.claimant_name,
            data.claimant_email,
            data.claimant_mobile_phone,
            data.claimant_landline_phone,
            data.representing_name,
            data.incident_date,
            data.incident_hour,
            data.location,
            data.vehicle_make,
            data.registration_number,
            data.vin,
            data.owned_by,
            data.casco_number,
            data.insurance_company,
            data.parked_at,
            data.driven_by,
            data.material_damage,
            data.injured,
            data.name_of_injured,
            data.party_responsible,
            data.party_responsible_vehicle_make,
            data.party_responsible_registration_number,
            data.party_responsible_rca,
            data.party_responsible_insurance_company,
            data.diagram,
            data.description,
            data.casco,
            data.rcs,
            data.date,
            data.signature
        ]
        );

    return result.rows[0];
}

export async function getAvizareAllianzTiriacById(id: string): Promise<types.AvizareAllianzTiriac> {
    const result = await query(
        `SELECT * FROM avizare_allianz_tiriac WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}

export async function updateAvizareAllianzTiriac(id: string, data: types.AvizareAllianzTiriacUpdateSchema): Promise<types.AvizareAllianzTiriac> {
    const result = await query(
        `UPDATE avizare_allianz_tiriac
      SET client_id = $2,
          complaint_number = $3,
          claimant_name = $4,
          claimant_email = $5,
          claimant_mobile_phone = $6,
          claimant_landline_phone = $7,
          representing_name = $8,
          incident_date = $9,
          incident_hour = $10,
          location = $11,
          vehicle_make = $12,
          registration_number = $13,
          vin = $14,
          owned_by = $15,
          casco_number = $16,
          insurance_company = $17,
          parked_at = $18,
          driven_by = $19,
          material_damage = $20,
          injured = $21,
          name_of_injured = $22,
          party_responsible = $23,
          party_responsible_vehicle_make = $24,
          party_responsible_registration_number = $25,
          party_responsible_rca = $26,
          party_responsible_insurance_company = $27,
          diagram = $28,
          description = $29,
          casco = $30,
          rcs = $31,
          date = $32,
          signature = $33
      WHERE id = $1
      RETURNING *`,
        [
            id,
            data.client_id,
            data.complaint_number,
            data.claimant_name,
            data.claimant_email,
            data.claimant_mobile_phone,
            data.claimant_landline_phone,
            data.representing_name,
            data.incident_date,
            data.incident_hour,
            data.location,
            data.vehicle_make,
            data.registration_number,
            data.vin,
            data.owned_by,
            data.casco_number,
            data.insurance_company,
            data.parked_at,
            data.driven_by,
            data.material_damage,
            data.injured,
            data.name_of_injured,
            data.party_responsible,
            data.party_responsible_vehicle_make,
            data.party_responsible_registration_number,
            data.party_responsible_rca,
            data.party_responsible_insurance_company,
            data.diagram,
            data.description,
            data.casco,
            data.rcs,
            data.date,
            data.signature
        ]
    );

    if(result.rowCount === 0) throw new Error("Avizare not found");
    return result.rows[0];
}
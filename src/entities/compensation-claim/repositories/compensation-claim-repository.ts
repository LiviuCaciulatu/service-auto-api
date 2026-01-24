import {query} from "@/db";
import * as types from "@/entities/compensation-claim/types";

export async function getAllCompensationClaims(): Promise<Array<types.CompensationClaim>> {
    const result = await query(`
        SELECT *
        FROM compensation_claims
        ORDER BY created_at DESC
    `);

    return result.rows;
}

export async function createCompensationClaim(data: types.CompensationClaimCreateSchema): Promise<types.CompensationClaim> {
    const result = await query(
        `
        INSERT INTO compensation_claims (client_id, attention_to, claim_file_number,claimant_name, cnp, role, vehicle_make, vehicle_model, registration_number, claim_number, observations, date, signature) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING *`,
        [data.client_id, data.attention_to, data.claim_file_number, data.claimant_name, data.cnp, data.role, data.vehicle_make, data.vehicle_model, data.registration_number, data.claim_number, data.observations, data.date, data.signature]
    );

    return result.rows[0];
}

export async function getCompensationClaimById(id: string): Promise<types.CompensationClaim> {
    const result = await query(
        `SELECT * FROM compensation_claims WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Compensation claim not found");
    return result.rows[0];
}

export async function existsByCompensationClaimId(id: string): Promise<boolean> {
    const result = await query(
        `SELECT * FROM compensation_claims WHERE id = $1`,
        [id]
    );
    return (result.rowCount ?? 0) > 0;
}


export async function updateCompensationClaim(id: string, data: types.CompensationClaimUpdateSchema): Promise<types.CompensationClaim> {
    const result = await query(
        `UPDATE compensation_claims 
            SET attention_to = $2, claim_file_number= $3, claimant_name = $4, cnp = $5, role = $6, vehicle_make = $7, vehicle_model = $8, registration_number = $9, claim_number = $10, observations = $11, date = $12, signature = $13 
            WHERE id = $1 RETURNING *`,
        [id, data.attention_to, data.claim_file_number, data.claimant_name, data.cnp, data.role, data.vehicle_make, data.vehicle_model, data.registration_number, data.claim_number, data.observations, data.date, data.signature]
    );

    if (result.rowCount === 0) throw new Error("Compensation claim not found");
    return result.rows[0];
}

export async function getCompensationClaimsByClientId(clientId: string): Promise<Array<types.CompensationClaim>> {
    const result = await query(
        `SELECT * FROM compensation_claims WHERE client_id = $1`,
        [clientId]
    );
    return result.rows;
}



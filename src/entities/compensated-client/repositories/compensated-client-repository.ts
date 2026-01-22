import {query} from "@/db";
import * as types from "@/entities/compensated-client/types";

export async function getAllCompensatedClients(): Promise<Array<types.CompensatedClient>> {
    const result = await query(`
    SELECT * FROM compensated_drivers
    ORDER BY created_at DESC`);

    return result.rows;
}

export async function createCompensatedClient(data: types.CompensatedClientCreateSchema): Promise<types.CompensatedClient> {
    const result = await query(`
        INSERT INTO compensated_drivers (claim_id, amount, bank, iban, account_holder) 
        VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
        [data.claim_id, data.amount, data.bank, data.iban, data.account_holder]);

    return result.rows[0];
}

export async function getCompensatedClientById(id: string): Promise<types.CompensatedClient> {
    const result = await query(
        `SELECT * FROM compensated_drivers WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Compensated client not found");
    return result.rows[0];
}

export async function updateCompensatedClient(id: string, data: types.CompensatedClientUpdateSchema): Promise<types.CompensatedClient> {
    const result = await query(
        `UPDATE compensated_drivers 
            SET amount = $2, bank = $3, iban = $4, account_holder = $5
            WHERE id = $1 RETURNING *`,
        [id, data.amount, data.bank, data.iban, data.account_holder]
    );

    if(result.rowCount === 0) throw new Error("Compensated client not found");
    return result.rows[0];
}

export async function getCompensatedClientsByClaimId(claimId: string): Promise<Array<types.CompensatedClient>> {
    const result = await query(
        `SELECT * FROM compensated_drivers WHERE claim_id = $1`,
        [claimId]
    );
    return result.rows;
}

export async function deleteCompensatedClientByClaimId(claimId: string): Promise<void> {
    await query(`DELETE FROM compensated_drivers WHERE claim_id = $1`,
        [claimId]);
}
import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-generali/types";

export async function getAllGdprGenerali(): Promise<Array<types.GdprGenerali>> {
    const result = await query(`
        SELECT *
        FROM gdpr_generali
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getGdprGeneraliById(id: string): Promise<types.GdprGenerali> {
    const result = await query(
        `SELECT * FROM gdpr_generali WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprGenerali(data: types.GdprGeneraliCreateSchema): Promise<types.GdprGenerali> {
    const result = await query(`
        INSERT INTO gdpr_generali(client_id,
                                client_name,
                                signature,
                                created_at)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [
            data.client_id,
            data.client_name,
            data.signature,
            data.created_at
        ]
    );
    return result.rows[0];
}

export async function updateGdprGenerali(id: string, data: types.GdprGeneraliUpdateSchema): Promise<types.GdprGenerali> {
    const result = await query(
        `UPDATE gdpr_generali
        SET client_id = $2,
            client_name = $3,
            signature = $4,
            created_at = $5
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.client_name,
            data.signature,
            data.created_at
        ]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-asirom/types";

export async function getAllGdprAsirom(): Promise<Array<types.GdprAsirom>> {
    const result = await query(`
        SELECT *
        FROM gdpr_asirom
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getGdprAsiromById(id: string): Promise<types.GdprAsirom> {
    const result = await query(
        `SELECT * FROM gdpr_asirom WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprAsirom(data: types.GdprAsiromCreateSchema): Promise<types.GdprAsirom> {
    const result = await query(`
        INSERT INTO gdpr_asirom(client_id,
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
        ]);
    return result.rows[0];
}

export async function updateGdprAsirom(id: string, data: types.GdprAsiromUpdateSchema): Promise<types.GdprAsirom> {
    const result = await query(
        `UPDATE gdpr_asirom
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
    )
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
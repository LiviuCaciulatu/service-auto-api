import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-groupama/types";

export async function getAllGdprGroupama(): Promise<Array<types.GdprGroupama>> {
    const result = await query(`
        SELECT * FROM gdpr_groupama
        ORDER BY created_at DESC`);
    return result.rows;
}

export async function getGdprGroupamaById(id: string): Promise<types.GdprGroupama> {
    const result = await query(
        `SELECT * FROM gdpr_groupama WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprGroupama(data: types.GdprGroupamaCreateSchema): Promise<types.GdprGroupama>{
    const result = await query(
        `INSERT INTO gdpr_groupama (client_id,
                           client_name,
                           capacity,
                           signature,
                           created_at)
                           VALUES ($1,$2,$3,$4,$5)
                           RETURNING *`,
        [
            data.client_id,
            data.client_name,
            data.capacity,
            data.signature,
            data.created_at
        ]
    );
    return result.rows[0];
}

export async function updateGdprGroupama(id: string, data: types.GdprGroupamaUpdateSchema): Promise<types.GdprGroupama> {
    const result = await query(
        `UPDATE gdpr_groupama
        SET client_id = $2,
            client_name = $3,
            capacity = $4,
            signature = $5,
            created_at = $6
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.client_name,
            data.capacity,
            data.signature,
            data.created_at
        ]
    )
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
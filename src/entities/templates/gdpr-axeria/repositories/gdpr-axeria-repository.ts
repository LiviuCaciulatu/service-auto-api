import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-axeria/types";

export async function getAllGdprAxeria(): Promise<Array<types.GdprAxeria>> {
    const result = await query(`
        SELECT *
        FROM gdpr_axeria
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getGdprAxeriaById(id: string): Promise<types.GdprAxeria> {
    const result = await query(
        `SELECT * FROM gdpr_axeria WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprAxeria(data: types.GdprAxeriaCreateSchema): Promise<types.GdprAxeria> {
    const result = await query(`
        INSERT INTO gdpr_axeria(client_id,
                                client_name,
                                client_id_series,
                                client_id_number,
                                signature,
                                created_at)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            data.client_id,
            data.client_name,
            data.client_id_series,
            data.client_id_number,
            data.signature,
            data.created_at
        ]);
    return result.rows[0];
}

export async function updateGdprAxeria(id: string, data: types.GdprAxeriaUpdateSchema): Promise<types.GdprAxeria> {
    const result = await query(
        `UPDATE gdpr_axeria
        SET client_id = $2,
            client_name = $3,
            client_id_series = $4,
            client_id_number = $5,
            signature = $6,
            created_at = $7
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.client_name,
            data.client_id_series,
            data.client_id_number,
            data.signature,
            data.created_at
        ]
    )
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
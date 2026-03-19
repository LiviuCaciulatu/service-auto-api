import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-hellas-direct/types";

export async function getAllGdprHellasDirect(): Promise<Array<types.GdprHellasDirect>> {
    const result = await query(`
        SELECT *
        FROM gdpr_hellas_direct
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getGdprHellasDirectById(id: string): Promise<types.GdprHellasDirect> {
    const result = await query(
        `SELECT * FROM gdpr_hellas_direct WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprHellasDirect(data: types.GdprHellasDirectCreateSchema): Promise<types.GdprHellasDirect> {
    const result = await query(`
        INSERT INTO gdpr_hellas_direct (
            client_id,
            client_name,
            signature,
            gdpr_date,
            created_at)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
            data.client_id,
            data.client_name,
            data.signature,
            data.gdpr_date,
            data.created_at
        ]);
    return result.rows[0];
}

export async function updateGdprHellasDirect(id: string, data: types.GdprHellasDirectUpdateSchema): Promise<types.GdprHellasDirect> {
    const result = await query(
        `UPDATE gdpr_hellas_direct
      SET client_id = $2,
          client_name = $3,
          signature = $4,
          gdpr_date = $5,
          created_at = $6
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.client_name,
            data.signature,
            data.gdpr_date,
            data.created_at
        ]
    )
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
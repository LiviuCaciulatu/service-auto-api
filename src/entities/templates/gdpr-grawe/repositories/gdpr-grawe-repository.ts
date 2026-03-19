import {query} from "@/db";
import * as types from "@/entities/templates/gdpr-grawe/types";

export async function getAllGdprGrawe(): Promise<Array<types.GdprGrawe>> {
    const result = await query(`
        SELECT *
        FROM gdpr_grawe
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getGdprGraweById(id: string): Promise<types.GdprGrawe> {
    const result = await query(
        `SELECT * FROM gdpr_grawe WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createGdprGrawe(data: types.GdprGraweCreateSchema): Promise<types.GdprGrawe> {
    const result = await query(`
        INSERT INTO gdpr_grawe(client_id,
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

export async function updateGdprGrawe(id: string, data: types.GdprGraweUpdateSchema): Promise<types.GdprGrawe> {
    const result = await query(
        `UPDATE gdpr_grawe
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
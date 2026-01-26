import {query} from "@/db";
import * as types from "@/entities/client/types";

// cheama get all clients din baza de date
export async function getAllClients(): Promise<Array<types.Client>> {
    const result = await query(`
        SELECT *
        FROM clients
        ORDER BY created_at DESC
    `);

    return result.rows;
}

// cheama create client din baza de date
export async function createClient(data: types.ClientCreateRequestSchema): Promise<types.Client> {
    const result = await query(
        `
            INSERT INTO clients (first_name, last_name, country, serie, number, nationality, cnp, birth_place, address,
                                 issued_by, validity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `,
        [data.first_name, data.last_name, data.country, data.serie, data.number, data.nationality, data.cnp, data.birth_place, data.address, data.issued_by, data.validity]
    );

    return result.rows[0];
}

export async function existsByClientId(id: string): Promise<boolean> {
    const result = await query(
        `SELECT * FROM clients WHERE id = $1`,
        [id]
    );
    return (result.rowCount ?? 0) > 0;
}

export async function updateClient(id: string, data: types.ClientUpdateRequestSchema): Promise<types.Client> {
    const result = await query(
        `
        UPDATE clients
        SET first_name = $2, last_name = $3, country = $4, serie = $5, number = $6, nationality = $7, cnp = $8, birth_place = $9, address = $10, issued_by = $11, validity = $12
        WHERE id = $1
        RETURNING *
        `, [id, data.first_name, data.last_name, data.country, data.serie, data.number, data.nationality, data.cnp, data.birth_place, data.address, data.issued_by, data.validity]
    )

    if (result.rowCount === 0) throw new Error("Client not found");
    return result.rows[0];
}

export async function getClientById(id: string): Promise<types.Client> {
    const result = await query(
        `SELECT * FROM clients WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Client not found");
    return result.rows[0];
}

export async function getCompensationClaimsByClientId(clientId: string){
    const result = await query(
        `
    SELECT
      cc.*,
      COALESCE(comp.compensated_clients, '[]'::json) AS compensated_clients
    FROM compensation_claims cc
    LEFT JOIN (
      SELECT
        claim_id,
        json_agg(
          json_build_object(
            'id', id,
            'amount', amount,
            'bank', bank,
            'iban', iban,
            'account_holder', account_holder,
            'created_at', created_at
          )
        ) AS compensated_clients
      FROM compensated_drivers
      GROUP BY claim_id
    ) comp ON comp.claim_id = cc.id
    WHERE cc.client_id = $1
    ORDER BY cc.created_at DESC
    `,
        [clientId]
    );

    return result.rows;
}

export async function getDriverLicensesByClientId(clientId: string){
    const result = await query(
        `SELECT * FROM driver_licenses WHERE client_id = $1`,
        [clientId]
    );
    return result.rows;
}

export async function getCarDocumentsByClientId(clientId: string){
    const result = await query(
        `SELECT * FROM car_documents WHERE client_id = $1`,
        [clientId]
    );
    return result.rows;
}



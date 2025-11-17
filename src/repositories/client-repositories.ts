import { pool } from "../db";
import type { ClientInput } from "@/services/client-services";

export async function getAllClients() {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.first_name,
      c.last_name,
      c.created_at,

      i.country,
      i.serie,
      i.number,
      i.nationality,
      i.cnp,
      i.birth_place,
      i.address,
      i.issued_by,
      i.validity

    FROM clients c
    JOIN client_id_cards i
      ON i.client_id = c.id
    ORDER BY c.created_at DESC
    `
  );

  return result.rows;
}

export async function createClient(data: { first_name: string; last_name: string }) {
  const result = await pool.query(
    `
      INSERT INTO clients (first_name, last_name)
      VALUES ($1, $2)
      RETURNING id, first_name, last_name, created_at
    `,
    [data.first_name, data.last_name]
  );

  return result.rows[0];
}

export async function createClientIdCard(clientId: string, data: {
  country: string;
  serie: string;
  number: string;
  nationality: string;
  cnp: string;
  birth_place: string;
  address: string;
  issued_by: string;
  validity: string;
}) {
  const result = await pool.query(
    `
      INSERT INTO client_id_cards (
        client_id,
        country,
        serie,
        number,
        nationality,
        cnp,
        birth_place,
        address,
        issued_by,
        validity
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `,
    [
      clientId,
      data.country,
      data.serie,
      data.number,
      data.nationality,
      data.cnp,
      data.birth_place,
      data.address,
      data.issued_by,
      data.validity
    ]
  );

  return result.rows[0];
}
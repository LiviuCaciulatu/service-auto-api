import { pool } from "../db";
import type { ClientInput } from "@/services/client-services";

export async function getAllClients() {
  const result = await pool.query(`
    SELECT *
    FROM clients
    ORDER BY created_at DESC
  `);

  return result.rows;
}

export async function createClient(data) {
  const result = await pool.query(
    `
      INSERT INTO clients (
        first_name,
        last_name,
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `,
    [
      data.first_name,
      data.last_name,
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
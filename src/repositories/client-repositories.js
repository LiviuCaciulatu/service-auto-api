import { pool } from "../db";
export async function getAllClients() {
    const result = await pool.query(`SELECT id, first_name, last_name, created_at
    FROM clients
    ORDER BY create_at DESC
    `);
    return result.rows;
}
export async function createClient(data) {
    const result = await pool.query(`INSERT INTO clients (first_name, last_name)
    VALUES ($1, $2)
    RETURNING id, first_name, last_name, created_at`, [data.first_name, data.last_name]);
    return result.rows[0];
}
//# sourceMappingURL=client-repositories.js.map
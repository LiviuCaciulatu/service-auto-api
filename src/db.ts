import type {QueryResult, QueryResultRow} from "pg";
import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.MODE === "development" ? false : {rejectUnauthorized: false}
});

export async function query<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    try {
        return await pool.query<T>(text, params);
    } catch (err) {
        console.error("Database query error:", err);
        throw err;
    }
};
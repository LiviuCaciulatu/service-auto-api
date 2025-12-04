import {Pool} from "pg";
import type {QueryResult, QueryResultRow} from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    try {
        const result = await pool.query<T>(text, params);
        return result;
    } catch (err) {
        console.error("Database query error:", err);
        throw err;
    }
};
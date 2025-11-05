import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
export async function query(text, params) {
    try {
        const result = await pool.query(text, params);
        return result;
    }
    catch (err) {
        console.error("Database query error:", err);
        throw err;
    }
}
;
//# sourceMappingURL=db.js.map
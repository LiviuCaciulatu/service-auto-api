import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../db";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function migrate() {
    try {
        const filePath = path.join(__dirname, "../../sql/init.sql");
        const sql = fs.readFileSync(filePath, "utf-8");
        console.log("running database migration");
        await pool.query(sql);
        console.log("migration completed successfully");
    }
    catch (error) {
        console.error("migration failed", error);
        process.exitCode = 1;
    }
    finally {
        await pool.end();
    }
}
migrate().then();
//# sourceMappingURL=migrate.js.map
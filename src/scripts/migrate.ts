const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

async function migrate() {
try{
    const filePath = path.join(__dirname, "../../sql/init.sql");
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log("running database migration");

    await pool.query(sql);

    console.log("migration completed successfully");
    } catch (error) {
    console.error("migration failed");
    } finally {
    await pool.end();
    }

}

migrate();
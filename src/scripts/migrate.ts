import fs from "fs";
import path from "path";
import type {PoolClient} from "pg";
import { pool } from "@/db";

const MIGRATION_LOCK_KEY = 2147483001;
const DB_READY_RETRY_ATTEMPTS = 10;
const DB_READY_RETRY_DELAY_MS = 1500;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resolveInitSqlPath(): string {
    const envPath = process.env.INIT_SQL_PATH;
    const candidates = [
        envPath,
        path.resolve(process.cwd(), "sql/init.sql"),
        typeof __dirname === "string" ? path.resolve(__dirname, "../../sql/init.sql") : undefined,
    ].filter((value): value is string => Boolean(value));

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    throw new Error(`Could not find sql/init.sql. Checked: ${candidates.join(", ")}`);
}

async function connectWithRetry(): Promise<PoolClient> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= DB_READY_RETRY_ATTEMPTS; attempt++) {
        let client: PoolClient | undefined;

        try {
            client = await pool.connect();
            await client.query("SELECT 1");
            return client;
        } catch (error) {
            if (client) {
                client.release();
            }

            lastError = error;
            console.warn(`Database not ready (attempt ${attempt}/${DB_READY_RETRY_ATTEMPTS}). Retrying in ${DB_READY_RETRY_DELAY_MS}ms...`);
            await sleep(DB_READY_RETRY_DELAY_MS);
        }
    }

    throw lastError instanceof Error ? lastError : new Error("Database connection failed");
}

//migreaza baza de date
async function migrate() {
    let client: PoolClient | undefined;

    try{
        const filePath = resolveInitSqlPath();
        const sql = fs.readFileSync(filePath, "utf-8");

        client = await connectWithRetry();

        console.log("Acquiring migration lock...");
        await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_KEY]);

        console.log("Running database migration");
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");

        console.log("Migration completed successfully");
    } catch (error) {
        if (client) {
            try {
                await client.query("ROLLBACK");
            } catch {
                // ignore rollback errors if transaction was not started
            }
        }

        console.error("migration failed", error);
        process.exitCode = 1
    } finally {
        if (client) {
            try {
                await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_KEY]);
            } catch (error) {
                console.warn("failed to release migration lock", error);
            }

            client.release();
        }

        await pool.end();
    }
}

migrate().then();

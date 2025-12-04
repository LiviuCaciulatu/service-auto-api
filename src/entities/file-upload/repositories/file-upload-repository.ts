import {query} from "@/db";
import * as types from "@/entities/file-upload/types";

export async function createFileRecord(url: string): Promise<types.FileUploadRecord> {
    const result = await query<types.FileUploadRecord>(
        `
            insert into files (url)
            values ($1) returning *`,
        [url]
    )

    const record = result.rows[0];
    if (!record) throw new Error("Fail to create file record");
    return record;
}
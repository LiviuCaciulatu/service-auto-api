import {query} from "@/db";
import * as types from "@/entities/driver-license/types";

export async function getAllDriverLicenses(): Promise<Array<types.DriverLicense>> {
    const result = await query(`
        SELECT *
        FROM driver_licenses
        ORDER BY created_at DESC
    `);

    return result.rows;
}

export async function createDriverLicense(data: types.DriverLicenseCreateSchema): Promise<types.DriverLicense> {
    const result = await query(
        `
        INSERT INTO driver_licenses (client_id, first_name, last_name, date_of_birth, birth_place, issued_date, expiration_date, issued_by, license_number, vehicle_codes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `,
        [data.client_id,data.first_name,data.last_name,data.date_of_birth,data.birth_place,data.issued_date,data.expiration_date,data.issued_by,data.license_number, data.vehicle_codes]
    );

    return result.rows[0];
}

export async function getDriverLicenseById(id: string): Promise<types.DriverLicense>{
    const result = await query(
        `SELECT * FROM driver_licenses WHERE id = $1`,
            [id]
    );
    if(result.rowCount === 0) throw new Error("Driver License not found");
    return result.rows[0];
}

export async function updateDriverLicense(id: string, data: types.DriverLicenseUpdateSchema): Promise<types.DriverLicense> {
    const result = await query(
        `
        UPDATE driver_licenses
        SET 
            first_name = $1, 
            last_name = $2, 
            date_of_birth = $3, 
            birth_place = $4, 
            issued_date = $5, 
            expiration_date = $6, 
            issued_by = $7, 
            license_number = $8,
            vehicle_codes = $9
        WHERE id = $10
        RETURNING *;
        `,
        [data.first_name,data.last_name,data.date_of_birth,data.birth_place,data.issued_date,data.expiration_date,data.issued_by,data.license_number,data.vehicle_codes,id]
    );

    if (result.rowCount === 0) throw  new Error("Driver License not found");
    return result.rows[0];
}

export async function getDriverLicensesByClientId(id: string): Promise<Array<types.DriverLicense>> {
    const result = await query(
        `SELECT * FROM driver_licenses WHERE client_id = $1`,
        [id]
    );
    return result.rows;
}
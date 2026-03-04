import {query} from "@/db";
import * as types from "@/entities/contract-inlocuire-temporara/types";

export async function getAllContractInlocuireTemporara(): Promise<Array<types.ContractInlocuireTemporara>> {
    const result = await query(`
        SELECT *
        FROM contract_inlocuire_temporara
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function createContractInlocuireTemporara(data: types.ContractInlocuireTemporaraCreateSchema): Promise<types.ContractInlocuireTemporara> {
    const result = await query(
        `
        INSERT INTO contract_inlocuire_temporara(client_id, contract_number, contract_date, client_name, representing, cui, phone_number, email, address, damaged_vehicle_make, damaged_vehicle_registration_number, damaged_vehicle_year, damaged_vehicle_vin, damaged_vehicle_type, complaint_number, replacement_vehicle_make, replacement_vehicle_registration_number, replacement_vehicle_year, replacement_vehicle_delivery_date, replacement_vehicle_return_date, vehicle_returned_date, return_condition, price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *`,
        [data.client_id, data.contract_number, data.contract_date, data.client_name, data.representing, data.cui, data.phone_number, data.email, data.address, data.damaged_vehicle_make, data.damaged_vehicle_registration_number, data.damaged_vehicle_year, data.damaged_vehicle_vin, data.damaged_vehicle_type, data.complaint_number, data.replacement_vehicle_make, data.replacement_vehicle_registration_number, data.replacement_vehicle_year, data.replacement_vehicle_delivery_date, data.replacement_vehicle_return_date, data.vehicle_returned_date || null, data.return_condition || null, data.price]
    );

    return result.rows[0];
}

export async function getContractInlocuireTemporaraById(id: string): Promise<types.ContractInlocuireTemporara> {
    const result = await query(
        `SELECT * FROM contract_inlocuire_temporara WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}

export async function updateContractInlocuireTemporara(id: string, data: types.ContractInlocuireTemporaraUpdateSchema): Promise<types.ContractInlocuireTemporara> {
    const result = await query(
        `UPDATE contract_inlocuire_temporara 
            SET client_id = $2, contract_number = $3, contract_date = $4, client_name = $5, representing = $6, cui = $7, phone_number = $8, email = $9, address = $10, damaged_vehicle_make = $11, damaged_vehicle_registration_number = $12, damaged_vehicle_year = $13, damaged_vehicle_vin = $14, damaged_vehicle_type = $15, complaint_number = $16, replacement_vehicle_make = $17, replacement_vehicle_registration_number = $18, replacement_vehicle_year = $19, replacement_vehicle_delivery_date = $20, replacement_vehicle_return_date = $21, vehicle_returned_date = $22, return_condition = $23, price = $24
        WHERE id = $1 RETURNING *`,
            [id, data.client_id, data.contract_number, data.contract_date, data.client_name, data.representing, data.cui, data.phone_number, data.email, data.address, data.damaged_vehicle_make, data.damaged_vehicle_registration_number, data.damaged_vehicle_year, data.damaged_vehicle_vin, data.damaged_vehicle_type, data.complaint_number, data.replacement_vehicle_make, data.replacement_vehicle_registration_number, data.replacement_vehicle_year, data.replacement_vehicle_delivery_date, data.replacement_vehicle_return_date, data.vehicle_returned_date || null, data.return_condition || null, data.price]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}

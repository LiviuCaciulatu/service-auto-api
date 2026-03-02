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
        INSERT INTO contract_inlocuire_temporara(client_id, contract_number, contract_date, client_name, representing, cui, phone_number, address, damaged_vehicle_make, damaged_vehicle_registration_number, damaged_vehicle_year,damaged_vehicle_vin, damaged_vehicle_type, complaint_number, replacement_vehicle_make, replacement_vehicle_registration_number, replacement_vehicle_year, replacement_vehicle_delivery_date, replacement_vehicle_return_date, price)
        RETURNING *`,
        [data.client_id, data.contract_number, data.contract_date, data.client_name, data.representing, data.cui, data.phone_number, data.address, data.damaged_vehicle_make, data.damaged_vehicle_registration_number, data.damaged_vehicle_year, data.damaged_vehicle_vin, data.damaged_vehicle_type, data.complaint_number, data.replacement_vehicle_make, data.replacement_vehicle_registration_number, data.replacement_vehicle_year, data.replacement_vehicle_delivery_date, data.replacement_vehicle_return_date, data.price]
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
            SET client_id = $2, contract_number = $3, contract_date = $4, client_name = $5, representing = $6, cui = $7, phone_number = $8, address = $9, damaged_vehicle_make = $10, damaged_vehicle_registration_number = $11, damaged_vehicle_year = $12, damaged_vehicle_vin = $13, damaged_vehicle_type = $14, complaint_number = $15, replacement_vehicle_make = $16, replacement_vehicle_registration_number = $17, replacement_vehicle_year = $18, replacement_vehicle_delivery_date = $19, replacement_vehicle_return_date = $20, price = $21
        WHERE id = $1 RETURNING *`,
            [id, data.client_id, data.contract_number, data.contract_date, data.client_name, data.representing, data.cui, data.phone_number, data.address, data.damaged_vehicle_make, data.damaged_vehicle_registration_number, data.damaged_vehicle_year, data.damaged_vehicle_vin, data.damaged_vehicle_type, data.complaint_number, data.replacement_vehicle_make, data.replacement_vehicle_registration_number, data.replacement_vehicle_year, data.replacement_vehicle_delivery_date, data.replacement_vehicle_return_date, data.price]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}
import {query} from '@/db';
import * as types from '@/entities/contract-cesiune-creanta/types';

export async function getAllContractCesiuneCreanta(): Promise<Array<types.ContractCesiuneCreanta>>{
    const result = await query(
        `SELECT * FROM contracte_cesiune_creanta ORDER BY created_at DESC`
    );
    return result.rows;
}

export async function createContractCesiuneCreanta(data: types.CesiuneCreantaCreateSchema): Promise<types.ContractCesiuneCreanta>{
    const result = await query(
        `
        INSERT INTO contracte_cesiune_creanta (client_id,  claim_number, claim_date, claimant_name, address, cnp, value, insurance_company, insurance_company_address, insurance_company_cui, insurance_company_j, complaint_number, vehicle_registration_number, invoice_number, invoice_value, cedent, cesionar, administrator) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [data.client_id, data.claim_number, data.claim_date, data.claimant_name, data.address, data.cnp, data.value, data.insurance_company, data.insurance_company_address, data.insurance_company_cui, data.insurance_company_j, data.complaint_number, data.vehicle_registration_number, data.invoice_number, data.invoice_value, data.cedent, data.cesionar, data.administrator]
    );

    return result.rows[0];
}

export async function getContractCesiuneCreantaById(id: string): Promise<types.ContractCesiuneCreanta>{
    const result = await query(
        `SELECT * FROM contracte_cesiune_creanta WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}

export async function updateContractCesiuneCreanta(id: string, data: types.CesiuneCreantaUpdateSchema): Promise<types.ContractCesiuneCreanta>{
    const result = await query(
        `UPDATE contracte_cesiune_creanta 
            SET client_id = $2, claim_number = $3, claim_date = $4, claimant_name = $5, address = $6, cnp = $7, value = $8, insurance_company = $9, insurance_company_address = $10, insurance_company_cui = $11, insurance_company_j = $12, complaint_number = $13, vehicle_registration_number = $14, invoice_number = $15, invoice_value = $16, cedent = $17, cesionar = $18, administrator = $19
            WHERE id = $1 RETURNING *`,
        [id, data.client_id, data.claim_number, data.claim_date, data.claimant_name, data.address, data.cnp, data.value, data.insurance_company, data.insurance_company_address, data.insurance_company_cui, data.insurance_company_j, data.complaint_number, data.vehicle_registration_number, data.invoice_number, data.invoice_value, data.cedent, data.cesionar, data.administrator]
    );

    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}
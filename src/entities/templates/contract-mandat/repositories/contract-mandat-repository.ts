import {query} from "@/db";
import * as types from "@/entities/templates/contract-mandat/types";

export async function getAllContractMandat(): Promise<Array<types.ContractMandat>> {
    const result = await query(`
    SELECT * FROM contract_mandat
    ORDER BY created_at DESC`);
    return result.rows;
}

export async function getContractMandatById(id: string): Promise<types.ContractMandat> {
    const result = await query(
        `SELECT * FROM contract_mandat WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createContractMandat(data: types.ContractMandatCreateSchema): Promise<types.ContractMandat> {
    const result = await query(`
    INSERT INTO contract_mandat (client_id,
                                 principal_name,
                                 principal_address,
                                 principal_cnp,
                                 principal_id_series,
                                 principal_id_number,
                                 agent_name,
                                 agent_address,
                                 agent_cnp,
                                 agent_id_series,
                                 agent_id_number,
                                 agent_id_issued_by,
                                 vehicle_make,
                                 vehicle_model,
                                 vehicle_registration_number,
                                 vehicle_vin,
                                 incident_date,
                                 contract_date,
                                 pricipal_signature,
                                 agent_signature,
                                 created_at)
                                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
                                RETURNING *`,
        [
            data.client_id,
            data.principal_name,
            data.principal_address,
            data.principal_cnp,
            data.principal_id_series,
            data.principal_id_number,
            data.agent_name,
            data.agent_address,
            data.agent_cnp,
            data.agent_id_series,
            data.agent_id_number,
            data.agent_id_issued_by,
            data.vehicle_make,
            data.vehicle_model,
            data.vehicle_registration_number,
            data.vehicle_vin,
            data.incident_date,
            data.contract_date,
            data.pricipal_signature,
            data.agent_signature,
            data.created_at
        ]);
    return result.rows[0];
}

export async function updateContractMandat(id: string, data: types.ContractMandatUpdateSchema): Promise<types.ContractMandat> {
    const result = await query(
        `UPDATE contract_mandat
      SET client_id = $2,
          principal_name = $3,
          principal_address = $4,
          principal_cnp = $5,
          principal_id_series = $6,
          principal_id_number = $7,
          agent_name = $8,
          agent_address = $9,
          agent_cnp = $10,
          agent_id_series = $11,
          agent_id_number = $12,
          agent_id_issued_by = $13,
          vehicle_make = $14,
          vehicle_model = $15,
          vehicle_registration_number = $16,
          vehicle_vin = $17,
          incident_date = $18,
          contract_date = $19,
          pricipal_signature = $20,
          agent_signature = $21,
          created_at = $22
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.principal_name,
            data.principal_address,
            data.principal_cnp,
            data.principal_id_series,
            data.principal_id_number,
            data.agent_name,
            data.agent_address,
            data.agent_cnp,
            data.agent_id_series,
            data.agent_id_number,
            data.agent_id_issued_by,
            data.vehicle_make,
            data.vehicle_model,
            data.vehicle_registration_number,
            data.vehicle_vin,
            data.incident_date,
            data.contract_date,
            data.pricipal_signature,
            data.agent_signature,
            data.created_at
        ]
    );

    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}


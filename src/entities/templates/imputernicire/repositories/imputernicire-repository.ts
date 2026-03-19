import {query} from "@/db";
import * as types from "@/entities/templates/imputernicire/types";

export async function getAllImputernicire(): Promise<Array<types.Imputernicire>> {
    const result = await query(`
        SELECT *
        FROM imputernicire
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function getImputernicireById(id: string): Promise<types.Imputernicire> {
    const result = await query(
        `SELECT * FROM imputernicire WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}

export async function createImputernicire(data: types.ImputernicireCreateSchema): Promise<types.Imputernicire> {
    const result = await query(`
        INSERT INTO imputernicire(
            client_id,
            authorization_number,
            authorization_date,
            company_name,
            company_registered_address,
            company_trage_register_number,
            company_cui,
            company_representative_name,
            company_representative_role,
            agent_name,
            agent_address,
            agent_cnp,
            agent_id_series,
            agent_id_number,
            agent_id_issued_by,
            incident_date,
            vehicle_make,
            vehicle_model,
            vehicle_vin,
            vehicle_registration_number,
            principal_signature
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9
                  $10,$11,$12,$13,$14,$15,$16,
                  $17,$18,$19,$20,$21,$22,$23) 
        RETURNING *`,
        [
                data.client_id,
                data.authorization_number,
                data.authorization_date,
                data.company_name,
                data.company_registered_address,
                data.company_trage_register_number,
                data.company_cui,
                data.company_representative_name,
                data.company_representative_role,
                data.agent_name,
                data.agent_address,
                data.agent_cnp,
                data.agent_id_series,
                data.agent_id_number,
                data.agent_id_issued_by,
                data.incident_date,
                data.vehicle_make,
                data.vehicle_model,
                data.vehicle_vin,
                data.vehicle_registration_number,
                data.principal_signature
        ]
    );

    return result.rows[0];
}

export async function updateImputernicire(id: string, data: types.ImputernicireUpdateSchema): Promise<types.Imputernicire> {
    const result = await query(
        `UPDATE imputernicire
        SET client_id = 2$,
            authorization_number = 3$,
            authorization_date = 4$,
            company_name = 5$,
            company_registered_address = 6$,
            company_trage_register_number = 7$,
            company_cui = 8$,
            company_representative_name = 9$,
            company_representative_role = 10$,
            agent_name = 11$,
            agent_address = 12$,
            agent_cnp = 13$,
            agent_id_series = 14$,
            agent_id_number = 15$,
            agent_id_issued_by = 16$,
            incident_date = 17$,
            vehicle_make = 18$,
            vehicle_model = 19$,
            vehicle_vin = 20$,
            vehicle_registration_number = 21$,
            principal_signature = 22$
        WHERE id = $1
        RETURNING *`,
        [
            id,
            data.client_id,
            data.authorization_number,
            data.authorization_date,
            data.company_name,
            data.company_registered_address,
            data.company_trage_register_number,
            data.company_cui,
            data.company_representative_name,
            data.company_representative_role,
            data.agent_name,
            data.agent_address,
            data.agent_cnp,
            data.agent_id_series,
            data.agent_id_number,
            data.agent_id_issued_by,
            data.incident_date,
            data.vehicle_make,
            data.vehicle_model,
            data.vehicle_vin,
            data.vehicle_registration_number,
            data.principal_signature
        ]
    );

    if(result.rowCount === 0) throw new Error("Contract cesiune creanta not found");
    return result.rows[0];
}
import {query} from "@/db";
import * as types from "@/entities/contract-reparatii-auto/types";

export async function getAllContractReparatiiAuto(): Promise<Array<types.ContractReparatiiAuto>> {
    const result = await query(`
        SELECT *
        FROM contract_reparatii_auto
        ORDER BY created_at DESC
    `);
    return result.rows;
}

export async function createContractReparatiiAuto(data: types.ContractReparatiiAutoCreateSchema): Promise<types.ContractReparatiiAuto> {
    const result = await query(
        `
        INSERT INTO contract_reparatii_auto(client_id, contract_number, contract_date, client_name, client_address, client_phone, vehicle_make_model, vehicle_registration_number, vehicle_vin, client_requested_works, reinspections, execution_period, driver_belts, brake_lines, cooling_pipes, fuel_leaks, brake_pads, headlights, engine, gearbox, brake_fluid, washer_fluid, brake_test, exhaust_emissions, wheel_alignment, ac, central_locking, battery_charging, test_drive, rust, looseness, paint_color, paint_gloss)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
        RETURNING *`,
        [data.client_id, data.contract_number, data.contract_date, data.client_name, data.client_address, data.client_phone, data.vehicle_make_model, data.vehicle_registration_number, data.vehicle_vin, data.client_requested_works, data.reinspections, data.execution_period, data.driver_belts, data.brake_lines, data.cooling_pipes, data.fuel_leaks, data.brake_pads, data.headlights, data.engine, data.gearbox, data.brake_fluid, data.washer_fluid, data.brake_test, data.exhaust_emissions, data.wheel_alignment, data.ac, data.central_locking, data.battery_charging, data.test_drive, data.rust, data.looseness, data.paint_color, data.paint_gloss]
    );

    return result.rows[0];
}

export async function getContractReparatiiAutoById(id: string): Promise<types.ContractReparatiiAuto> {
    const result = await query(
        `SELECT * FROM contract_reparatii_auto WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}

export async function updateContractReparatiiAuto(id: string, data: types.ContractReparatiiAutoUpdateSchema): Promise<types.ContractReparatiiAuto> {
    const result = await query(
        `UPDATE contract_reparatii_auto
            SET client_id = $2, contract_number = $3, contract_date = $4, client_name = $5, client_address = $6, client_phone = $7, vehicle_make_model = $8, vehicle_registration_number = $9, vehicle_vin = $10, client_requested_works = $11, reinspections = $12, execution_period = $13, driver_belts = $14, brake_lines = $15, cooling_pipes = $16, fuel_leaks = $17, brake_pads = $18, headlights = $19, engine = $20, gearbox = $21, brake_fluid = $22, washer_fluid = $23, brake_test = $24, exhaust_emissions = $25, wheel_alignment = $26, ac = $27, central_locking = $28, battery_charging = $29, test_drive = $30, rust = $31, looseness = $32, paint_color = $33, paint_gloss = $34
        WHERE id = $1 RETURNING *`,
        [id, data.client_id, data.contract_number, data.contract_date, data.client_name, data.client_address, data.client_phone, data.vehicle_make_model, data.vehicle_registration_number, data.vehicle_vin, data.client_requested_works, data.reinspections, data.execution_period, data.driver_belts, data.brake_lines, data.cooling_pipes, data.fuel_leaks, data.brake_pads, data.headlights, data.engine, data.gearbox, data.brake_fluid, data.washer_fluid, data.brake_test, data.exhaust_emissions, data.wheel_alignment, data.ac, data.central_locking, data.battery_charging, data.test_drive, data.rust, data.looseness, data.paint_color, data.paint_gloss]
    );
    if(result.rowCount === 0) throw new Error("Contract not found");
    return result.rows[0];
}

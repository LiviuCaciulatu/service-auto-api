import {query} from "@/db";
import * as types from "@/entities/car-document/types";

// cheama get all car documents din baza de date
export async function getAllCarDocuments(): Promise<Array<types.CarDocument>> {
    const result = await query(`
        SELECT *
        FROM car_documents
        ORDER BY created_at DESC
    `);

    return result.rows;
}

// cheama create car document din baza de date
export async function createCarDocument(data: types.CarDocumentCreateSchema): Promise<types.CarDocument> {
    const result = await query(
        `
        INSERT INTO car_documents (property_A, property_J, property_D_1, property_D_2, property_D_3, property_E, property_K, property_C_2_1, property_C_2_2, property_C_2_3, property_C_3_1, property_C_3_2, property_C_3_3, property_B, property_H, property_I, property_I_1, property_F_1, property_G, property_P_1, property_P_2, property_P_3, property_Q, property_R, property_S_1, property_S_2, property_V_7, property_V_10, property_Y, property_Z, observatii, numar_certificat, property_C_2_equals_C_1, property_C_3_equals_C_1)
        VALUES ($1,  $2,  $3,  $4,  $5, $6,  $7,  $8,  $9,  $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)
        RETURNING *
        `,
        [data.property_A,data.property_J, data.property_D_1, data.property_D_2, data.property_D_3, data.property_E, data.property_K, data.property_C_2_1, data.property_C_2_2, data.property_C_2_3, data.property_C_3_1, data.property_C_3_2, data.property_C_3_3, data.property_B, data.property_H, data.property_I, data.property_I_1, data.property_F_1, data.property_G, data.property_P_1, data.property_P_2, data.property_P_3, data.property_Q, data.property_R, data.property_S_1, data.property_S_2, data.property_V_7, data.property_V_10, data.property_Y, data.property_Z, data.observatii, data.numar_certificat, data.property_C_2_equals_C_1, data.property_C_3_equals_C_1]
    );

    return result.rows[0];
}
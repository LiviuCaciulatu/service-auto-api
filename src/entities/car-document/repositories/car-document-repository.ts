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
        INSERT INTO car_documents (property_a, property_j, property_d_1, property_d_2, property_d_3, property_e, property_k, property_c_2_1, property_c_2_2, 
                                   property_c_2_3, property_c_3_1, property_c_3_2, property_c_3_3, property_b, property_h, property_i, property_i_1, property_f_1, 
                                   property_g, property_p_1, property_p_2, property_p_3, property_q, property_r, property_s_1, property_s_2, property_v_7, property_v_10, 
                                   property_y, property_z, observatii, numar_certificat, property_c_2_equals_c_1, property_c_3_equals_c_1, client_id, contact_first_name,
                                   contact_last_name, contact_email, contact_phone, expiration_date)
        VALUES ($1,  $2,  $3,  $4,  $5, $6,  $7,  $8,  $9,  $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 
                $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40)
        RETURNING *
        `,
        [data.property_a,data.property_j, data.property_d_1, data.property_d_2, data.property_d_3, data.property_e,
            data.property_k, data.property_c_2_1, data.property_c_2_2, data.property_c_2_3, data.property_c_3_1, data.property_c_3_2,
            data.property_c_3_3, data.property_b, data.property_h, data.property_i, data.property_i_1, data.property_f_1, data.property_g,
            data.property_p_1, data.property_p_2, data.property_p_3, data.property_q, data.property_r, data.property_s_1, data.property_s_2,
            data.property_v_7, data.property_v_10, data.property_y, data.property_z, data.observatii, data.numar_certificat, data.property_c_2_equals_c_1,
            data.property_c_3_equals_c_1, data.client_id, data.contact_first_name, data.contact_last_name, data.contact_email, data.contact_phone,
            data.expiration_date]
    );

    return result.rows[0];
}

export async function getCarDocumentById(id: string): Promise<types.CarDocument> {
    const result = await query(
        `SELECT * FROM car_documents WHERE id = $1`,
        [id]
    );
    if(result.rowCount === 0) throw new Error("Car document not found");
    return result.rows[0];
}

export async function updateCarDocument(id: string, data: types.CarDocumentUpdateSchema): Promise<types.CarDocument> {
    const result = await query(
        `
        UPDATE car_documents
        SET
            property_a = $2,
            property_j = $3,
            property_d_1 = $4,
            property_d_2 = $5,
            property_d_3 = $6,
            property_e = $7,
            property_k = $8,
            property_c_2_1 = $9,
            property_c_2_2 = $10,
            property_c_2_3 = $11,
            property_c_3_1 = $12,
            property_c_3_2 = $13,
            property_c_3_3 = $14,
            property_b = $15,
            property_h = $16,
            property_i = $17,
            property_i_1 = $18,
            property_f_1 = $19,
            property_g = $20,
            property_p_1 = $21,
            property_p_2 = $22,
            property_p_3 = $23,
            property_q = $24,
            property_r = $25,
            property_s_1 = $26,
            property_s_2 = $27,
            property_v_7 = $28,
            property_v_10 = $29,
            property_y = $30,
            property_z = $31,
            observatii = $32,
            numar_certificat = $33,
            property_c_2_equals_c_1 = $34,
            property_c_3_equals_c_1 = $35,
            contact_first_name = $36,
            contact_last_name = $37,
            contact_email = $38,
            contact_phone = $39,
            expiration_date = $40
        WHERE id = $1
            RETURNING *;
        `,
        [
            id,         // $1
            data.property_a,
            data.property_j,
            data.property_d_1,
            data.property_d_2,
            data.property_d_3,
            data.property_e,
            data.property_k,
            data.property_c_2_1,
            data.property_c_2_2,
            data.property_c_2_3,
            data.property_c_3_1,
            data.property_c_3_2,
            data.property_c_3_3,
            data.property_b,
            data.property_h,
            data.property_i,
            data.property_i_1,
            data.property_f_1,
            data.property_g,
            data.property_p_1,
            data.property_p_2,
            data.property_p_3,
            data.property_q,
            data.property_r,
            data.property_s_1,
            data.property_s_2,
            data.property_v_7,
            data.property_v_10,
            data.property_y,
            data.property_z,
            data.observatii,
            data.numar_certificat,
            data.property_c_2_equals_c_1,
            data.property_c_3_equals_c_1,
            data.contact_first_name,
            data.contact_last_name,
            data.contact_email,
            data.contact_phone,
            data.expiration_date
        ]
    );

    if (result.rowCount === 0) throw new Error("Car document not found");
    return result.rows[0];
}

export async function getCarDocumentsByClientId(id: string): Promise<Array<types.CarDocument>> {
    const result = await query(
        `SELECT * FROM car_documents WHERE client_id = $1`,
        [id]
    );
    return result.rows;
}
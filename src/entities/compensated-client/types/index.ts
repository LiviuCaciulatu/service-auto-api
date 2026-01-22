import {z} from 'zod';
import * as schemas from '@/entities/compensated-client/schemas/compensated-client-schema';

export type CompensatedClientCreateSchema = z.infer<typeof schemas.compensatedClientCreateSchema>;
export type CompensatedClientUpdateSchema = z.infer<typeof schemas.compensatedClientUpdateSchema>;

export type CompensatedClient = {
    claim_id: string;
    amount: string;
    bank: string;
    iban: string;
    account_holder: string;
}
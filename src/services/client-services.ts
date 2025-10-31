import { z } from "zod";
import * as clientRepository from "../repositories/client-repository";

const clientSchema = z.object({
    first_name: z.string().min(2, "at least 2 characters"),
    last_name: z.string().min(2, "at least 2 charasters"),
    });

type ClientInput = z.infer<typeof clientSchema>;

export async function getAllClients(){
    return await clientRepository.getAllClients();
}

export async function createClient(data: clientInput) {
try{
    const parsed = clientSchema.parse(data);

    const newClient = await clientRepository.createClient(parsed);

    return newClient;
} catch (err) {
    if (err instanceoff z.ZodError){
    const message = err.errors.map(e=>e.message).join(", ");
    const validationError = new Error(`Validation failed: ${message}`);
    (validationError as any).status = 400;
    throw validationError;
    }

    throw err;
}
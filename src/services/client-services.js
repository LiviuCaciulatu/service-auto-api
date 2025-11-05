import { z } from "zod";
import * as clientRepository from "../repositories/client-repositories";
const clientSchema = z.object({
    first_name: z.string().min(2, "at least 2 characters"),
    last_name: z.string().min(2, "at least 2 characters"),
});
export async function getAllClients() {
    return await clientRepository.getAllClients();
}
export async function createClient(data) {
    try {
        const parsed = clientSchema.parse(data);
        const newClient = await clientRepository.createClient(parsed);
        return newClient;
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            const message = err.issues.map(e => e.message).join(", ");
            const validationError = new Error(`Validation failed: ${message}`);
            validationError.status = 400;
            throw validationError;
        }
        throw err;
    }
}
//# sourceMappingURL=client-services.js.map
import { z } from "zod";
import * as clientRepository from "@/repositories/client-repositories";

const clientSchema = z.object({
  first_name: z.string().min(2, "at least 2 characters").max(50),
  last_name: z.string().min(2, "at least 2 characters").max(50),

  country: z.string().min(1),
  serie: z.string().min(1),
  number: z.string().min(1),
  nationality: z.string().min(1),
  cnp: z.string().min(1),
  birth_place: z.string().min(1),
  address: z.string().min(1),
  issued_by: z.string().min(1),
  validity: z.string().min(1)
});

export const clientInputSchema = clientSchema;
export type ClientInput = z.infer<typeof clientInputSchema>;

export async function getAllClients() {
  return await clientRepository.getAllClients();
}

export async function createClient(data: ClientInput) {
  try {
    const parsed = clientInputSchema.parse(data);

    const client = await clientRepository.createClient(parsed);

    return client;

  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      err.issues.forEach(issue => {
        if (issue.path && issue.path[0]) {
          const key = issue.path[0] as string;
          errors[key] = issue.message;
        }
      });

      const validationError = new Error("Validation failed");
      (validationError as any).status = 400;
      (validationError as any).errors = errors;
      throw validationError;
    }

    throw err;
  }
}
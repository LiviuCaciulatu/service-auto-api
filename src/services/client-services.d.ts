import { z } from "zod";
declare const clientSchema: z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodString;
}, z.core.$strip>;
export type ClientInput = z.infer<typeof clientSchema>;
export declare function getAllClients(): Promise<any[]>;
export declare function createClient(data: ClientInput): Promise<any>;
export {};
//# sourceMappingURL=client-services.d.ts.map
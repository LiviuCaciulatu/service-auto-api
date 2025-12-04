import type {Request, Response} from "express";
import {Router} from "express"
import {asyncHandler} from "@/shared/async-handler";
import * as clientServices from "@/entities/client/services/client-service";
import * as types from "@/entities/client/types";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
        const clients: Array<types.Client> = await clientServices.getAllClients;
        res.json(clients);
    })
);

router.post('/', async (req: Request, res: Response) => {
    const newClient: types.Client = await clientServices.createClient(req.body);
    res.status(201).json(newClient);
})

export default router;
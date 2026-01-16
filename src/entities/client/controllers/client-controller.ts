import type {Request, Response} from "express";
import {Router} from "express"
import {asyncHandler} from "@/shared/async-handler";
import * as clientServices from "@/entities/client/services/client-service";
import * as types from "@/entities/client/types";

const router = Router();

// cheama get all clients din client-service
router.get("/", asyncHandler(async (req: Request, res: Response) => {
        const clients: Array<types.Client> = await clientServices.getAllClients();
        res.json(clients);
    })
);

// cere client-service crearea unui client
router.post('/', async (req: Request, res: Response) => {
    const newClient: types.Client = await clientServices.createClient(req.body);
    res.status(201).json(newClient);
});

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateClient: types.Client = await clientServices.updateClient(id, req.body);
    res.status(200).json(updateClient);
});

//TODO trebuie sa implementez metoda pentru get by id

export default router;
import type {Request, Response} from "express";

import {Router} from "express"
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/client/types";
import * as clientServices from "@/entities/client/services/client-service";

const router: import("express").Router = Router();

// cheama get all clients din client-service
router.get("/", asyncHandler(async (_req: Request, res: Response) => {
        const clients: Array<types.Client> = await clientServices.getAllClients();
        res.json(clients);
    })
);

// cere client-service crearea unui client
router.post('/', async (req: Request, res: Response) => {
    const newClient: types.Client = await clientServices.createClient(req.body);
    res.status(201).json(newClient);
});

router.get("/from-file", async (req: Request, res: Response) =>{
    const {url} = req.query;

    if(!url || typeof url !== "string"){
        return res.status(400).json({message: "Url is required"});
    }

    const client = await clientServices.getClientByUrl(url);
    res.status(200).json(client);
})

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateClient: types.Client = await clientServices.updateClient(id, req.body);
    res.status(200).json(updateClient);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const client = await clientServices.getClientById(id);
        if (!client) {
            return res.status(404).json({message: "Client not found"});
        }

        res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client: ", error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.get("/:id/compensation-claims", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const result = await clientServices.getClientCompensationsClaims(id);
    res.status(200).json(result);
})

router.get("/:id/car-documents", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const result = await clientServices.getCarDocumentsByClientId(id);
    res.status(200).json(result);
})

router.get("/:id/driver-license", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id){
        return res.status(400).json({message: "Id is required"});
    }
    const result = await clientServices.getClientDriverLicensesByClientId(id)
    res.status(200).json(result);
})



export default router;

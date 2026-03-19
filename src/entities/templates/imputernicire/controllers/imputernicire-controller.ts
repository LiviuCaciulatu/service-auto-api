import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/imputernicire/types";
import * as imputernicireServices from "@/entities/templates/imputernicire/services/imputernicire-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const imputernicire: Array<types.Imputernicire> = await imputernicireServices.getAllImputernicire();
        res.json(imputernicire);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newImputernicire: types.Imputernicire = await imputernicireServices.createImputernicire(req.body);
        res.status(201).json(newImputernicire);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateImputernicire: types.Imputernicire = await imputernicireServices.updateImputernicire(id, req.body);
    res.status(200).json(UpdateImputernicire);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const imputernicire = await imputernicireServices.getImputernicireById(id);
        if(!imputernicire) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(imputernicire);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
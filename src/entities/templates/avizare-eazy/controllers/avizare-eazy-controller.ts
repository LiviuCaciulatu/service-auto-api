import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-eazy/types";
import * as avizareEazyServices from "@/entities/templates/avizare-eazy/services/avizare-eazy-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareEazy: Array<types.AvizareEazy> = await avizareEazyServices.getAllAvizareEazy();
        res.json(avizareEazy);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareEazy: types.AvizareEazy = await avizareEazyServices.createAvizareEazy(req.body);
        res.status(201).json(newAvizareEazy);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareEazy: types.AvizareEazy = await avizareEazyServices.updateAvizareEazy(id, req.body);
    res.status(200).json(UpdateAvizareEazy);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareEazy = await avizareEazyServices.getAvizareEazyById(id);
        if(!avizareEazy) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareEazy);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
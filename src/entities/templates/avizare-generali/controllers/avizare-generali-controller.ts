import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-generali/types";
import * as avizareGeneraliServices from "@/entities/templates/avizare-generali/services/avizare-generali-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareGenerali: Array<types.AvizareGenerali> = await avizareGeneraliServices.getAllAvizareGenerali();
        res.json(avizareGenerali);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareGenerali: types.AvizareGenerali = await avizareGeneraliServices.createAvizareGenerali(req.body);
        res.status(201).json(newAvizareGenerali);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareGenerali: types.AvizareGenerali = await avizareGeneraliServices.updateAvizareGenerali(id, req.body);
    res.status(200).json(UpdateAvizareGenerali);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareGenerali = await avizareGeneraliServices.getAvizareGeneraliById(id);
        if(!avizareGenerali) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareGenerali);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
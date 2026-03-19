import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-asirom/types";
import * as avizareAsiromServices from "@/entities/templates/avizare-asirom/services/avizare-asirom-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareAsirom: Array<types.AvizareAsirom> = await avizareAsiromServices.getAllAvizareAsirom();
        res.json(avizareAsirom);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareAsirom: types.AvizareAsirom = await avizareAsiromServices.createAvizareAsirom(req.body);
        res.status(201).json(newAvizareAsirom);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareAsirom: types.AvizareAsirom = await avizareAsiromServices.updateAvizareAsirom(id, req.body);
    res.status(200).json(UpdateAvizareAsirom);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareAsirom = await avizareAsiromServices.getAvizareAsiromById(id);
        if(!avizareAsirom) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareAsirom);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
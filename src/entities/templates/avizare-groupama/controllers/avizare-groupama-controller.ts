import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-groupama/types";
import * as avizareGroupamaServices from "@/entities/templates/avizare-groupama/services/avizare-groupama-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareGroupama: Array<types.AvizareGroupama> = await avizareGroupamaServices.getAllAvizareGroupama();
        res.json(avizareGroupama);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareGroupama: types.AvizareGroupama = await avizareGroupamaServices.createAvizareGroupama(req.body);
        res.status(201).json(newAvizareGroupama);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareGroupama: types.AvizareGroupama = await avizareGroupamaServices.updateAvizareGroupama(id, req.body);
    res.status(200).json(UpdateAvizareGroupama);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareGroupama = await avizareGroupamaServices.getAvizareGroupamaById(id);
        if(!avizareGroupama) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareGroupama);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
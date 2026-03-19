import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-axeria/types";
import * as avizareAxeriaServices from "@/entities/templates/avizare-axeria/services/avizare-axeria-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareAxeria: Array<types.AvizareAxeria> = await avizareAxeriaServices.getAllAvizareAxeria();
        res.json(avizareAxeria);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareAxeria: types.AvizareAxeria = await avizareAxeriaServices.createAvizareAxeria(req.body);
        res.status(201).json(newAvizareAxeria);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareAxeria: types.AvizareAxeria = await avizareAxeriaServices.updateAvizareAxeria(id, req.body);
    res.status(200).json(UpdateAvizareAxeria);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareAxeria = await avizareAxeriaServices.getAvizareAxeriaById(id);
        if(!avizareAxeria) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareAxeria);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
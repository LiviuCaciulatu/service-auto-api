import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-omniasig/types";
import * as avizareOmniasigServices from "@/entities/templates/avizare-omniasig/services/avizare-omniasig-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareOmniasig: Array<types.AvizareOmniasig> = await avizareOmniasigServices.getAllAvizareOmniasig();
        res.json(avizareOmniasig);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareOmniasig: types.AvizareOmniasig = await avizareOmniasigServices.createAvizareOmniasig(req.body);
        res.status(201).json(newAvizareOmniasig);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareOmniasig: types.AvizareOmniasig = await avizareOmniasigServices.updateAvizareOmniasig(id, req.body);
    res.status(200).json(UpdateAvizareOmniasig);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareOmniasig = await avizareOmniasigServices.getAvizareOmniasigById(id);
        if(!avizareOmniasig) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareOmniasig);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
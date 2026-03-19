import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-hellas-direct/types";
import * as avizareHellasDirectServices from "@/entities/templates/avizare-hellas-direct/services/avizare-hellas-direct-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareHellasDirect: Array<types.AvizareHellasDirect> = await avizareHellasDirectServices.getAllAvizareHellasDirect();
        res.json(avizareHellasDirect);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareHellasDirect: types.AvizareHellasDirect = await avizareHellasDirectServices.createAvizareHellasDirect(req.body);
        res.status(201).json(newAvizareHellasDirect);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareHellasDirect: types.AvizareHellasDirect = await avizareHellasDirectServices.updateAvizareHellasDirect(id, req.body);
    res.status(200).json(UpdateAvizareHellasDirect);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareHellasDirect = await avizareHellasDirectServices.getAvizareHellasDirectById(id);
        if(!avizareHellasDirect) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareHellasDirect);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
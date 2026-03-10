import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-allianz-tiriac/types";
import * as avizareAllianzTiriacServices from "@/entities/templates/avizare-allianz-tiriac/services/avizare-allianz-tiriac-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareAllianzTiriac: Array<types.AvizareAllianzTiriac> = await avizareAllianzTiriacServices.getAllAvizareAllianzTiriac();
        res.json(avizareAllianzTiriac);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareAllianzTiriac: types.AvizareAllianzTiriac = await avizareAllianzTiriacServices.createAvizareAllianzTiriac(req.body);
        res.status(201).json(newAvizareAllianzTiriac);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareAllianzTiriac: types.AvizareAllianzTiriac = await avizareAllianzTiriacServices.updateAvizareAllianzTiriac(id, req.body);
    res.status(200).json(UpdateAvizareAllianzTiriac);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareAllianzTiriac = await avizareAllianzTiriacServices.getAvizareAllianzTiriacById(id);
        if(!avizareAllianzTiriac) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareAllianzTiriac);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-grawe/types";
import * as avizareGraweServices from "@/entities/templates/avizare-grawe/services/avizare-grawe-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareGrawe: Array<types.AvizareGrawe> = await avizareGraweServices.getAllAvizareGrawe();
        res.json(avizareGrawe);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareGrawe: types.AvizareGrawe = await avizareGraweServices.createAvizareGrawe(req.body);
        res.status(201).json(newAvizareGrawe);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareGrawe: types.AvizareGrawe = await avizareGraweServices.updateAvizareGrawe(id, req.body);
    res.status(200).json(UpdateAvizareGrawe);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareGrawe = await avizareGraweServices.getAvizareGraweById(id);
        if(!avizareGrawe) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareGrawe);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
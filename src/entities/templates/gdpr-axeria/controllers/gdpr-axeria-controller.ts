import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-axeria/types";
import * as gdprAxeriaServices from "@/entities/templates/gdpr-axeria/services/gdpr-axeria-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprAxeria: Array<types.GdprAxeria> = await gdprAxeriaServices.getAllGdprAxeria();
        res.json(gdprAxeria);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprAxeria: types.GdprAxeria = await gdprAxeriaServices.createGdprAxeria(req.body);
        res.status(201).json(newGdprAxeria);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprAxeria: types.GdprAxeria = await gdprAxeriaServices.updateGdprAxeria(id, req.body);
    res.status(200).json(UpdateGdprAxeria);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprAxeria = await gdprAxeriaServices.getGdprAxeriaById(id);
        if(!gdprAxeria) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprAxeria);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
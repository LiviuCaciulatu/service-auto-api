import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-asirom/types";
import * as gdprAsiromServices from "@/entities/templates/gdpr-asirom/services/gdpr-asirom-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprAsirom: Array<types.GdprAsirom> = await gdprAsiromServices.getAllGdprAsirom();
        res.json(gdprAsirom);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprAsirom: types.GdprAsirom = await gdprAsiromServices.createGdprAsirom(req.body);
        res.status(201).json(newGdprAsirom);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprAsirom: types.GdprAsirom = await gdprAsiromServices.updateGdprAsirom(id, req.body);
    res.status(200).json(UpdateGdprAsirom);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprAsirom = await gdprAsiromServices.getGdprAsiromById(id);
        if(!gdprAsirom) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprAsirom);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
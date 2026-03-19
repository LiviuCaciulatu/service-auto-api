import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-groupama/types";
import * as gdprGroupamaServices from "@/entities/templates/gdpr-groupama/services/gdpr-groupama-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprGroupama: Array<types.GdprGroupama> = await gdprGroupamaServices.getAllGdprGroupama();
        res.json(gdprGroupama);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprGroupama: types.GdprGroupama = await gdprGroupamaServices.createGdprGroupama(req.body);
        res.status(201).json(newGdprGroupama);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprGroupama: types.GdprGroupama = await gdprGroupamaServices.updateGdprGroupama(id, req.body);
    res.status(200).json(UpdateGdprGroupama);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprGroupama = await gdprGroupamaServices.getGdprGroupamaById(id);
        if(!gdprGroupama) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprGroupama);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
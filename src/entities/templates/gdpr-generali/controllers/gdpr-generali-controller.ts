import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-generali/types";
import * as gdprGeneraliServices from "@/entities/templates/gdpr-generali/services/gdpr-generali-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprGenerali: Array<types.GdprGenerali> = await gdprGeneraliServices.getAllGdprGenerali();
        res.json(gdprGenerali);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprGenerali: types.GdprGenerali = await gdprGeneraliServices.createGdprGenerali(req.body);
        res.status(201).json(newGdprGenerali);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprGenerali: types.GdprGenerali = await gdprGeneraliServices.updateGdprGenerali(id, req.body);
    res.status(200).json(UpdateGdprGenerali);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprGenerali = await gdprGeneraliServices.getGdprGeneraliById(id);
        if(!gdprGenerali) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprGenerali);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
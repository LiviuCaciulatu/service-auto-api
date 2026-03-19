import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-hellas-direct/types";
import * as gdprHellasDirectServices from "@/entities/templates/gdpr-hellas-direct/services/gdpr-hellas-direct-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprHellasDirect: Array<types.GdprHellasDirect> = await gdprHellasDirectServices.getAllGdprHellasDirect();
        res.json(gdprHellasDirect);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprHellasDirect: types.GdprHellasDirect = await gdprHellasDirectServices.createGdprHellasDirect(req.body);
        res.status(201).json(newGdprHellasDirect);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprHellasDirect: types.GdprHellasDirect = await gdprHellasDirectServices.updateGdprHellasDirect(id, req.body);
    res.status(200).json(UpdateGdprHellasDirect);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprHellasDirect = await gdprHellasDirectServices.getGdprHellasDirectById(id);
        if(!gdprHellasDirect) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprHellasDirect);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
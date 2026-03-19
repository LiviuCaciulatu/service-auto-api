import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/gdpr-grawe/types";
import * as gdprGraweServices from "@/entities/templates/gdpr-grawe/services/gdpr-grawe-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const gdprGrawe: Array<types.GdprGrawe> = await gdprGraweServices.getAllGdprGrawe();
        res.json(gdprGrawe);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newGdprGrawe: types.GdprGrawe = await gdprGraweServices.createGdprGrawe(req.body);
        res.status(201).json(newGdprGrawe);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateGdprGrawe: types.GdprGrawe = await gdprGraweServices.updateGdprGrawe(id, req.body);
    res.status(200).json(UpdateGdprGrawe);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const gdprGrawe = await gdprGraweServices.getGdprGraweById(id);
        if(!gdprGrawe) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(gdprGrawe);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
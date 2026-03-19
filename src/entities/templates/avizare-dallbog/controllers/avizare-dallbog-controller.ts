import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/avizare-dallbog/types";
import * as avizareDallbogServices from "@/entities/templates/avizare-dallbog/services/avizare-dallbog-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const avizareDallbog: Array<types.AvizareDallbog> = await avizareDallbogServices.getAllAvizareDallbog();
        res.json(avizareDallbog);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newAvizareDallbog: types.AvizareDallbog = await avizareDallbogServices.createAvizareDallbog(req.body);
        res.status(201).json(newAvizareDallbog);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateAvizareDallbog: types.AvizareDallbog = await avizareDallbogServices.updateAvizareDallbog(id, req.body);
    res.status(200).json(UpdateAvizareDallbog);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const avizareDallbog = await avizareDallbogServices.getAvizareDallbogById(id);
        if(!avizareDallbog) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(avizareDallbog);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
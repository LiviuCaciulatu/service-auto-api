import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/contract-inlocuire-temporara/types";
import * as contractInlocuireTemporaraServices from "@/entities/contract-inlocuire-temporara/services/contract-inlocuire-temporara-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    const contractInlocuireTemporara: Array<types.ContractInlocuireTemporara> = await contractInlocuireTemporaraServices.getAllContractInlocuireTemporara();
    res.json(contractInlocuireTemporara);
})
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
    const newContractInlocuireTemporara: types.ContractInlocuireTemporara = await contractInlocuireTemporaraServices.createContractInlocuireTemporara(req.body);
    res.status(201).json(newContractInlocuireTemporara);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateContractInlocuireTemporara: types.ContractInlocuireTemporara = await contractInlocuireTemporaraServices.updateContractInlocuireTemporara(id, req.body);
    res.status(200).json(UpdateContractInlocuireTemporara);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const contractInlocuireTemporara = await contractInlocuireTemporaraServices.getContractInlocuireTemporaraById(id);
        if (!contractInlocuireTemporara) {
            return res.status(404).json({message: "Contract inlocuire temporara not found"});
        }
        res.status(200).json(contractInlocuireTemporara);
    } catch (error) {
        console.error("Error fetching contract inlocuire temporara: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
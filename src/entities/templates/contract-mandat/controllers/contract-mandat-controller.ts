import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/templates/contract-mandat/types";
import * as contractMandatServices from "@/entities/templates/contract-mandat/services/contract-mandat-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
        const contractMandat: Array<types.ContractMandat> = await contractMandatServices.getAllContractMandat();
        res.json(contractMandat);
    })
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
        const newContractMandat: types.ContractMandat = await contractMandatServices.createContractMandat(req.body);
        res.status(201).json(newContractMandat);
    })
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateContractMandat: types.ContractMandat = await contractMandatServices.updateContractMandat(id, req.body);
    res.status(200).json(UpdateContractMandat);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const contractMandat = await contractMandatServices.getContractMandatById(id);
        if(!contractMandat) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(contractMandat);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
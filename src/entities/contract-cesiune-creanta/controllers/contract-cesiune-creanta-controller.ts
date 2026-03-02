import type {Request, Response} from 'express';

import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/contract-cesiune-creanta/types";
import * as contractCesiuneCreantaServices from "@/entities/contract-cesiune-creanta/services/contract-cesiune-creanta-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    const cesiuneCreanta: Array<types.ContractCesiuneCreanta> = await contractCesiuneCreantaServices.getAllContractCesiuneCreanta();
    res.json(cesiuneCreanta);
})
);

router.post('/', asyncHandler(async(req: Request, res: Response) =>{
    const newContractCesiuneCreanta: types.ContractCesiuneCreanta = await contractCesiuneCreantaServices.createContractCesiuneCreanta(req.body);
    res.status(201).json(newContractCesiuneCreanta);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const UpdateContractCesiuneCreanta: types.ContractCesiuneCreanta = await contractCesiuneCreantaServices.updateContractCesiuneCreanta(id, req.body);
    res.status(200).json(UpdateContractCesiuneCreanta);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try{
        const contractCesiuneCreanta = await contractCesiuneCreantaServices.getContractCesiuneCreantaById(id);
        if(!contractCesiuneCreanta) {
            return res.status(404).json({message: "Contract cesiune creanta not found"});
        }
        res.status(200).json(contractCesiuneCreanta);
    } catch (error) {
        console.error("Error fetching contract cesiune creanta: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
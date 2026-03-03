import type {Request, Response} from 'express';

import {Router} from "express";
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/contract-reparatii-auto/types";
import * as contractReparatiiAutoServices from "@/entities/contract-reparatii-auto/services/contract-reparatii-auto-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response)=>{
    const contractReparatiiAuto: Array<types.ContractReparatiiAuto> = await contractReparatiiAutoServices.getAllContractReparatiiAuto();
    res.json(contractReparatiiAuto);
})
);

router.post("/", asyncHandler(async (req: Request, res: Response) =>{
    const newContractReparatiiAuto: types.ContractReparatiiAuto = await contractReparatiiAutoServices.createContractReparatiiAuto(req.body);
    res.status(201).json(newContractReparatiiAuto);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateContractReparatiiAuto: types.ContractReparatiiAuto = await contractReparatiiAutoServices.updateContractReparatiiAuto(id, req.body);
    res.status(200).json(updateContractReparatiiAuto);
})

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const contractReparatiiAuto = await contractReparatiiAutoServices.getContractReparatiiAutoById(id);
        if (!contractReparatiiAuto) {
            return res.status(404).json({message: "Contract reparatii auto not found"});
        }
        res.status(200).json(contractReparatiiAuto);
    } catch (error) {
        console.error("Error fetching contract reparatii auto: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
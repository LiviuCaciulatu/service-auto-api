import type {Request, Response} from "express";

import {Router} from "express";
import {asyncHandler} from "@/shared/async-handler";

import * as types from "@/entities/compensation-claim/types";
import * as compensationClaimServices from "@/entities/compensation-claim/services/compensation-claim-service";

const router: import("express").Router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
    const compensationClaim: Array<types.CompensationClaim> = await compensationClaimServices.getAllCompensationClaims();
    res.json(compensationClaim);
})
);

router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const newCompensationClaim: types.CompensationClaim = await compensationClaimServices.createCompensationClaim(req.body);
    res.status(201).json(newCompensationClaim);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (typeof id !== "string" || !id){
        return res.status(400).json({message: "Id is required"});
    }
    const updateCompensationClaim: types.CompensationClaim = await compensationClaimServices.updateCompensationClaim(id, req.body);
    res.status(200).json(updateCompensationClaim);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== "string" || !id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const compensationClaim = await compensationClaimServices.getCompensationClaimById(id);
        if (!compensationClaim) {
            return res.status(400).json({message: "Compensation claim not found"});
        }
        res.status(200).json(compensationClaim);
    }  catch (error) {
        console.error("Error fetching car document: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;

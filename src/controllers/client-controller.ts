import { Router } from "express"
import type { Request, Response, NextFunction } from "express";
import * as clientServices from "../services/client-services";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
    const clients = await clientServices.getAllClients();
    res.json(clients);
    } catch (err) {
    next(err);
    }
});

router.post ('/', async (req: Request, res: Response, next: NextFunction) => {
    try{
    const newClient = await clientServices.createClient(req.body);
    res.status(201).json(newClient);
    } catch(err) {
    next(err);
    }
});

export default router;
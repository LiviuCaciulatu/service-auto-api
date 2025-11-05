import { Router } from "express";
import * as clientServices from "../services/client-services";
const router = Router();
router.get("/", async (req, res, next) => {
    try {
        const clients = await clientServices.getAllClients();
        res.json(clients);
    }
    catch (err) {
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const newClient = await clientServices.createClient(req.body);
        res.status(201).json(newClient);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=client-controller.js.map
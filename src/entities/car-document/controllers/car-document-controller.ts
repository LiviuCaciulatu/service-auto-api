import type {Request, Response} from 'express';
import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";
import * as carDocumentServices from "@/entities/car-document/services/car-document-service";
import * as types from "@/entities/car-document/types";

const router = Router();

// cheama get all car documents din car-document-service
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const carDocuments: Array<types.CarDocument> = await carDocumentServices.getAllCarDocuments();
    res.json(carDocuments);
})
);

// cere car-document-service crearea unui car document
router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const newCarDocument: types.CarDocument = await carDocumentServices.createCarDocument(req.body);
    res.status(201).json(newCarDocument);
}))

export default router;
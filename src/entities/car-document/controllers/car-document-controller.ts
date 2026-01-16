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


router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateCarDocument: types.CarDocument = await carDocumentServices.updateCarDocument(id, req.body);
    res.status(200).json(updateCarDocument);
})

//TODO trebuie sa implementez metoda pentru get by id

export default router;
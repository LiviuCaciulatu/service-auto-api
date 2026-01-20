import type {Request, Response} from 'express';
import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";
import * as carDocumentServices from "@/entities/car-document/services/car-document-service";
import * as types from "@/entities/car-document/types";

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const carDocuments: Array<types.CarDocument> = await carDocumentServices.getAllCarDocuments();
    res.json(carDocuments);
})
);

router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const newCarDocument: types.CarDocument = await carDocumentServices.createCarDocument(req.body);
    res.status(201).json(newCarDocument);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateCarDocument: types.CarDocument = await carDocumentServices.updateCarDocument(id, req.body);
    res.status(200).json(updateCarDocument);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if(!id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const carDocument = await carDocumentServices.getCarDocumentById(id);
        if(!carDocument) {
            return res.status(404).json({message: "Car document not found"});
        }
        res.status(200).json(carDocument);
    } catch (error) {
        console.error("Error fetching car document: ", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;
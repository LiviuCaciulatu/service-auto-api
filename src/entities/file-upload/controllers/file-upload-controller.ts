import type {Request, Response} from "express";
import {Router} from "express";
import {asyncHandler} from "@/shared/async-handler";
import * as service from "@/entities/file-upload/services/file-upload-service";
import * as types from "@/entities/file-upload/types";


const router = Router();

router.post("/upload",
    service.upload.single("file"),
    asyncHandler(async (req: Request, res: Response) => {
        const record: types.FileUploadRecord = await service.handleFileUpload(req.file);
        res.status(201).json(record);
    })
);

export default router;
import type {Request} from "express";
import path from "path";
import multer from "multer";
import * as awsS3Service from "@/integrations/aws/services/aws-s3-service";
import * as repository from "@/entities/file-upload/repositories/file-upload-repository";
import * as types from "@/entities/file-upload/types";

const storage = multer.memoryStorage();

export const upload = multer({
    storage, fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type"));
        }
    }
})

export async function handleFileUpload(file: Express.Multer.File | undefined): Promise<types.FileUploadRecord> {
    if (!file) {
        const err = new Error("No file uploaded");
        (err as any).status = 400;
        (err as any).code = 400;
        throw err;
    }

    return uploadFile(file);
}

async function uploadFile(file: Express.Multer.File): Promise<types.FileUploadRecord> {
    const {url} = await awsS3Service.uploadToS3({
        buffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname,
        prefix: "uploads",
    });

    return await repository.createFileRecord(url);
}

import path from "path";
import {randomUUID} from "crypto";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import * as config from "@/integrations/aws/config/aws-config";
import * as types from "@/integrations/aws/types";

const s3Client = new S3Client(config.AWS_BASE_CONFIG);

export async function uploadToS3(input: types.S3UploadInput): Promise<types.S3UploadResult> {
    const ext = path.extname(input.originalName).toLocaleLowerCase()
    const prefix = input.prefix ?? "uploads"
    const key = `${prefix}/${randomUUID()}${ext}`
    const bucket = input.bucket ?? config.AWS_S3_BUCKET_NAME

    await s3Client.send(
        new PutObjectCommand({Bucket: bucket, Key: key, Body: input.buffer, ContentType: input.mimeType})
    )

    const url = `https://${bucket}.s3.${config.AWS_REGION}.amazonaws.com/${key}`

    return {key, url}
}
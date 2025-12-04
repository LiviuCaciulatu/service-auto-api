export type S3UploadResult = {
    key: string;
    url: string;
}

export type S3UploadInput = {
    buffer: Buffer;
    mimeType: string;
    originalName: string;
    prefix?: string;
    bucket?: string;
}

